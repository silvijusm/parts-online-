import { test } from "node:test";
import assert from "node:assert/strict";
import { createEbayAdapter, parseList } from "../src/adapters/ebay.js";

function recorder() {
  const calls = [];
  const fetchImpl = async (url, opts) => {
    calls.push({ url: String(url), headers: opts.headers });
    if (String(url).includes("oauth2")) return new Response(JSON.stringify({ access_token: "T", expires_in: 7200 }));
    return new Response(JSON.stringify({ itemSummaries: [{ itemId: "1", title: "x", itemWebUrl: "https://www.ebay.de/itm/1", itemAffiliateWebUrl: "https://www.ebay.de/itm/1?campid=5338" }] }));
  };
  return { calls, fetchImpl, searches: () => calls.filter((c) => !c.url.includes("oauth2")) };
}

test("sends affiliate campaign id with contextual location when EBAY_CAMPAIGN_ID is set", async () => {
  const r = recorder();
  const ad = createEbayAdapter({ clientId: "a", clientSecret: "b", campaignId: "5338000000", fetchImpl: r.fetchImpl });
  const { items } = await ad.search("starteris");
  for (const c of r.searches()) {
    assert.equal(c.headers["X-EBAY-C-ENDUSERCTX"], "contextualLocation=country%3DLT,affiliateCampaignId=5338000000");
  }
  assert.equal(items[0].url, "https://www.ebay.de/itm/1?campid=5338");
});

test("omits affiliate id without campaign and header without country", async () => {
  const r = recorder();
  await createEbayAdapter({ clientId: "a", clientSecret: "b", fetchImpl: r.fetchImpl }).search("x");
  assert.equal(r.searches()[0].headers["X-EBAY-C-ENDUSERCTX"], "contextualLocation=country%3DLT");
  const r2 = recorder();
  await createEbayAdapter({ clientId: "a", clientSecret: "b", deliveryCountry: "", fetchImpl: r2.fetchImpl }).search("x");
  assert.equal(r2.searches()[0].headers["X-EBAY-C-ENDUSERCTX"], undefined);
  const r3 = recorder();
  await createEbayAdapter({ clientId: "a", clientSecret: "b", deliveryCountry: "", campaignId: "77", fetchImpl: r3.fetchImpl }).search("x");
  assert.equal(r3.searches()[0].headers["X-EBAY-C-ENDUSERCTX"], "affiliateCampaignId=77");
});

test("EBAY_MARKETPLACES limits which marketplaces are searched", async () => {
  const r = recorder();
  await createEbayAdapter({ clientId: "a", clientSecret: "b", marketplaces: "ebay_de, EBAY_PL,EBAY_XX", fetchImpl: r.fetchImpl }).search("x");
  assert.deepEqual(r.searches().map((c) => c.headers["X-EBAY-C-MARKETPLACE-ID"]).sort(), ["EBAY_DE", "EBAY_PL"]);
  const all = recorder();
  await createEbayAdapter({ clientId: "a", clientSecret: "b", marketplaces: "EBAY_XX", fetchImpl: all.fetchImpl }).search("x");
  assert.equal(all.searches().length, 9, "unknown ids fall back to all marketplaces");
  assert.deepEqual(parseList(" a, ,b "), ["A", "B"]);
});
