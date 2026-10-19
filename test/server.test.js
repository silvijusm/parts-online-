import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/server.js";
import { createDemoAdapter } from "../src/adapters/demo.js";

test("server serves the page, shared modules and demo search results", async (t) => {
  const app = createApp([createDemoAdapter()]);
  await new Promise((r) => app.listen(0, r));
  t.after(() => app.close());
  const base = `http://localhost:${app.address().port}`;

  const page = await fetch(base + "/");
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Parts/);

  assert.equal((await fetch(base + "/shared/translate.js")).status, 200);
  assert.equal((await fetch(base + "/shared/..%2f..%2fpackage.json")).status, 404);

  const res = await fetch(base + "/api/search?q=Golf%205%20starteris");
  const data = await res.json();
  assert.equal(data.demo, true);
  assert.ok(data.items.length >= 5);
  assert.ok(data.items.every((i, k, a) => k === 0 || (a[k - 1].totalEur ?? Infinity) <= (i.totalEur ?? Infinity)));

  assert.equal((await fetch(base + "/api/search?q=a")).status, 400);
});
