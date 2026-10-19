import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp, csp } from "../src/server.js";
import { parseAffiliate, parseFeatured, parseAdsense, checkOutbound, withAffiliate, tokenOk, createStats, createConfig } from "../src/monetize.js";
import { slugify, PARTS, partBySlug } from "../src/shared/seo.js";
import { escapeHtml, renderPartPage } from "../src/pages.js";

const ADS = { ADSENSE_CLIENT: "ca-pub-1234567890123456", ADSENSE_SLOT: "9876543210" };

async function start(t, env = {}, opts = {}) {
  const lines = [];
  const app = createApp([], { log: (l) => lines.push(l), env, ...opts });
  await new Promise((r) => app.listen(0, r));
  t.after(() => app.close());
  return { base: `http://localhost:${app.address().port}`, lines };
}

test("affiliate params from AFFILIATE_PARAMS and eBay campaign id", () => {
  const warns = [];
  assert.deepEqual(parseAffiliate({ AFFILIATE_PARAMS: "{nope" }, (w) => warns.push(w)), {});
  assert.equal(warns.length, 1);
  assert.deepEqual(parseAffiliate({ AFFILIATE_PARAMS: "[1]" }, () => {}), {});
  assert.deepEqual(parseAffiliate({ AFFILIATE_PARAMS: '{"allegro.pl":"?aff_id=123","bad":"x","olx.pl":""}' }), { "allegro.pl": "aff_id=123" });
  const a = parseAffiliate({ EBAY_CAMPAIGN_ID: "5338", AFFILIATE_PARAMS: '{"ebay.it":"own=1"}' });
  assert.equal(a["ebay.de"], "mkcid=1&mkrid=707-53477-19255-0&campid=5338&toolid=10001&mkevt=1");
  assert.equal(a["ebay.com"], "mkcid=1&mkrid=711-53200-19255-0&campid=5338&toolid=10001&mkevt=1");
  assert.match(a["ebay.co.uk"], /mkrid=710-53481-19255-0/);
  assert.equal(a["ebay.it"], "own=1", "explicit entries win");
  assert.deepEqual(parseAffiliate({}), {});
});

test("featured sources drop expired and non-https entries", () => {
  const env = { FEATURED_SOURCES: JSON.stringify([
    { n: "Ardyk", url: "https://ardyk.lt/", info: "Ardymas Kaune", cc: "lt", until: "2026-10-19" },
    { n: "Senas", url: "https://senas.lt/", until: "2026-10-18" },
    { n: "Http", url: "http://x.lt/" },
    { n: "", url: "https://y.lt/" },
    { n: "Js", url: "javascript:alert(1)" },
    { n: "Amžinas", url: "https://amzinas.lt/" },
  ]) };
  const f = parseFeatured(env, "2026-10-19");
  assert.deepEqual(f.map((x) => x.n), ["Ardyk", "Amžinas"]);
  assert.deepEqual(f[0], { n: "Ardyk", url: "https://ardyk.lt/", info: "Ardymas Kaune", cc: "LT", until: "2026-10-19" });
  assert.deepEqual(parseFeatured({ FEATURED_SOURCES: "{" }, "2026-10-19", () => {}), []);
  assert.deepEqual(parseFeatured({ FEATURED_SOURCES: "{}" }, "2026-10-19", () => {}), []);
});

test("adsense config needs a valid client; slot is optional", () => {
  assert.deepEqual(parseAdsense(ADS), { client: ADS.ADSENSE_CLIENT, slot: ADS.ADSENSE_SLOT });
  assert.equal(parseAdsense({ ADSENSE_CLIENT: "ca-pub-12", ADSENSE_SLOT: "1" }), null);
  assert.deepEqual(parseAdsense({ ADSENSE_CLIENT: ADS.ADSENSE_CLIENT }), { client: ADS.ADSENSE_CLIENT, slot: null });
  assert.deepEqual(parseAdsense({ ADSENSE_CLIENT: ADS.ADSENSE_CLIENT, ADSENSE_SLOT: "1x" }), { client: ADS.ADSENSE_CLIENT, slot: null });
});

