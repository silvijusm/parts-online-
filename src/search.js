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
    const timed = (a) => {
      const t0 = performance.now();
      const ms = () => Math.round(performance.now() - t0);
      return a.search(q, { vehicleType }).then((v) => ({ v, ms: ms() }), (e) => { throw { e, ms: ms() }; });
    };
    const settled = await Promise.allSettled(adapters.map(timed));
    const items = [];
    const errors = [];
    const sources = [];
    settled.forEach((s, i) => {
      const name = adapters[i].name;
      if (s.status === "rejected") {
        const msg = s.reason.e?.message ?? String(s.reason.e);
        errors.push(`${name}: ${msg}`);
        return sources.push({ name, count: 0, ms: s.reason.ms, error: msg });
      }
      const { items: got = [], errors: errs = [] } = s.value.v;
      items.push(...got);
      errors.push(...errs.map((e) => `${name}: ${e}`));
      sources.push({ name, count: got.length, ms: s.value.ms, ...(errs.length ? { error: errs.join("; ") } : {}) });
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

    const result = { q, vehicleType, count: out.length, items: out, errors, sources };
    cache.set(key, { at: now(), result });
    if (cache.size > 500) cache.delete(cache.keys().next().value);
    return result;
  };
}
