// Web-search adapter (Brave Search API) for dismantler sites that have no public API.
// Returns listing pages found on those sites; price is read from the snippet when present.
// Docs: https://api-dashboard.search.brave.com/app/documentation/web-search/get-started
import { SOURCES } from "../shared/sources.js";
import { translate } from "../shared/translate.js";

const API = "https://api.search.brave.com/res/v1/web/search";

const CURRENCY = { "€": "EUR", eur: "EUR", "£": "GBP", gbp: "GBP", "$": "USD", usd: "USD", "zł": "PLN", pln: "PLN" };

export function extractPrice(text = "") {
  const m = text.match(/(€|£|\$)\s?(\d[\d\s.,]*)|(\d[\d\s.,]*)\s?(€|eur|zł|pln|£|gbp|usd)(?![a-z])/i);
  if (!m) return null;
  const sym = (m[1] || m[4]).toLowerCase();
  let num = (m[2] || m[3]).replace(/\s/g, "");
  // "1.234,50" → 1234.50 ; "1,234.50" → 1234.50 ; "120,00" → 120.00
  if (/,\d{1,2}$/.test(num)) num = num.replace(/\./g, "").replace(",", ".");
  else num = num.replace(/,/g, "");
  const value = Number(num);
  return Number.isFinite(value) && value > 0 ? { value, currency: CURRENCY[sym] } : null;
}

const strip = (s = "") => s.replace(/<[^>]+>/g, "");

export function createWebAdapter({ apiKey, fetchImpl = fetch }) {
  // Sites reached by site: search, grouped by query language so the part name is translated once per group.
  const groups = {};
  for (const s of SOURCES.filter((s) => s.k === "google")) (groups[s.l] ||= []).push(s);

  async function searchGroup(lang, sites, q) {
    const query = `${translate(q, lang)} (${sites.map((s) => "site:" + s.d).join(" OR ")})`;
    const res = await fetchImpl(`${API}?` + new URLSearchParams({ q: query, count: "20" }), {
      headers: { Accept: "application/json", "X-Subscription-Token": apiKey },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Brave ${res.status}`);
    return normalizeBrave(await res.json(), sites);
  }

  return {
    name: "Ardymo svetainės",
    async search(q, { vehicleType } = {}) {
      const jobs = Object.entries(groups).map(([lang, sites]) => {
        const picked = sites.filter((s) => !vehicleType || vehicleType === "all" || s.t === "both" || s.t === vehicleType);
        return picked.length ? searchGroup(lang, picked, q) : Promise.resolve([]);
      });
      const settled = await Promise.allSettled(jobs);
      return {
        items: settled.flatMap((s) => (s.status === "fulfilled" ? s.value : [])),
        errors: settled.filter((s) => s.status === "rejected").map((s) => s.reason.message),
      };
    },
  };
}

export function normalizeBrave(data, sites) {
  return (data.web?.results || []).map((r) => {
    const host = new URL(r.url).hostname.replace(/^www\./, "");
    const site = sites.find((s) => host === s.d || host.endsWith("." + s.d));
    const desc = strip(r.description);
    const price = extractPrice(strip(r.title) + " " + desc);
    return {
      id: `web:${r.url}`,
      title: strip(r.title),
      snippet: desc,
      price: price?.value ?? null,
      currency: price?.currency ?? null,
      image: r.thumbnail?.src || null,
      url: r.url,
      source: site?.n || host,
      sourceKey: host,
      country: site?.cc || null,
    };
  });
}
