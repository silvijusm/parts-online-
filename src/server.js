// HTTP server: serves public/, /shared/ modules, /api/search, SEO pages and outbound /go. No dependencies, Node 20+.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createSearch } from "./search.js";
import { createEbayAdapter } from "./adapters/ebay.js";
import { createWebAdapter } from "./adapters/web.js";
import { createDemoAdapter } from "./adapters/demo.js";
import { ratesInfo } from "./currency.js";
import { createConfig, createStats, checkOutbound, withAffiliate, tokenOk } from "./monetize.js";
import { adsenseHead, injectHead, renderPartPage, renderPartsIndex, renderSitemap, renderRobots, siteUrl } from "./pages.js";
import { partBySlug } from "./shared/seo.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC_DIR = resolve(ROOT, "public");
const SHARED_DIR = resolve(ROOT, "src/shared");
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".woff2": "font/woff2", ".xml": "application/xml; charset=utf-8",
};
const TEXT = "text/plain; charset=utf-8";

const BASE_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// Hosts AdSense loads scripts, frames and beacons from (incl. Funding Choices consent message).
const AD_HOSTS = ["https://pagead2.googlesyndication.com", "https://googleads.g.doubleclick.net", "https://tpc.googlesyndication.com",
  "https://www.google.com", "https://adservice.google.com", "https://fundingchoicesmessages.google.com", "https://*.adtrafficquality.google"];

// Inline <script> blocks are allowed by hash, so the page works without 'unsafe-inline' for scripts.
// ads=true opens script/frame/connect sources for AdSense; otherwise the policy is unchanged.
export function csp(html = "", ads = false) {
  const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => `'sha256-${createHash("sha256").update(m[1]).digest("base64")}'`);
  const extra = ads ? AD_HOSTS : [];
  return [
    "default-src 'self'",
    ["script-src 'self'", ...hashes, ...extra].join(" "),
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' https: data:",
    ["connect-src 'self'", ...extra].join(" "),
    ...(ads ? [["frame-src 'self'", ...extra].join(" ")] : []),
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

// Maps a URL path to a file inside dir, or null if it escapes dir or names a hidden file.
export function safePath(dir, urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath); } catch { return null; }
  if (p.includes("\0") || p.split(/[/\\]/).some((seg) => seg.startsWith("."))) return null;
  const full = resolve(dir, "." + (p.startsWith("/") ? p : "/" + p));
  return full.startsWith(dir + sep) ? full : null;
}

// Fixed-window counter per key; returns seconds to wait, or 0 if allowed.
export function createRateLimiter({ limit = 30, windowMs = 60e3, now = Date.now } = {}) {
  const hits = new Map();
  return function check(key) {
    const t = now();
    let h = hits.get(key);
    if (!h || t >= h.reset) {
      if (hits.size > 10000) for (const [k, v] of hits) if (t >= v.reset) hits.delete(k);
      h = { count: 0, reset: t + windowMs };
      hits.set(key, h);
    }
    return ++h.count > limit ? Math.ceil((h.reset - t) / 1000) : 0;
  };
}

// Behind Render's proxy the client is the last X-Forwarded-For hop: the proxy appends the
// address it saw, while earlier hops come from the client and can be spoofed.
export function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  const last = (Array.isArray(xff) ? xff.at(-1) : xff || "").split(",").at(-1).trim();
  return last || req.socket.remoteAddress || "?";
}

export function buildAdapters(env = process.env) {
  const adapters = [];
  if (env.EBAY_CLIENT_ID && env.EBAY_CLIENT_SECRET) {
    adapters.push(createEbayAdapter({
      clientId: env.EBAY_CLIENT_ID, clientSecret: env.EBAY_CLIENT_SECRET, deliveryCountry: env.DELIVERY_COUNTRY ?? "LT",
      campaignId: env.EBAY_CAMPAIGN_ID || undefined, marketplaces: env.EBAY_MARKETPLACES,
    }));
  }
  if (env.BRAVE_API_KEY) adapters.push(createWebAdapter({ apiKey: env.BRAVE_API_KEY }));
  // Without API keys the site only offers direct links; sample data only on request (DEMO=1).
  if (!adapters.length && env.DEMO === "1") adapters.push(createDemoAdapter());
  return adapters;
}

