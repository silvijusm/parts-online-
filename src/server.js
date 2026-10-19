// HTTP server: serves the page and /api/search. No dependencies, Node 20+.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createSearch } from "./search.js";
import { createEbayAdapter } from "./adapters/ebay.js";
import { createWebAdapter } from "./adapters/web.js";
import { createDemoAdapter } from "./adapters/demo.js";
import { ratesInfo } from "./currency.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const STATIC = { "/": "public/index.html" };
const SHARED_DIR = join(ROOT, "src/shared");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css" };

export function buildAdapters(env = process.env) {
  const adapters = [];
  if (env.EBAY_CLIENT_ID && env.EBAY_CLIENT_SECRET) {
    adapters.push(createEbayAdapter({ clientId: env.EBAY_CLIENT_ID, clientSecret: env.EBAY_CLIENT_SECRET, deliveryCountry: env.DELIVERY_COUNTRY ?? "LT" }));
  }
  if (env.BRAVE_API_KEY) adapters.push(createWebAdapter({ apiKey: env.BRAVE_API_KEY }));
  if (!adapters.length) adapters.push(createDemoAdapter());
  return adapters;
}

export function createApp(adapters = buildAdapters()) {
  const search = createSearch(adapters);
  const demo = adapters.length === 1 && adapters[0].name === "Pavyzdžiai";

  return createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const send = (code, body, type = "application/json; charset=utf-8") => {
      res.writeHead(code, { "Content-Type": type, "X-Content-Type-Options": "nosniff" });
      res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
    };
    try {
      if (url.pathname === "/api/search") {
        const q = (url.searchParams.get("q") || "").trim().slice(0, 120);
        const vt = ["car", "truck"].includes(url.searchParams.get("vt")) ? url.searchParams.get("vt") : "all";
        if (q.length < 2) return send(400, { error: "Įrašykite bent 2 simbolius." });
        return send(200, { ...(await search(q, { vehicleType: vt })), demo, rates: ratesInfo() });
      }
      if (url.pathname === "/api/status") {
        return send(200, { demo, adapters: adapters.map((a) => a.name), rates: ratesInfo() });
      }
      let file = STATIC[url.pathname];
      if (!file && url.pathname.startsWith("/shared/")) {
        const p = normalize(join(SHARED_DIR, url.pathname.slice("/shared/".length)));
        if (p.startsWith(SHARED_DIR + "/")) file = p.slice(ROOT.length);
      }
      if (!file) return send(404, "Nerasta", "text/plain; charset=utf-8");
      send(200, await readFile(join(ROOT, file)), TYPES[extname(file)] || "application/octet-stream");
    } catch (e) {
      if (e.code === "ENOENT") return send(404, "Nerasta", "text/plain; charset=utf-8");
      console.error(e);
      send(500, { error: "Serverio klaida" });
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  const app = createApp();
  app.listen(port, () => console.log(`Parts online.eu: http://localhost:${port}`));
}
