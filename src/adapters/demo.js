// Sample results used when no API keys are configured, so the page can be tried out.
// Every item is flagged demo:true and the page labels it as an example.
import { translate } from "../shared/translate.js";

const SAMPLES = [
  ["DE", "eBay DE", "de", 64.9, "EUR", 9.9],
  ["PL", "eBay PL", "pl", 249, "PLN", 35],
  ["UK", "eBay UK", "en", 48, "GBP", 22],
  ["LT", "Ovoko", "lt", 55, "EUR", null],
  ["FR", "Opisto", "fr", 79, "EUR", null],
  ["US", "eBay US", "en", 59.99, "USD", 45],
  ["IT", "eBay IT", "it", 70, "EUR", 15],
  ["LT", "RRR.lt", "lt", 45, "EUR", null],
];

export function createDemoAdapter() {
  return {
    name: "Pavyzdžiai",
    async search(q) {
      return {
        items: SAMPLES.map(([cc, source, lang, price, currency, shipping], i) => ({
          id: `demo:${i}`,
          title: `${translate(q, lang)} (pavyzdys)`,
          price, currency, shipping, shippingCurrency: shipping ? currency : null,
          image: null,
          url: `https://example.com/pavyzdys/${i}`,
          condition: "Naudota",
          source, sourceKey: source, country: cc,
          demo: true,
        })),
        errors: [],
      };
    },
  };
}
