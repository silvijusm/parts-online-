// Page script for Parts-dalys.eu. Loaded as a module so it works under a strict CSP.
import { SOURCES, REGIONS, VT } from "/shared/sources.js";
import { translate, LANGS } from "/shared/translate.js";

const $ = (id) => document.getElementById(id);
const VT_KEYS = VT.map(([k]) => k);
const LANG_NAMES = { lt: "lietuviškai", en: "angliškai", de: "vokiškai", pl: "lenkiškai", fr: "prancūziškai", it: "itališkai", es: "ispaniškai", nl: "olandiškai" };
const st = { vt: "all", data: null, req: 0, lastQ: "", pageQ: "", cfg: { affiliate: {}, featured: [], adsense: null } };

const nf = new Map();
const fmt = (n, c) => {
  if (!nf.has(c)) {
    try { nf.set(c, new Intl.NumberFormat("lt-LT", { style: "currency", currency: c })); }
    catch { nf.set(c, { format: (x) => `${x} ${c}` }); }
  }
  return nf.get(c).format(n);
};

// Lithuanian plural forms: 1 skelbimas, 2 skelbimai, 10 skelbimų.
function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 9 && (m100 < 11 || m100 > 19)) return few;
  return many;
}

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") e.className = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? "" : v);
  }
  for (const k of kids) if (k != null && k !== false) e.append(k);
  return e;
}

/* ---------- Config and outbound links ---------- */