export function createApp(adapters = buildAdapters(), { rateLimit = 30, rateWindowMs = 60e3, log = console.log, env = process.env, now = () => new Date() } = {}) {
  const search = createSearch(adapters);
  const config = createConfig(env, { now });
  const stats = createStats({ now });
  const base = siteUrl(env);
  const adsClient = /^ca-pub-\d{10,20}$/.test(String(env.ADSENSE_CLIENT || "").trim()) ? env.ADSENSE_CLIENT.trim() : "";
  const demo = adapters.length === 1 && adapters[0].name === "Pavyzdžiai";
  const linksOnly = adapters.length === 0;
  const limited = createRateLimiter({ limit: rateLimit, windowMs: rateWindowMs });

  return createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const cfg = config();
    const send = (code, body, type = "application/json; charset=utf-8", extra = {}) => {
      const isHtml = type.startsWith("text/html");
      if (isHtml && code === 200) {
        if (cfg.adsense) body = injectHead(String(body), adsenseHead(cfg.adsense));
        if (req.method === "GET") stats.pageview(url.pathname);
      }
      res.writeHead(code, {
        ...BASE_HEADERS,
        "Content-Security-Policy": csp(isHtml ? String(body) : "", isHtml && !!cfg.adsense),
        "Content-Type": type,
        ...extra,
      });
      res.end(req.method === "HEAD" ? undefined : typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
    };
    try {
      if (req.method !== "GET" && req.method !== "HEAD") return send(405, { error: "Metodas neleidžiamas" }, undefined, { Allow: "GET, HEAD" });
      if (url.pathname === "/healthz") return send(200, "ok", TEXT, { "Cache-Control": "no-store" });
      if (url.pathname === "/api/search") {
        const wait = limited(clientIp(req));
        if (wait) return send(429, { error: "Per daug paieškų. Pabandykite po minutės." }, undefined, { "Retry-After": String(wait) });
        const q = (url.searchParams.get("q") || "").trim().slice(0, 120);
        const vt = ["car", "truck"].includes(url.searchParams.get("vt")) ? url.searchParams.get("vt") : "all";
        if (q.length < 2) return send(400, { error: "Įrašykite bent 2 simbolius." });
        stats.search();
        if (linksOnly) return send(200, { q, vehicleType: vt, count: 0, items: [], errors: [], sources: [], linksOnly }, undefined, { "Cache-Control": "no-store" });
        const t0 = performance.now();
        const result = await search(q, { vehicleType: vt });
        log(`search q=${JSON.stringify(q)} vt=${vt} count=${result.count} ms=${Math.round(performance.now() - t0)}`);
        return send(200, { ...result, demo, rates: ratesInfo() }, undefined, { "Cache-Control": "no-store" });
      }
      if (url.pathname === "/api/status") {
        return send(200, { demo, linksOnly, adapters: adapters.map((a) => a.name), rates: ratesInfo() }, undefined, { "Cache-Control": "no-store" });
      }
      if (url.pathname === "/api/config") {
        const { affiliate, featured, adsense } = cfg;
        return send(200, { affiliate, featured, adsense }, undefined, { "Cache-Control": "no-cache" });
      }
      if (url.pathname === "/api/stats") {
        if (!tokenOk(url.searchParams.get("token"), env.STATS_TOKEN)) return send(404, "Nerasta", TEXT);
        return send(200, stats.snapshot(), undefined, { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" });
      }
      if (url.pathname === "/go") {
        const noindex = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
        const target = checkOutbound(url.searchParams.get("u") || "", cfg.hosts);
        if (!target) return send(400, "Neleistina nuoroda", TEXT, noindex);
        const source = (url.searchParams.get("s") || target.hostname).replace(/[\x00-\x1f]/g, "").trim().slice(0, 80) || target.hostname;
        stats.click(source);
        log(`click s=${JSON.stringify(source)} host=${target.hostname}`);
        return send(302, "", TEXT, { ...noindex, Location: withAffiliate(target, cfg.affiliate) });
      }
      if (url.pathname === "/ads.txt") {
        if (!adsClient) return send(404, "Nerasta", TEXT);
        return send(200, `google.com, ${adsClient.slice(3)}, DIRECT, f08c47fec0942fa0\n`, TEXT, { "Cache-Control": "public, max-age=3600" });
      }
      if (url.pathname === "/robots.txt") return send(200, renderRobots(base), TEXT, { "Cache-Control": "public, max-age=3600" });
      if (url.pathname === "/sitemap.xml") return send(200, renderSitemap(base), TYPES[".xml"], { "Cache-Control": "public, max-age=3600" });
      if (url.pathname === "/skelbimai") return send(301, "", TEXT, { Location: "/skelbimai/" });
      const dalys = url.pathname.match(/^\/dalys(?:\/([^/]*))?\/?$/);
      if (dalys) {
        if (!dalys[1]) return send(200, renderPartsIndex(base), TYPES[".html"], { "Cache-Control": "no-cache" });
        const part = partBySlug(dalys[1]);
        if (!part) return send(404, "Nerasta", TEXT);
        const page = renderPartPage(await readFile(join(PUBLIC_DIR, "index.html"), "utf8"), part, base);
        return send(200, page, TYPES[".html"], { "Cache-Control": "no-cache" });
      }
      const file = url.pathname.startsWith("/shared/")
        ? safePath(SHARED_DIR, url.pathname.slice("/shared".length))
        : safePath(PUBLIC_DIR, url.pathname.endsWith("/") ? url.pathname + "index.html" : url.pathname);
      if (!file) return send(404, "Nerasta", TEXT);
      const type = TYPES[extname(file).toLowerCase()] || "application/octet-stream";
      const body = await readFile(file);
      send(200, type.startsWith("text/html") ? body.toString() : body, type, {
        "Cache-Control": type.startsWith("text/html") ? "no-cache" : "public, max-age=600",
      });
    } catch (e) {
      if (e.code === "ENOENT" || e.code === "EISDIR" || e.code === "ENOTDIR") return send(404, "Nerasta", TEXT);
      console.error(e);
      if (!res.headersSent) send(500, { error: "Serverio klaida" });
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  const app = createApp();
  app.listen(port, () => console.log(`Parts-dalys.eu: http://localhost:${port}`));
  const stop = (sig) => {
    console.log(`${sig}: stabdoma`);
    app.close(() => process.exit(0));
    app.closeIdleConnections();
    setTimeout(() => process.exit(1), 10e3).unref();
  };
  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
}