test("config refreshes featured expiry when the day changes", () => {
  let d = new Date("2026-10-19T12:00:00Z");
  const cfg = createConfig({ FEATURED_SOURCES: '[{"n":"A","url":"https://a.lt/","until":"2026-10-19"}]' }, { now: () => d });
  assert.equal(cfg().featured.length, 1);
  assert.ok(cfg().hosts.includes("a.lt"));
  d = new Date("2026-10-20T00:00:01Z");
  assert.equal(cfg().featured.length, 0);
  assert.ok(!cfg().hosts.includes("a.lt"));
});

test("GET /api/config returns affiliate, featured and adsense", async (t) => {
  const { base } = await start(t, { ...ADS, AFFILIATE_PARAMS: '{"allegro.pl":"aff=1"}', FEATURED_SOURCES: '[{"n":"A","url":"https://a.lt/"}]' });
  const r = await fetch(base + "/api/config");
  assert.equal(r.status, 200);
  const c = await r.json();
  assert.deepEqual(c.affiliate, { "allegro.pl": "aff=1" });
  assert.equal(c.featured[0].n, "A");
  assert.deepEqual(c.adsense, { client: ADS.ADSENSE_CLIENT, slot: ADS.ADSENSE_SLOT });
  const empty = await (await start(t)).base;
  assert.deepEqual(await (await fetch(empty + "/api/config")).json(), { affiliate: {}, featured: [], adsense: null });
});

test("outbound check allows only https to known hosts", () => {
  const hosts = ["allegro.pl", "ebay.com", "a.lt", "www.google.com"];
  for (const ok of ["https://allegro.pl/listing?string=x", "https://www.allegro.pl/", "https://www.google.com/search?q=site%3Aovoko.lt", "https://shop.a.lt/x"]) {
    assert.ok(checkOutbound(ok, hosts), ok);
  }
  for (const bad of ["http://allegro.pl/", "https://evilallegro.pl/", "https://allegro.pl.evil.com/", "https://google.com/", "https://maps.www.google.com.evil.io/",
    "https://user@allegro.pl/", "https://allegro.pl:8443/", "javascript:alert(1)", "//allegro.pl/", "/go", "", "https://www.ebay.com.au/"]) {
    assert.equal(checkOutbound(bad, hosts), null, bad);
  }
});

test("withAffiliate appends params once and picks the most specific domain", () => {
  const aff = { "ebay.com": "campid=1&mkevt=1", "allegro.pl": "aff=2" };
  assert.equal(withAffiliate(new URL("https://www.ebay.com/sch/i.html?_nkw=x"), aff), "https://www.ebay.com/sch/i.html?_nkw=x&campid=1&mkevt=1");
  assert.equal(withAffiliate(new URL("https://www.ebay.com/?campid=9"), aff), "https://www.ebay.com/?campid=9&mkevt=1");
  assert.equal(withAffiliate(new URL("https://www.ebay.com.au/?a=1"), aff), "https://www.ebay.com.au/?a=1");
});

test("GET /go redirects allowed URLs, counts clicks and refuses the rest", async (t) => {
  const { base, lines } = await start(t, { STATS_TOKEN: "s3cret", AFFILIATE_PARAMS: '{"allegro.pl":"aff=1"}', FEATURED_SOURCES: '[{"n":"Ardyk","url":"https://ardyk.lt/"}]' });
  const go = (u, s) => fetch(`${base}/go?` + new URLSearchParams({ u, ...(s && { s }) }), { redirect: "manual" });
  let r = await go("https://allegro.pl/listing?string=rozrusznik", "Allegro");
  assert.equal(r.status, 302);
  assert.equal(r.headers.get("location"), "https://allegro.pl/listing?string=rozrusznik&aff=1");
  assert.equal(r.headers.get("cache-control"), "no-store");
  assert.match(r.headers.get("x-robots-tag"), /noindex/);
  assert.equal(r.headers.get("x-frame-options"), "DENY");
  assert.equal((await go("https://www.google.com/search?q=site%3Aovoko.lt+starteris", "Ovoko")).status, 302);
  assert.equal((await go("https://ardyk.lt/paieska", "Ardyk")).status, 302);
  for (const bad of ["https://evil.com/", "http://allegro.pl/", "https://allegro.pl.evil.com/", "javascript:alert(1)", ""]) {
    r = await go(bad, "x");
    assert.equal(r.status, 400, bad);
    assert.equal(r.headers.get("location"), null);
    assert.equal(r.headers.get("cache-control"), "no-store");
  }
  assert.deepEqual(lines, ['click s="Allegro" host=allegro.pl', 'click s="Ovoko" host=www.google.com', 'click s="Ardyk" host=ardyk.lt']);
  const s = await (await fetch(base + "/api/stats?token=s3cret")).json();
  assert.deepEqual(s.clicks.bySource, { Allegro: 1, Ovoko: 1, Ardyk: 1 });
  assert.equal(Object.values(s.clicks.byDay)[0], 3);
});

