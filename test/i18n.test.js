import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { UI_LANGS, STRINGS, LOCALES, LANG_LABELS, makeT, pickLang, sourceLabel } from "../src/shared/i18n.js";
import { translate } from "../src/shared/translate.js";
import { SOURCES, REGIONS, VT } from "../src/shared/sources.js";

const read = (f) => readFileSync(new URL("../public/" + f, import.meta.url), "utf8");
const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
const PAGES = ["index.html", "apie.html", "verslui.html", "privatumas.html"];

test("every UI string exists and is non-empty in all languages", () => {
  assert.deepEqual(UI_LANGS, ["lt", "en", "de", "fr", "fi", "lv", "et", "ru", "uk", "tr", "sv", "no", "pl"]);
  for (const l of UI_LANGS) assert.ok(LOCALES[l] && LANG_LABELS[l], l);
  const keys = Object.keys(STRINGS.lt);
  assert.ok(keys.length > 100, `only ${keys.length} keys`);
  for (const l of UI_LANGS) {
    assert.deepEqual(Object.keys(STRINGS[l]), keys, l);
    const ints = new Set(Array.from({ length: 200 }, (_, n) => new Intl.PluralRules(LOCALES[l]).select(n)));
    for (const k of keys) {
      const v = STRINGS[l][k], lt = STRINGS.lt[k];
      if (typeof lt === "string") {
        assert.ok(typeof v === "string" && v.trim(), `${l} ${k}`);
        assert.equal(vars(v), vars(lt), `${l} ${k} placeholders`);
      } else {
        assert.ok(v && typeof v.other === "string" && v.other.trim(), `${l} ${k} plural`);
        for (const c of ints) assert.ok(typeof v[c] === "string" && v[c].trim(), `${l} ${k} plural "${c}"`);
      }
    }
  }
});

test("every key used by the pages exists", () => {
  const used = new Set();
  for (const f of PAGES) {
    const html = read(f);
    for (const m of html.matchAll(/data-i18n="([^"]+)"/g)) used.add(m[1]);
    for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) m[1].split(";").forEach((p) => used.add(p.split(":")[1]));
    const page = html.match(/<body data-page="(\w+)"/)?.[1];
    if (page) used.add(page + ".title").add(page + ".desc");
  }
  for (const f of ["app.js", "page.js", "i18n.js"]) for (const m of read(f).matchAll(/\bt(?:\.plural)?\("([\w.]+)"/g)) used.add(m[1]);
  for (const [k] of REGIONS) used.add("region." + k);
  for (const [k] of VT) used.add("vt." + k);
  for (const s of SOURCES) for (const k of (s.i || "").split(" ").filter(Boolean)) used.add("info." + k);
  for (const k of used) if (!k.endsWith(".")) assert.ok(k in STRINGS.lt, `missing key ${k}`); // "vt." + k etc. checked above
  for (const s of SOURCES) assert.equal(!!s.info, !!s.i, `${s.n}: info and i go together`);
});

test("Lithuanian strings match the Lithuanian HTML", () => {
  for (const f of PAGES) {
    for (const m of read(f).matchAll(/data-i18n="([^"]+)"[^>]*>([^<]*)</g)) assert.equal(m[2], STRINGS.lt[m[1]], `${f} ${m[1]}`);
  }
});

test("static pages have a block for every language", () => {
  for (const f of ["apie.html", "verslui.html", "privatumas.html"]) {
    const html = read(f);
    assert.match(html, /<script type="module" src="\/i18n.js"><\/script>/, f);
    for (const l of UI_LANGS) {
      const n = html.match(new RegExp(`data-lang="${l}"`, "g"))?.length;
      assert.equal(n, 1, `${f} ${l}`);
    }
    assert.match(html, /<div data-lang="lt">/, f); // Lithuanian visible without JS
    assert.equal(html.match(/<div data-lang="\w+" lang="\w+" hidden>/g).length, UI_LANGS.length - 1, f);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${f} duplicate id`);
  }
});

test("language choice, plurals and labels", () => {
  assert.equal(pickLang("en-US"), "en");
  assert.equal(pickLang("nb-NO"), "no");
  assert.equal(pickLang("nn"), "no");
  assert.equal(pickLang("pt-BR", "de-AT"), "de");
  assert.equal(pickLang("pt-BR", undefined, ""), "lt");
  assert.equal(pickLang("UK"), "uk");
  assert.equal(pickLang("pl-PL"), "pl");
  assert.deepEqual([1, 3, 5, 22].map((n) => makeT("pl").plural("sum.items", n)), ["ogłoszenie", "ogłoszenia", "ogłoszeń", "ogłoszenia"]);
  const lt = makeT("lt"), ru = makeT("ru"), en = makeT("en");
  assert.deepEqual([1, 2, 10, 21].map((n) => lt.plural("sum.items", n)), ["skelbimas", "skelbimai", "skelbimų", "skelbimas"]);
  assert.deepEqual([1, 3, 5, 21].map((n) => ru.plural("sum.items", n)), ["объявление", "объявления", "объявлений", "объявление"]);
  assert.equal(en("price.ship", { p: "€10.00", s: "€5.00" }), "€10.00 + €5.00 shipping");
  assert.equal(makeT("xx").lang, "lt");
  assert.equal(sourceLabel("eBay.de (naudotos)", makeT("de")), "eBay.de (gebraucht)");
  assert.equal(sourceLabel("BAS World dalys", en), "BAS World parts");
  assert.equal(sourceLabel("Allegro sunkvežimiams", en), "Allegro for trucks");
  assert.equal(sourceLabel("eBay.de (naudotos)", lt), "eBay.de (naudotos)");
});

test("English, German and French part names translate like Lithuanian ones", () => {
  assert.equal(translate("Golf 5 alternator", "de"), "Golf 5 Lichtmaschine");
  assert.equal(translate("Golf 5 alternator", "lt"), "Golf 5 generatorius");
  assert.equal(translate("Golf 5 Anlasser", "fr"), "Golf 5 démarreur");
  assert.equal(translate("Golf 5 Anlasser", "en"), "Golf 5 starter motor");
  assert.equal(translate("Clio démarreur", "de"), "Clio Anlasser");
  assert.equal(translate("Clio DEMARREUR", "lt"), "Clio starteris");
  assert.equal(translate("Passat Stoßdämpfer", "es"), "Passat amortiguador");
  assert.equal(translate("Passat STOSSDAMPFER", "en"), "Passat shock absorber");
  // plural forms
  assert.equal(translate("BMW alternators", "fr"), "BMW alternateur");
  assert.equal(translate("Golf Bremsscheiben", "en"), "Golf brake disc");
  assert.equal(translate("disques de frein Clio", "de"), "Bremsscheibe Clio");
  assert.equal(translate("boîtes automatiques", "en"), "automatic gearbox");
  assert.equal(translate("discos de freno", "fr"), "disque de frein");
  assert.equal(translate("dischi freno", "en"), "brake disc");
  assert.equal(translate("remschijven", "de"), "Bremsscheibe");
  // unknown words and OEM numbers pass through
  assert.equal(translate("Golf 03L903023F", "de"), "Golf 03L903023F");
  assert.equal(translate("Golf Wischwasser", "fr"), "Golf Wischwasser");
});
