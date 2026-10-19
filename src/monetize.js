// Revenue settings from env (affiliate params, paid placements, AdSense), outbound-click
// allow-list and in-memory stats. No dependencies.
import { createHash, timingSafeEqual } from "node:crypto";
import { SOURCES } from "./shared/sources.js";

// eBay Partner Network rotation ids (mkrid) per marketplace domain.
export const EBAY_ROTATION = {
  "ebay.com": "711-53200-19255-0",
  "ebay.co.uk": "710-53481-19255-0",
  "ebay.de": "707-53477-19255-0",
  "ebay.at": "5221-53469-19255-0",
  "ebay.fr": "709-53476-19255-0",
  "ebay.it": "724-53478-19255-0",
  "ebay.es": "1185-53479-19255-0",
  "ebay.nl": "1346-53482-19255-0",
  "ebay.com.au": "705-53470-19255-0",
};

export const today = (d = new Date()) => d.toISOString().slice(0, 10);

const isHttps = (u) => { try { return new URL(u).protocol === "https:"; } catch { return false; } };
const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function parseJson(raw, name, warn) {
  if (!raw || !String(raw).trim()) return undefined;
  try { return JSON.parse(raw); } catch { warn(`${name}: neteisingas JSON, ignoruojama`); return undefined; }
}

// {domain: "a=1&b=2"}; EPN params for eBay when EBAY_CAMPAIGN_ID is set; explicit entries win.
export function parseAffiliate(env = process.env, warn = console.warn) {
  const out = {};
  const camp = str(env.EBAY_CAMPAIGN_ID, 40);
  if (/^\d+$/.test(camp)) {
    for (const [d, rot] of Object.entries(EBAY_ROTATION)) out[d] = `mkcid=1&mkrid=${rot}&campid=${camp}&toolid=10001&mkevt=1`;
  }
  const map = parseJson(env.AFFILIATE_PARAMS, "AFFILIATE_PARAMS", warn);
  if (map !== undefined && (!map || typeof map !== "object" || Array.isArray(map))) warn("AFFILIATE_PARAMS: turi būti JSON objektas");
  else if (map) {
    for (const [d, qs] of Object.entries(map)) {
      const dom = d.trim().toLowerCase().replace(/^www\./, "");
      const q = str(qs, 500).replace(/^[?&]+/, "");
      if (/^[a-z0-9.-]+\.[a-z]{2,}$/.test(dom) && q) out[dom] = q;
    }
  }
  return out;
}

// Paid placements; expired, non-https or nameless entries dropped.
export function parseFeatured(env = process.env, day = today(), warn = console.warn) {
  const list = parseJson(env.FEATURED_SOURCES, "FEATURED_SOURCES", warn);
  if (list === undefined) return [];
  if (!Array.isArray(list)) { warn("FEATURED_SOURCES: turi būti JSON masyvas"); return []; }
  return list.flatMap((f) => {
    if (!f || typeof f !== "object") return [];
    const n = str(f.n, 80), url = str(f.url, 1000), until = str(f.until, 10);
    if (!n || !isHttps(url)) return [];
    if (until && (!/^\d{4}-\d{2}-\d{2}$/.test(until) || until < day)) return [];
    return [{ n, url, info: str(f.info, 300), cc: str(f.cc, 3).toUpperCase(), ...(until && { until }) }];
  });
}

export function parseAdsense(env = process.env) {
  const client = str(env.ADSENSE_CLIENT, 40), slot = str(env.ADSENSE_SLOT, 20);
  // The client id alone loads the AdSense tag (site verification, Auto ads); a slot adds the manual ad units.
  if (!/^ca-pub-\d{10,20}$/.test(client)) return null;
  return { client, slot: /^\d+$/.test(slot) ? slot : null };
}

// Config is rebuilt once per day so FEATURED_SOURCES expiry applies without a restart.
export function createConfig(env = process.env, { now = () => new Date(), warn = console.warn } = {}) {
  let day = "", cfg;
  return function config() {
    const d = today(now());
    if (d !== day) {
      day = d;
      const featured = parseFeatured(env, d, warn);
      cfg = {
        affiliate: parseAffiliate(env, warn), featured, adsense: parseAdsense(env),
        hosts: [...new Set([...SOURCES.map((s) => s.d), ...featured.map((f) => new URL(f.url).hostname), "www.google.com"])],
      };
      warn = () => {}; // warn once per process
    }
    return cfg;
  };
}

const under = (host, d) => host === d || host.endsWith("." + d);

// Outbound URL allowed by /go, or null. Only https to a known host; no credentials or ports.
export function checkOutbound(raw, hosts) {
  let u;
  try { u = new URL(raw); } catch { return null; }
  if (u.protocol !== "https:" || u.username || u.password || u.port) return null;
  return hosts.some((d) => under(u.hostname, d)) ? u : null;
}

// Appends affiliate params for the URL's domain unless its keys are already there (the page may add them).
export function withAffiliate(u, affiliate) {
  const dom = Object.keys(affiliate).filter((d) => under(u.hostname, d)).sort((a, b) => b.length - a.length)[0];
  if (!dom) return u.toString();
  const add = new URLSearchParams(affiliate[dom]);
  for (const [k, v] of add) if (!u.searchParams.has(k)) u.searchParams.append(k, v);
  return u.toString();
}

// Constant-time token check; empty expected token never matches.
export function tokenOk(given, expected) {
  if (!expected || typeof given !== "string") return false;
  const h = (s) => createHash("sha256").update(s).digest();
  return timingSafeEqual(h(given), h(expected));
}

// In-memory counters, reset on restart. Keys are capped so junk input can't grow memory.
export function createStats({ now = () => new Date(), maxKeys = 2000 } = {}) {
  const since = now().toISOString();
  let searches = 0, pageviews = 0;
  const byPath = {}, bySource = {}, byDay = {};
  const bump = (o, k) => {
    if (!(k in o) && Object.keys(o).length >= maxKeys) k = "(kita)";
    o[k] = (o[k] || 0) + 1;
  };
  return {
    search() { searches++; },
    pageview(path) { pageviews++; bump(byPath, path); },
    click(source) { bump(bySource, source); bump(byDay, today(now())); },
    snapshot: () => ({ since, searches, pageviews, pageviewsByPath: { ...byPath }, clicks: { bySource: { ...bySource }, byDay: { ...byDay } } }),
  };
}
