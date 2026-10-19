import { test } from "node:test";
import assert from "node:assert/strict";
import { DICT, LANGS, ALIASES, XALIASES, translate, inflect } from "../src/shared/translate.js";
import { SOURCES, REGIONS, VT } from "../src/shared/sources.js";

const fold = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

test("dictionary rows are complete and keyed uniquely", () => {
  assert.deepEqual(LANGS, ["lt", "en", "de", "pl", "fr", "it", "es", "nl"]);
  assert.ok(DICT.length >= 110, `only ${DICT.length} rows`);
  const lt = new Set();
  for (const row of DICT) {
    assert.equal(row.length, LANGS.length, row[0]);
    row.forEach((t) => assert.ok(typeof t === "string" && t.trim(), row[0]));
    assert.ok(!lt.has(row[0]), `duplicate ${row[0]}`);
    lt.add(row[0]);
  }
  for (const k of [...Object.keys(ALIASES), ...Object.keys(XALIASES)]) assert.ok(lt.has(k), `alias key ${k} has no row`);
});

test("Lithuanian forms never point to two different rows", () => {
  const owner = new Map();
  for (const row of DICT) {
    const forms = [row[0], ...(ALIASES[row[0]] || [])];
    for (const f of [...forms, ...forms.flatMap(inflect)].map(fold)) {
      const prev = owner.get(f);
      assert.ok(!prev || prev === row[0], `"${f}" used by "${prev}" and "${row[0]}"`);
      owner.set(f, row[0]);
    }
  }
});

test("Lithuanian inflections and slang are recognised", () => {
  assert.equal(translate("Golf 5 starterio", "de"), "Golf 5 Anlasser");
  assert.equal(translate("Passat B6 generatoriaus", "pl"), "Passat B6 alternator");
  assert.equal(translate("Audi A6 žibinto", "fr"), "Audi A6 phare");
  assert.equal(translate("BMW variklio", "en"), "BMW engine");
  assert.equal(translate("VW Passat galinio žibinto", "pl"), "VW Passat lampa tylna");
  assert.equal(translate("Audi A4 dėžė", "de"), "Audi A4 Getriebe");
  assert.equal(translate("Opel turbo", "it"), "Opel turbina");
  assert.equal(translate("Scania lingės", "de"), "Scania Blattfeder");
  assert.equal(translate("Golf 4 granata", "nl"), "Golf 4 homokineet");
  assert.equal(translate("kompas", "en"), "kompas");
});

test("longest match wins over single words", () => {
  assert.equal(translate("Volvo FH galinis žibintas", "de"), "Volvo FH Rückleuchte");
  assert.equal(translate("Golf variklio kompiuteris", "en"), "Golf engine ECU");
  assert.equal(translate("Mercedes automatinė pavarų dėžė", "pl"), "Mercedes automatyczna skrzynia biegów");
  assert.equal(translate("veidrodėlio stiklas", "it"), "vetro specchietto");
  assert.equal(translate("dvimasis smagratis", "fr"), "volant bimasse");
});

test("matching ignores case and diacritics", () => {
  assert.equal(translate("audi a6 pavaru deze", "pl"), "audi a6 skrzynia biegów");
  assert.equal(translate("SAUGOS DIRZAS", "es"), "cinturón de seguridad");
  assert.equal(translate("lozysko kola", "en"), "wheel bearing");
  assert.equal(translate("vw golf (starteris)", "en"), "vw golf (starter motor)");
});

test("part names typed in other languages are translated too", () => {
  assert.equal(translate("BMW E90 Lenkgetriebe", "es"), "BMW E90 cremallera de dirección");
  assert.equal(translate("Golf starter motor", "pl"), "Golf rozrusznik");
  assert.equal(translate("Astra H skrzynia biegów", "fr"), "Astra H boîte de vitesses");
  assert.equal(translate("Actros fifth wheel", "de"), "Actros Sattelkupplung");
});

test("truck terms", () => {
  assert.equal(translate("Scania R oro sausintuvas", "pl"), "Scania R osuszacz powietrza");
  assert.equal(translate("Volvo FH16 pakabos pagalves", "de"), "Volvo FH16 Luftfederbalg");
  assert.equal(translate("MAN TGX intarderis", "it"), "MAN TGX intarder");
  assert.equal(translate("DAF XF balnas", "nl"), "DAF XF koppelschotel");
  assert.equal(translate("Actros tachografas", "fr"), "Actros chronotachygraphe");
});

test("up to two part terms; brand names and OEM numbers stay", () => {
  assert.equal(translate("starteris generatorius", "de"), "Anlasser Lichtmaschine");
  assert.equal(translate("Seat Leon sėdynė", "fr"), "Seat Leon siège");
  assert.equal(translate("Seat Ibiza", "de"), "Seat Ibiza");
  assert.equal(translate("03L903023F", "fr"), "03L903023F");
  assert.equal(translate("Golf 1K0 615 301 AA suportas", "en"), "Golf 1K0 615 301 AA brake caliper");
  assert.equal(translate("starteris", "xx"), "starter motor");
  assert.equal(translate("", "en"), "");
});

test("every source builds a valid https URL", () => {
  const regions = new Set(REGIONS.map(([k]) => k));
  const types = new Set(["car", "truck", "both"]);
  assert.ok(VT.some(([k]) => k === "all"));
  for (const s of SOURCES) {
    for (const f of ["r", "cc", "n", "d", "l", "t", "k"]) assert.ok(s[f], `${s.n} missing ${f}`);
    assert.ok(regions.has(s.r), `${s.n} region ${s.r}`);
    assert.ok(types.has(s.t), `${s.n} type ${s.t}`);
    assert.ok(LANGS.includes(s.l), `${s.n} lang ${s.l}`);
    assert.ok(["direct", "google", "home"].includes(s.k), `${s.n} kind ${s.k}`);
    const url = new URL(s.u(translate("Golf 5 starteris", s.l)));
    assert.equal(url.protocol, "https:", s.n);
    if (s.k === "direct") assert.ok(url.hostname.endsWith(s.d), `${s.n}: ${url.hostname}`);
    if (s.k === "google") assert.ok(url.searchParams.get("q").includes("site:" + s.d), s.n);
  }
});

test("no duplicate source name + domain pairs", () => {
  const seen = new Set();
  for (const s of SOURCES) {
    const key = s.n + "|" + s.d;
    assert.ok(!seen.has(key), key);
    seen.add(key);
  }
});
