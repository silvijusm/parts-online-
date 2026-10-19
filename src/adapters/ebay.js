// eBay Browse API adapter: searches several eBay marketplaces for used items.
// Docs: https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search
import { translate } from "../shared/translate.js";

const API = "https://api.ebay.com";

// marketplace id, country code shown to the user, query language
export const MARKETPLACES = [
  ["EBAY_DE", "DE", "de"], ["EBAY_AT", "AT", "de"], ["EBAY_PL", "PL", "pl"],
  ["EBAY_GB", "UK", "en"], ["EBAY_FR", "FR", "fr"], ["EBAY_IT", "IT", "it"],
  ["EBAY_ES", "ES", "es"], ["EBAY_NL", "NL", "nl"], ["EBAY_US", "US", "en"],
];

// 3000 = Used, 7000 = For parts or not working
const CONDITIONS = "conditionIds:{3000|7000}";

export function createEbayAdapter({ clientId, clientSecret, deliveryCountry = "LT", campaignId, marketplaces, fetchImpl = fetch, limit = 30 }) {
  const wanted = parseList(marketplaces);
  const picked = MARKETPLACES.filter(([id]) => wanted.includes(id));
  const markets = picked.length ? picked : MARKETPLACES;
  // eBay Partner Network: with affiliateCampaignId the API returns itemAffiliateWebUrl.
  const ctx = [deliveryCountry && `contextualLocation=${encodeURIComponent(`country=${deliveryCountry}`)}`, campaignId && `affiliateCampaignId=${encodeURIComponent(campaignId)}`].filter(Boolean).join(",");
  let token = null;
  let tokenExpires = 0;
  let pending = null;

  // Parallel marketplace searches share one token request.
  function getToken() {
    if (token && Date.now() < tokenExpires - 60e3) return Promise.resolve(token);
    return (pending ||= fetchToken().finally(() => { pending = null; }));
  }

  async function fetchToken() {
    const res = await fetchImpl(`${API}/identity/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
      body: "grant_type=client_credentials&scope=" + encodeURIComponent("https://api.ebay.com/oauth/api_scope"),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`eBay token ${res.status}`);
    const data = await res.json();
    token = data.access_token;
    tokenExpires = Date.now() + data.expires_in * 1000;
    return token;
  }

  async function searchMarketplace([id, cc, lang], q, vehicleType) {
    const query = translate(q, lang) + (vehicleType === "truck" ? (lang === "de" ? " LKW" : lang === "pl" ? " ciężarowy" : " truck") : "");
    const filter = [CONDITIONS];
    if (deliveryCountry) filter.push(`deliveryCountry:${deliveryCountry}`);
    const url = `${API}/buy/browse/v1/item_summary/search?` + new URLSearchParams({ q: query, limit: String(limit), filter: filter.join(",") });
    const res = await fetchImpl(url, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        "X-EBAY-C-MARKETPLACE-ID": id,
        ...(ctx ? { "X-EBAY-C-ENDUSERCTX": ctx } : {}),
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`eBay ${id} ${res.status}`);
    return normalizeEbay(await res.json(), id, cc);
  }

  return {
    name: "eBay",
    async search(q, { vehicleType } = {}) {
      const settled = await Promise.allSettled(markets.map((m) => searchMarketplace(m, q, vehicleType)));
      const items = settled.flatMap((s) => (s.status === "fulfilled" ? s.value : []));
      const errors = settled.filter((s) => s.status === "rejected").map((s) => s.reason.message);
      return { items, errors };
    },
  };
}

// "EBAY_DE, ebay_pl" or ["EBAY_DE"] -> ["EBAY_DE", "EBAY_PL"]
export function parseList(v) {
  return (Array.isArray(v) ? v : String(v ?? "").split(",")).map((x) => x.trim().toUpperCase()).filter(Boolean);
}

export function normalizeEbay(data, marketplaceId, cc) {
  return (data.itemSummaries || []).map((it) => {
    const ship = it.shippingOptions?.[0]?.shippingCost;
    return {
      id: `ebay:${it.itemId}`,
      title: it.title,
      price: it.price ? Number(it.price.value) : null,
      currency: it.price?.currency || null,
      shipping: ship ? Number(ship.value) : null,
      shippingCurrency: ship?.currency || null,
      image: it.image?.imageUrl || it.thumbnailImages?.[0]?.imageUrl || null,
      url: it.itemAffiliateWebUrl || it.itemWebUrl,
      condition: it.condition || null,
      location: it.itemLocation?.country || null,
      source: `eBay ${cc}`,
      sourceKey: marketplaceId,
      country: cc,
    };
  });
}