test("GET /api/stats needs the token and counts searches and page views", async (t) => {
  const { base } = await start(t, { STATS_TOKEN: "s3cret" });
  await fetch(base + "/");
  await fetch(base + "/dalys/starteris");
  await fetch(base + "/dalys");
  await fetch(base + "/style.css");
  await fetch(base + "/api/search?q=starteris");
  await fetch(base + "/api/search?q=a");
  for (const q of ["", "?token=", "?token=wrong", "?token=s3cret1"]) assert.equal((await fetch(base + "/api/stats" + q)).status, 404, q);
  const r = await fetch(base + "/api/stats?token=s3cret");
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("cache-control"), "no-store");
  const s = await r.json();
  assert.equal(s.searches, 1);
  assert.equal(s.pageviews, 3);
  assert.deepEqual(s.pageviewsByPath, { "/": 1, "/dalys/starteris": 1, "/dalys": 1 });
  assert.ok(!Number.isNaN(Date.parse(s.since)));
  const off = (await start(t, {})).base;
  assert.equal((await fetch(off + "/api/stats?token=")).status, 404, "no STATS_TOKEN = disabled");
});

test("token compare and stats key cap", () => {
  assert.equal(tokenOk("a", "a"), true);
  assert.equal(tokenOk("a", "b"), false);
  assert.equal(tokenOk("", ""), false);
  assert.equal(tokenOk(null, "a"), false);
  const st = createStats({ maxKeys: 2 });
  for (const s of ["a", "b", "c", "d", "a"]) st.click(s);
  assert.deepEqual(st.snapshot().clicks.bySource, { a: 2, b: 1, "(kita)": 2 });
});

test("AdSense script, CSP and ads.txt only when configured", async (t) => {
  const plain = (await start(t)).base;
  let r = await fetch(plain + "/");
  assert.doesNotMatch(await r.text(), /adsbygoogle/);
  assert.equal(r.headers.get("content-security-policy"), csp(await (await fetch(plain + "/index.html")).text()));
  assert.doesNotMatch(r.headers.get("content-security-policy"), /googlesyndication|frame-src/);
  assert.equal((await fetch(plain + "/ads.txt")).status, 404);

  const ads = (await start(t, ADS)).base;
  for (const p of ["/", "/apie.html", "/dalys", "/dalys/starteris"]) {
    r = await fetch(ads + p);
    const html = await r.text();
    assert.ok(html.includes(`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS.ADSENSE_CLIENT}" crossorigin="anonymous"></script>`), p);
    assert.ok(html.indexOf("adsbygoogle.js") < html.indexOf("</head>"), p);
    const policy = r.headers.get("content-security-policy");
    for (const d of ["script-src", "connect-src", "frame-src"]) {
      const dir = policy.split("; ").find((x) => x.startsWith(d + " "));
      assert.match(dir, /https:\/\/pagead2\.googlesyndication\.com/, d);
      assert.match(dir, /https:\/\/fundingchoicesmessages\.google\.com/, d);
      assert.match(dir, /https:\/\/googleads\.g\.doubleclick\.net/, d);
    }
    assert.match(policy, /frame-ancestors 'none'/);
    assert.match(policy, /img-src 'self' https: data:/);
  }
  r = await fetch(ads + "/api/status");
  assert.doesNotMatch(r.headers.get("content-security-policy"), /googlesyndication/, "JSON keeps the strict policy");
  r = await fetch(ads + "/ads.txt");
  assert.equal(r.status, 200);
  assert.equal(await r.text(), "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n");
});