// Server-side settings: affiliate params per domain, paid (featured) sources, AdSense slot.
// Any failure just means: no affiliate params, no featured block, no ads.
async function loadConfig() {
  try {
    const res = await fetch("/api/config");
    if (!res.ok) return;
    const c = await res.json();
    st.cfg = {
      affiliate: c && typeof c.affiliate === "object" && c.affiliate ? c.affiliate : {},
      featured: Array.isArray(c?.featured) ? c.featured.filter((f) => f && f.n && /^https?:\/\//i.test(f.url || "")) : [],
      adsense: c?.adsense?.client && c?.adsense?.slot ? c.adsense : null,
    };
  } catch { /* keep defaults */ }
}

// Adds the configured affiliate query string for the URL's domain (exact host or subdomain).
function withAffiliate(url) {
  let u;
  try { u = new URL(url); } catch { return url; }
  const host = u.hostname.replace(/^www\./, "");
  const dom = Object.keys(st.cfg.affiliate).find((d) => {
    const k = d.replace(/^www\./, "").toLowerCase();
    return host === k || host.endsWith("." + k);
  });
  const qs = dom ? String(st.cfg.affiliate[dom] || "").replace(/^[?&]+/, "") : "";
  if (!qs) return url;
  const add = new URLSearchParams(qs);
  if ([...add.keys()].some((k) => u.searchParams.has(k))) return url; // already tagged (e.g. by the eBay API)
  const [base, hash] = url.split("#");
  return base + (base.includes("?") ? (/[?&]$/.test(base) ? "" : "&") : "?") + qs + (hash != null ? "#" + hash : "");
}

// Every outbound marketplace link goes through /go so clicks can be counted.
function goHref(url, source) {
  return "/go?u=" + encodeURIComponent(withAffiliate(url)) + "&s=" + encodeURIComponent(source || "");
}

/* ---------- URL state ---------- */

function readUrl() {
  const p = new URLSearchParams(location.search);
  // Initial query: ?q= first, then the SEO page's meta tag, then the input's prefilled value.
  const meta = document.querySelector('meta[name="initial-query"]')?.content?.trim() || "";
  st.pageQ = (meta || $("q").getAttribute("value") || "").trim().slice(0, 120);
  const q = (p.get("q") || "").trim();
  $("q").value = (q || st.pageQ).slice(0, 120);
  if (VT_KEYS.includes(p.get("vt"))) st.vt = p.get("vt");
}

function shareUrl(q) {
  const u = new URL(location.href);
  u.search = "";
  u.hash = "";
  // On a /dalys/<slug> page the path already carries its own query; keep that URL clean.
  const own = u.pathname.startsWith("/dalys/") && q === st.pageQ;
  if (q && !own) u.searchParams.set("q", q);
  if (st.vt !== "all") u.searchParams.set("vt", st.vt);
  return u.toString();
}

function writeUrl(q) {
  try { history.replaceState(null, "", shareUrl(q)); } catch { /* file:// or sandboxed */ }
}

async function copyLink() {
  const url = shareUrl($("q").value.trim());
  let ok = false;
  try { await navigator.clipboard.writeText(url); ok = true; } catch { /* fall back below */ }
  if (!ok) {
    const ta = el("textarea", { readonly: true, "aria-hidden": "true", class: "sr" });
    ta.value = url;
    document.body.append(ta);
    ta.select();
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
  }
  if (!ok) window.prompt("Nukopijuokite nuorodą:", url);
  $("copied").textContent = ok ? "Nuoroda nukopijuota" : "";
  clearTimeout(copyLink.t);
  copyLink.t = setTimeout(() => ($("copied").textContent = ""), 2500);
}

/* ---------- Static parts: chips, translations, links ---------- */

function renderChips() {
  $("vt").replaceChildren(...VT.map(([k, v]) =>
    el("button", {
      type: "button", class: "chip", "aria-pressed": String(st.vt === k),
      onclick: () => { if (st.vt === k) return; st.vt = k; renderChips(); run(); },
    }, v)));
}

function renderHow(q) {
  if (q.length < 2) { $("how").hidden = true; return; }
  const seen = new Set();
  const rows = [];
  for (const l of LANGS) {
    const t = translate(q, l);
    rows.push(el("li", {}, el("b", { title: LANG_NAMES[l] || l }, l), el("span", { lang: l }, t)));
    seen.add(t.toLowerCase());
  }
  $("how-list").replaceChildren(...rows);
  $("how").querySelector("summary").textContent =
    seen.size > 1 ? `Kaip ieškome: užklausa išversta į ${LANGS.length - 1} kalbas` : "Kaip ieškome: vertimo nėra, ieškoma originaliu tekstu";
  $("how").hidden = false;
}

function renderLinks(q) {
  const term = q || "";
  st.linksQ = term;
  const ok = (s) => st.vt === "all" || s.t === "both" || s.t === st.vt;
  const groups = REGIONS.map(([key, name]) => {
    const list = SOURCES.filter((s) => s.r === key && ok(s));
    if (!list.length) return null;
    return el("section", { class: "region", "aria-label": name },
      el("h3", {}, name),
      el("div", { class: "grid" }, ...list.map((s) =>
        el("a", {
          class: "src", href: goHref(s.u(translate(term, s.l)), s.n), target: "_blank", rel: "noopener nofollow",
          title: s.info || s.d,
        }, el("span", { class: "cc" }, s.cc), el("span", {}, s.n)))));
  });
  const list = groups.filter(Boolean);
  const half = Math.ceil(list.length / 2);
  // Two containers so the ad slot between them stays put (an AdSense <ins> must not be recreated).
  $("links").replaceChildren(...list.slice(0, half));
  $("links-b").replaceChildren(...list.slice(half));
  renderFeatured(term);
}

function renderFeatured(q) {
  const f = st.cfg.featured;
  $("featured").hidden = !f.length;
  if (!f.length) return;
  $("featured-list").replaceChildren(...f.map((x) => {
    const url = String(x.url).replace(/\{q\}/g, encodeURIComponent(q || ""));
    return el("a", { class: "fcard", href: goHref(url, x.n), target: "_blank", rel: "noopener sponsored" },
      el("span", { class: "adlabel" }, "Reklama"),
      el("span", { class: "fn" }, x.cc ? el("span", { class: "cc" }, String(x.cc)) : null, el("strong", {}, String(x.n))),
      x.info ? el("span", { class: "fi" }, String(x.info)) : null);
  }));
}

function renderAds() {
  const a = st.cfg.adsense;
  for (const slot of document.querySelectorAll(".ad-slot")) {
    slot.hidden = !a;
    if (!a || slot.dataset.filled) continue;
    slot.dataset.filled = "1";
    slot.append(el("ins", {
      class: "adsbygoogle", style: "display:block",
      "data-ad-client": a.client, "data-ad-slot": a.slot,
      "data-ad-format": "auto", "data-full-width-responsive": "true",
    }));
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* ad blocker */ }
  }
}

/* ---------- Results ---------- */

function skeleton() {
  const row = () => el("div", { class: "item skel", "aria-hidden": "true" },
    el("div", { class: "thumb" }),
    el("div", { class: "ti" }, el("div", { class: "bone w60" }), el("div", { class: "bone w35" })),
    el("div", { class: "pr" }, el("div", { class: "bone w20" })));
  $("rezultatai").replaceChildren(...Array.from({ length: 5 }, row));
}

function stateBox(kind, title, text, extra) {
  return el("div", { class: `state ${kind}` }, el("h3", {}, title), text ? el("p", {}, text) : null, extra);
}

