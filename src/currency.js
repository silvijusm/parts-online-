// EUR conversion using the European Central Bank daily reference rates.
const ECB_URL = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

// Used only until the first successful ECB fetch, so prices are approximate then.
const FALLBACK = { EUR: 1, USD: 1.08, GBP: 0.85, PLN: 4.3, CZK: 25, SEK: 11.5, NOK: 11.7, DKK: 7.46, CHF: 0.95, RON: 4.97, AUD: 1.65, CAD: 1.48 };

let rates = { ...FALLBACK };
let source = "fallback";
let fetchedAt = 0;

export function parseEcbXml(xml) {
  const out = { EUR: 1 };
  for (const m of xml.matchAll(/currency=['"]([A-Z]{3})['"]\s+rate=['"]([\d.]+)['"]/g)) out[m[1]] = Number(m[2]);
  return out;
}

export async function refreshRates(fetchImpl = fetch) {
  if (Date.now() - fetchedAt < 6 * 3600e3) return;
  try {
    const res = await fetchImpl(ECB_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`ECB ${res.status}`);
    const parsed = parseEcbXml(await res.text());
    if (Object.keys(parsed).length > 5) { rates = parsed; source = "ecb"; }
  } catch {
    // keep previous rates
  }
  fetchedAt = Date.now();
}

export function toEur(value, currency) {
  const r = rates[currency];
  if (value == null || !r) return null;
  return Math.round((value / r) * 100) / 100;
}

export const ratesInfo = () => ({ source, fetchedAt });