test("slugs are ascii, hyphenated and unique", () => {
  assert.equal(slugify("Pavarų dėžė"), "pavaru-deze");
  assert.equal(slugify("oro džiovintuvas"), "oro-dziovintuvas");
  assert.equal(slugify("EGR vožtuvas "), "egr-voztuvas");
  assert.equal(slugify("Ąčęėįšųūž"), "aceeisuuz");
  assert.ok(PARTS.length > 50);
  assert.ok(PARTS.every((p) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)));
  assert.equal(new Set(PARTS.map((p) => p.slug)).size, PARTS.length);
  assert.equal(partBySlug("starteris").name, "starteris");
  assert.equal(partBySlug("nera"), null);
});

test("SEO landing pages, index, sitemap and robots", async (t) => {
  const { base } = await start(t, { SITE_URL: "https://parts-dalys.eu/" });
  let r = await fetch(base + "/dalys/pavaru-deze");
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("content-type"), "text/html; charset=utf-8");
  const html = await r.text();
  assert.match(html, /<title>Naudota detalė: Pavarų dėžė – paieška visoje Europoje \| Parts-dalys\.eu<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/parts-dalys\.eu\/dalys\/pavaru-deze">/);
  assert.match(html, /<meta property="og:title" content="Naudota detalė: Pavarų dėžė[^"]*">/);
  assert.match(html, /<meta name="description" content="Pavarų dėžė[^"]*">/);
  assert.match(html, /<meta name="initial-query" content="pavarų dėžė">/);
  assert.match(html, /<input[^>]*id="q"[^>]*value="pavarų dėžė"/);
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal((html.match(/name="description"/g) || []).length, 1);
  assert.equal((await fetch(base + "/dalys/starteris/")).status, 200);
  assert.equal((await fetch(base + "/dalys/nera-tokios")).status, 404);
  assert.equal((await fetch(base + "/dalys/starteris/x")).status, 404);

  r = await fetch(base + "/dalys");
  const idx = await r.text();
  assert.equal(r.status, 200);
  assert.match(idx, /<html lang="lt">/);
  assert.match(idx, /href="\/style\.css"/);
  assert.equal((idx.match(/href="\/dalys\/[a-z0-9-]+"/g) || []).length, PARTS.length);

  r = await fetch(base + "/sitemap.xml");
  assert.equal(r.headers.get("content-type"), "application/xml; charset=utf-8");
  const sm = await r.text();
  for (const p of ["/", "/apie.html", "/verslui.html", "/privatumas.html", "/dalys", "/dalys/starteris"]) {
    assert.ok(sm.includes(`<loc>https://parts-dalys.eu${p}</loc>`), p);
  }
  assert.equal((sm.match(/<url>/g) || []).length, PARTS.length + 5);

  const robots = await (await fetch(base + "/robots.txt")).text();
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Disallow: \/go\$$/m);
  assert.match(robots, /^Disallow: \/go\?$/m);
  assert.doesNotMatch(robots, /^Disallow: \/go$/m); // would also block /google*.html
  assert.match(robots, /^Disallow: \/api\/$/m);
  assert.match(robots, /^Sitemap: https:\/\/parts-dalys\.eu\/sitemap\.xml$/m);

  const def = (await start(t, {})).base;
  assert.match(await (await fetch(def + "/robots.txt")).text(), /Sitemap: https:\/\/parts-dalys\.eu\/sitemap\.xml/);
});

test("landing page HTML-escapes injected values", () => {
  assert.equal(escapeHtml(`<a href="x">'&`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;");
  const page = renderPartPage(`<html><head><title>x</title></head><body><main><input id="q" type="search"></main></body></html>`,
    { slug: "x", name: `a"<b>`, en: "<i>" }, "https://e.lt");
  assert.ok(!page.includes("<b>") && !page.includes("<i>"));
  assert.match(page, /<input id="q" type="search" value="a&quot;&lt;b&gt;">/);
  assert.match(page, /<meta name="description" content="A&quot;&lt;b&gt;/);
  assert.match(page, /<link rel="canonical" href="https:\/\/e\.lt\/dalys\/x">/);
});
