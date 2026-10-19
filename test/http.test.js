import { test } from "node:test";
import assert from "node:assert/strict";
import { request } from "node:http";
import { createApp, safePath, csp, buildAdapters } from "../src/server.js";
import { createDemoAdapter } from "../src/adapters/demo.js";

async function start(t, opts = {}, adapters = [createDemoAdapter()]) {
  const app = createApp(adapters, { log: () => {}, ...opts });
  await new Promise((r) => app.listen(0, r));
  t.after(() => app.close());
  return `http://localhost:${app.address().port}`;
}

// fetch() normalizes "..", so traversal is tested with a raw request path.
const raw = (base, path) => new Promise((ok, fail) => {
  const u = new URL(base);
  request({ host: u.hostname, port: u.port, path }, (res) => { res.resume(); ok(res.statusCode); }).on("error", fail).end();
});

test("serves files under public/ with content types and cache headers", async (t) => {
  const base = await start(t);
  const page = await fetch(base + "/");
  assert.equal(page.status, 200);
  assert.equal(page.headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(page.headers.get("cache-control"), "no-cache");
  assert.equal((await fetch(base + "/index.html")).status, 200);
  const mod = await fetch(base + "/shared/sources.js");
  assert.equal(mod.headers.get("content-type"), "text/javascript; charset=utf-8");
  assert.match(mod.headers.get("cache-control"), /max-age=\d+/);
  assert.equal((await fetch(base + "/nera.css")).status, 404);
  assert.equal((await fetch(base + "/api")).status, 404);
});

test("blocks path traversal and hidden files", async (t) => {
  const base = await start(t);
  for (const p of ["/../package.json", "/%2e%2e/package.json", "/..%2fpackage.json", "/shared/../server.js",
    "/shared/%2e%2e%2fserver.js", "/%2e%2e%5cpackage.json", "/.env", "/%00index.html", "/%E0%A4%A"]) {
    assert.equal(await raw(base, p), 404, p);
  }
  const dir = "/srv/public";
  assert.equal(safePath(dir, "/a/b.js"), "/srv/public/a/b.js");
  assert.equal(safePath(dir, "/../x"), null);
  assert.equal(safePath(dir, "/a/%2e%2e/%2e%2e/x"), null);
  assert.equal(safePath(dir, "/"), null);
});

test("sets security headers on pages, API and errors", async (t) => {
  const base = await start(t);
  for (const p of ["/", "/api/status", "/nera", "/healthz"]) {
    const r = await fetch(base + p);
    assert.equal(r.headers.get("x-content-type-options"), "nosniff", p);
    assert.equal(r.headers.get("x-frame-options"), "DENY", p);
    assert.ok(r.headers.get("referrer-policy"), p);
    const policy = r.headers.get("content-security-policy");
    assert.match(policy, /default-src 'self'/, p);
    assert.match(policy, /style-src [^;]*https:\/\/fonts\.googleapis\.com/, p);
    assert.match(policy, /font-src [^;]*https:\/\/fonts\.gstatic\.com/, p);
    assert.match(policy, /img-src [^;]*https:/, p);
    assert.match(policy, /frame-ancestors 'none'/, p);
  }
});

test("CSP allows inline scripts by hash only", () => {
  const p = csp(`<script type="module">alert(1)</script><script src="/a.js"></script>`);
  const scriptSrc = p.split("; ").find((d) => d.startsWith("script-src"));
  assert.equal(scriptSrc, "script-src 'self' 'sha256-bhHHL3z2vDgxUt0W3dWQOrprscmda2Y5pLsLg4GF+pI='");
  assert.doesNotMatch(scriptSrc, /unsafe-inline/);
});

test("GET /healthz returns ok", async (t) => {
  const base = await start(t);
  const r = await fetch(base + "/healthz");
  assert.equal(r.status, 200);
  assert.equal(await r.text(), "ok");
  assert.equal((await fetch(base + "/healthz", { method: "POST" })).status, 405);
});

test("rate-limits /api/search per client IP from X-Forwarded-For", async (t) => {
  const base = await start(t, { rateLimit: 3 });
  const get = (ip) => fetch(base + "/api/search?q=starteris", { headers: { "X-Forwarded-For": `${Math.random()}, ${ip}` } });
  for (let i = 0; i < 3; i++) assert.equal((await get("1.1.1.1")).status, 200);
  const r = await get("1.1.1.1");
  assert.equal(r.status, 429);
  assert.ok(Number(r.headers.get("retry-after")) > 0);
  assert.match((await r.json()).error, /Per daug/);
  assert.equal((await get("2.2.2.2")).status, 200, "other clients are not affected");
  assert.equal((await fetch(base + "/healthz")).status, 200, "health checks are not limited");
});

test("search results include per-source info and are logged", async (t) => {
  const lines = [];
  const slow = { name: "Lėtas", search: async () => { await new Promise((r) => setTimeout(r, 20)); return { items: [], errors: ["timeout"] }; } };
  const broken = { name: "Sugedęs", search: async () => { throw new Error("down"); } };
  const base = await start(t, { log: (l) => lines.push(l) }, [createDemoAdapter(), slow, broken]);
  const data = await (await fetch(base + "/api/search?q=Golf%20starteris&vt=truck")).json();
  const [demo, s, b] = data.sources;
  assert.deepEqual({ name: demo.name, count: demo.count, error: demo.error }, { name: "Pavyzdžiai", count: 8, error: undefined });
  assert.ok(Number.isInteger(demo.ms) && demo.ms >= 0);
  assert.equal(s.count, 0);
  assert.equal(s.error, "timeout");
  assert.ok(s.ms >= 15);
  assert.equal(b.error, "down");
  assert.equal(lines.length, 1);
  assert.match(lines[0], /^search q="Golf starteris" vt=truck count=8 ms=\d+$/);
});

test("buildAdapters passes eBay affiliate and marketplace settings", () => {
  const [ebay] = buildAdapters({ EBAY_CLIENT_ID: "a", EBAY_CLIENT_SECRET: "b", EBAY_CAMPAIGN_ID: "5338" });
  assert.equal(ebay.name, "eBay");
  assert.equal(buildAdapters({ DEMO: "1" })[0].name, "Pavyzdžiai");
});

test("without API keys the search answers in links-only mode", async (t) => {
  assert.deepEqual(buildAdapters({}), []);
  assert.equal(buildAdapters({ DEMO: "1" }).length, 1);
  const app = createApp([], { log: () => {} });
  await new Promise((r) => app.listen(0, r));
  t.after(() => app.close());
  const data = await (await fetch(`http://localhost:${app.address().port}/api/search?q=starteris`)).json();
  assert.equal(data.linksOnly, true);
  assert.deepEqual(data.items, []);
});