function emptyState(filtered) {
  if (filtered) {
    return stateBox("empty", "Pagal filtrus nieko neliko",
      "Paieška rado skelbimų, bet jie neatitinka pasirinktų filtrų.",
      el("button", { type: "button", class: "ghost", onclick: resetFilters }, "Rodyti visus"));
  }
  return stateBox("empty", "Nieko nerasta", "Keli patarimai:",
    el("ul", {},
      el("li", {}, "Įrašykite originalų (OEM) detalės numerį, pvz. 03L903023F – jis vienodas visose šalyse."),
      el("li", {}, "Trumpinkite užklausą: markė, modelis ir detalė, be metų ar variklio kodo."),
      el("li", {}, "Pabandykite kitą transporto tipą arba „Visi“."),
      el("li", {}, "Pasinaudokite tiesioginėmis nuorodomis į svetaines žemiau.")));
}

function resetFilters() {
  $("src").value = "";
  $("max").value = "";
  $("priced").checked = false;
  renderResults();
}

function thumb(i) {
  if (!i.image) return el("div", { class: "thumb", "aria-hidden": "true" }, "be nuotr.");
  const img = el("img", { class: "thumb", src: i.image, alt: "", loading: "lazy", decoding: "async", referrerpolicy: "no-referrer" });
  img.addEventListener("error", () => img.replaceWith(el("div", { class: "thumb", "aria-hidden": "true" }, "be nuotr.")), { once: true });
  return img;
}

function priceBox(i) {
  if (i.priceEur == null) return el("div", { class: "pr" }, el("span", { class: "na" }, "kaina svetainėje"));
  const ship = i.shippingEur
    ? `${fmt(i.priceEur, "EUR")} + ${fmt(i.shippingEur, "EUR")} pristatymas`
    : i.shipping === 0 ? "nemokamas pristatymas" : "pristatymas nenurodytas";
  return el("div", { class: "pr" },
    el("div", { class: "eur" }, fmt(i.totalEur, "EUR")),
    el("div", { class: "orig" }, ship),
    i.currency && i.currency !== "EUR" ? el("div", { class: "orig" }, fmt(i.price, i.currency)) : null);
}

function itemRow(i) {
  const meta = el("div", { class: "m" },
    i.country ? el("span", { class: "cc" }, i.country) : null,
    el("span", {}, i.source),
    i.condition ? el("span", {}, i.condition) : null,
    i.location && i.location !== i.country ? el("span", {}, "siunčia iš " + i.location) : null);
  return el("a", { class: "item", href: goHref(i.url, i.source), target: "_blank", rel: "noopener nofollow" },
    thumb(i),
    el("div", { class: "ti" },
      el("div", { class: "t" }, i.title),
      i.snippet ? el("div", { class: "sn" }, i.snippet.slice(0, 200)) : null,
      meta),
    priceBox(i));
}

function renderSources(d) {
  const box = $("sources");
  if (!Array.isArray(d.sources) || !d.sources.length) {
    box.replaceChildren();
    return;
  }
  const okList = d.sources.filter((s) => !s.error);
  const bad = d.sources.filter((s) => s.error);
  const parts = okList.map((s) => `${s.name}: ${s.count ?? 0}`);
  const kids = [parts.join(" · ")];
  if (bad.length) {
    kids.push(parts.length ? " · " : "",
      el("span", { class: "bad", title: bad.map((s) => `${s.name}: ${s.error}`).join("\n") },
        "neatsakė: " + bad.map((s) => s.name).join(", ")));
  }
  box.replaceChildren(...kids);
}

