import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { translate } from "../src/shared/translate.js";
import { normalizeEbay, createEbayAdapter } from "../src/adapters/ebay.js";
import { normalizeBrave, extractPrice } from "../src/adapters/web.js";
import { parseEcbXml, toEur } from "../src/currency.js";
import { createSearch } from "../src/search.js";
import { SOURCES } from "../src/shared/sources.js";

const fixture = (n) => JSON.parse(readFileSync(new URL(`./fixtures/${n}`, import.meta.url)));

test("translates Lithuanian part names, tolerating missing diacritics", () => {
  assert.equal(translate("Golf 5 starteris", "de"), "Golf 5 Anlasser");
  assert.equal(translate("audi a6 pavaru deze", "pl"), "audi a6 skrzynia biegów");
  assert.equal(translate("Volvo FH kabina", "en"), "Volvo FH cab");
  assert.equal(translate("03L903023F", "fr"), "03L903023F");
});

test("normalizes eBay Browse API items", () => {
  const [a, b] = normalizeEbay(fixture("ebay-search.json"), "EBAY_DE", "DE");
  assert.equal(a.price, 64.9);
  assert.equal(a.shipping, 9.9);
  assert.equal(a.url, "https://www.ebay.de/itm/1234");
  assert.equal(a.image, "https://i.ebayimg.com/images/g/abc/s-l225.jpg");
  assert.equal(b.currency, "PLN");
  assert.equal(b.shipping, null);
});

test("eBay adapter sends translated query, used-condition filter and marketplace header", async () => {
  const calls = [];
  const fetchImpl = async (url, opts) => {
    calls.push({ url: String(url), opts });
    if (String(url).includes("oauth2")) return new Response(JSON.stringify({ access_token: "T", expires_in: 7200 }));
    return new Response(JSON.stringify(fixture("ebay-search.json")));
  };
  const ad = createEbayAdapter({ clientId: "id", clientSecret: "secret", fetchImpl });
  const { items, errors } = await ad.search("Golf 5 starteris");
  assert.deepEqual(errors, []);
  assert.ok(items.length > 0);
  assert.equal(calls.filter((c) => c.url.includes("oauth2")).length, 1, "token is reused");
  const de = calls.find((c) => c.opts.headers["X-EBAY-C-MARKETPLACE-ID"] === "EBAY_DE");
  const u = new URL(de.url);
  assert.equal(u.searchParams.get("q"), "Golf 5 Anlasser");
  assert.match(u.searchParams.get("filter"), /conditionIds:\{3000\|7000\}/);
  assert.match(u.searchParams.get("filter"), /deliveryCountry:LT/);
});

test("reads prices from snippets in several formats", () => {
  assert.deepEqual(extractPrice("kaina 55,00 €"), { value: 55, currency: "EUR" });
  assert.deepEqual(extractPrice("£48 delivered"), { value: 48, currency: "GBP" });
  assert.deepEqual(extractPrice("Cena 1 249,99 zł"), { value: 1249.99, currency: "PLN" });
  assert.deepEqual(extractPrice("€1,234.50"), { value: 1234.5, currency: "EUR" });
  assert.equal(extractPrice("no price here"), null);
});

test("normalizes web results and maps them to known sites", () => {
  const sites = SOURCES.filter((s) => s.k === "google");
  const [a, b] = normalizeBrave(fixture("brave-search.json"), sites);
  assert.equal(a.source, "Ovoko");
  assert.equal(a.price, 55);
  assert.equal(a.title, "VW Golf V starteris 1.9 TDI | Ovoko");
  assert.equal(b.source, "Opisto");
  assert.equal(b.price, null);
});

test("parses ECB rates and converts to EUR", () => {
  const r = parseEcbXml(`<Cube currency='USD' rate='1.0800'/><Cube currency='PLN' rate='4.30'/>`);
  assert.equal(r.PLN, 4.3);
  assert.equal(toEur(43, "PLN"), 10);
  assert.equal(toEur(10, "XXX"), null);
});

test("search merges adapters, dedupes, sorts by total EUR, survives a failing adapter", async () => {
  const mk = (name, items) => ({ name, search: async () => ({ items, errors: [] }) });
  const search = createSearch([
    mk("A", [{ url: "u1", price: 100, currency: "EUR", shipping: 20, source: "A" }, { url: "u2", price: null, source: "A" }]),
    mk("B", [{ url: "u3", price: 50, currency: "EUR", source: "B" }, { url: "u1", price: 1, currency: "EUR", source: "B" }]),
    { name: "C", search: async () => { throw new Error("down"); } },
  ]);
  const r = await search("x");
  assert.deepEqual(r.items.map((i) => i.url), ["u3", "u1", "u2"]);
  assert.equal(r.items[1].totalEur, 120);
  assert.deepEqual(r.errors, ["C: down"]);
});
