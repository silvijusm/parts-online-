// Runs all configured adapters in parallel, converts prices to EUR and caches results.
import { toEur, refreshRates } from "./currency.js";

const TTL = 15 * 60e3;

export function createSearch(adapters, { now = Date.now } = {}) {
  const cache = new Map();

  return async function search(q, { vehicleType = "all" } = {}) {
    const key = `${vehicleType}|${q.toLowerCase()}`;
    const hit = cache.get(key);
    if (hit && now() - hit.at < TTL) return hit.result;

    await refreshRates();
    const settled = await Promise.allSettled(adapters.map((a) => a.search(q, { vehicleType })));
    const items = [];
    const errors = [];
    settled.forEach((s, i) => {
      if (s.status === "rejected") return errors.push(`${adapters[i].name}: ${s.reason.message}`);
      items.push(...s.value.items);
      errors.push(...s.value.errors.map((e) => `${adapters[i].name}: ${e}`));
    });

    const seen = new Set();
    const out = [];
    for (const it of items) {
      if (seen.has(it.url)) continue;
      seen.add(it.url);
      const priceEur = toEur(it.price, it.currency);
      const shipEur = it.shipping != null ? toEur(it.shipping, it.shippingCurrency || it.currency) : null;
      out.push({ ...it, priceEur, shippingEur: shipEur, totalEur: priceEur != null ? Math.round((priceEur + (shipEur || 0)) * 100) / 100 : null });
    }
    // Priced items first, cheapest total first; unpriced keep their order at the end.
    out.sort((a, b) => (a.totalEur ?? Infinity) - (b.totalEur ?? Infinity));

    const result = { q, vehicleType, count: out.length, items: out, errors };
    cache.set(key, { at: now(), result });
    if (cache.size > 500) cache.delete(cache.keys().next().value);
    return result;
  };
}