function renderResults() {
  const d = st.data;
  if (!d) return;
  // Filters only make sense for aggregated results; vehicle-type chips stay because they filter the links.
  for (const id of ["sort", "src", "max", "priced"]) $(id).closest("label").hidden = !!d.linksOnly;
  if (d.linksOnly) {
    $("summary").textContent = "";
    $("sources").replaceChildren();
    $("notice").replaceChildren();
    $("rezultatai").replaceChildren(stateBox("info", "Rinkitės svetainę žemiau",
      "Bendras kainų sąrašas dar ruošiamas. Kol kas paspauskite svetainę žemiau: ji atsidarys su jūsų paieška, o detalės pavadinimas bus išverstas į tos šalies kalbą.",
      el("a", { class: "ghost", href: "#links-h" }, "Į svetainių sąrašą")));
    return;
  }
  const all = Array.isArray(d.items) ? d.items : [];
  let items = all.slice();

  const sources = [...new Set(all.map((i) => i.source))].sort((a, b) => a.localeCompare(b, "lt"));
  let src = $("src").value;
  if (src && !sources.includes(src)) src = "";
  $("src").replaceChildren(el("option", { value: "" }, "visi"),
    ...sources.map((x) => el("option", { value: x, selected: x === src }, x)));
  $("src").value = src;

  if (src) items = items.filter((i) => i.source === src);
  if ($("priced").checked) items = items.filter((i) => i.totalEur != null);
  const max = parseFloat(String($("max").value).replace(",", "."));
  if (Number.isFinite(max) && max > 0) items = items.filter((i) => i.totalEur == null || i.totalEur <= max); // unknown price stays unless "tik su kaina"

  const s = $("sort").value;
  if (s === "price-desc") items.sort((a, b) => (b.totalEur ?? -1) - (a.totalEur ?? -1));
  else if (s === "source") items.sort((a, b) => a.source.localeCompare(b.source, "lt") || (a.totalEur ?? Infinity) - (b.totalEur ?? Infinity));
  else items.sort((a, b) => (a.totalEur ?? Infinity) - (b.totalEur ?? Infinity));

  const priced = items.filter((i) => i.totalEur != null);
  const cheapest = priced.length ? Math.min(...priced.map((i) => i.totalEur)) : null;
  const srcCount = new Set(items.map((i) => i.source)).size;
  const sum = $("summary");
  if (items.length) {
    sum.replaceChildren(
      "Rasta ", el("strong", {}, String(items.length)), ` ${plural(items.length, "skelbimas", "skelbimai", "skelbimų")}`,
      ` iš ${srcCount} ${plural(srcCount, "šaltinio", "šaltinių", "šaltinių")}`,
      items.length !== all.length ? ` (iš viso ${all.length})` : "",
      ...(cheapest != null ? [", pigiausias ", el("strong", {}, fmt(cheapest, "EUR")), "."] : ["."])
    );
  } else {
    sum.textContent = all.length ? "Pagal filtrus skelbimų nėra." : "Skelbimų nerasta.";
  }

  $("rezultatai").replaceChildren(...(items.length ? items.map(itemRow) : [emptyState(all.length > 0)]));
  renderSources(d);

  const notes = [];
  if (d.demo) notes.push(el("div", { class: "notice demo" }, "Rodomi pavyzdiniai duomenys: serveris dar neprijungtas prie eBay ir paieškos API. Kainos ir skelbimai nėra tikri."));
  if (d.rates?.source === "fallback") notes.push(el("div", { class: "notice" }, "Valiutų kursai apytiksliai: nepavyko gauti šios dienos ECB kursų."));
  if (!Array.isArray(d.sources) && d.errors?.length) notes.push(el("div", { class: "notice" }, "Kai kurie šaltiniai neatsakė: " + d.errors.join("; ")));
  $("notice").replaceChildren(...notes);
}

/* ---------- Search ---------- */

async function run() {
  const q = $("q").value.trim().slice(0, 120);
  renderLinks(q);
  renderHow(q);
  writeUrl(q);
  $("copy").hidden = q.length < 2;
  if (q.length < 2) {
    st.data = null;
    $("summary").textContent = q ? "Įrašykite bent 2 simbolius." : "";
    $("rezultatai").replaceChildren();
    $("sources").replaceChildren();
    return;
  }
  const id = ++st.req;
  st.lastQ = q;
  $("summary").textContent = "Ieškoma…";
  $("sources").replaceChildren();
  $("rezultatai").setAttribute("aria-busy", "true");
  skeleton();
  try {
    const res = await fetch("/api/search?" + new URLSearchParams({ q, vt: st.vt }));
    let data = null;
    try { data = await res.json(); } catch { /* non-JSON error page */ }
    if (id !== st.req) return;
    if (!res.ok || !data) throw new Error(data?.error || `serveris grąžino klaidą ${res.status}`);
    st.data = data;
    renderResults();
  } catch (e) {
    if (id !== st.req) return;
    st.data = null;
    const offline = e instanceof TypeError;
    $("summary").textContent = "Paieška nepavyko.";
    $("rezultatai").replaceChildren(stateBox("error", "Paieška nepavyko",
      offline ? "Nepavyko susisiekti su serveriu. Patikrinkite interneto ryšį." : e.message,
      el("button", { type: "button", onclick: run }, "Bandyti dar kartą")));
  } finally {
    if (id === st.req) $("rezultatai").setAttribute("aria-busy", "false");
  }
}

$("f").addEventListener("submit", (e) => { e.preventDefault(); run(); });
for (const id of ["sort", "src", "priced"]) $(id).addEventListener("change", renderResults);
$("max").addEventListener("input", renderResults);
$("copy").addEventListener("click", copyLink);

readUrl();
renderChips();
run();
loadConfig().then(() => {
  renderLinks(st.linksQ);
  if (st.data && !st.data.linksOnly) renderResults();
  renderAds();
});
