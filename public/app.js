// Page script for Parts-dalys.eu. Loaded as a module so it works under a strict CSP.
import { SOURCES, REGIONS, VT } from "/shared/sources.js";
import { translate, LANGS } from "/shared/translate.js";
import { sourceLabel } from "/shared/i18n.js";
import { t, lang, onSwitch } from "/i18n.js";

const $ = (id) => document.getElementById(id);
const VT_KEYS = VT.map(([k]) => k);
const LANG_NAMES_LT = { lt: "lietuviškai", en: "angliškai", de: "vokiškai", pl: "lenkiškai", fr: "prancūziškai", it: "itališkai", es: "ispaniškai", nl: "olandiškai" };
const langName = (l) => {
  if (lang === "lt") return LANG_NAMES_LT[l] || l;
  try { return new Intl.DisplayNames([t.locale], { type: "language" }).of(l); } catch { return l; }
};
const regionName = (cc) => {
  try { return new Intl.DisplayNames([t.locale], { type: "region" }).of(cc === "UK" ? "GB" : cc); } catch { return cc; }
};
const st = { vt: "all", data: null, req: 0, lastQ: "", pageQ: "", cfg: { affiliate: {}, featured: [], adsense: null } };

const nf = new Map();
const fmt = (n, c) => {
  if (!nf.has(c)) {
    try { nf.set(c, new Intl.NumberFormat(t.locale, { style: "currency", currency: c })); }
    catch { nf.set(c, { format: (x) => `${x} ${c}` }); }
  }
  return nf.get(c).format(n);
};

// t() text whose {placeholders} become the given nodes or strings, e.g. <strong> counts.
const tNodes = (key, vars) => t(key).split(/\{(\w+)\}/).map((p, i) => (i % 2 ? vars[p] ?? "" : p)).filter((p) => p !== "");

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
  const lp = new URLSearchParams(location.search).get("lang");
  if (q && !own) u.searchParams.set("q", q);
  if (st.vt !== "all") u.searchParams.set("vt", st.vt);
  if (lp) u.searchParams.set("lang", lp);
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
  if (!ok) window.prompt(t("copy.prompt"), url);
  $("copied").textContent = ok ? t("copy.done") : "";
  clearTimeout(copyLink.t);
  copyLink.t = setTimeout(() => ($("copied").textContent = ""), 2500);
}

/* ---------- Static parts: chips, translations, links ---------- */

function renderChips() {
  $("vt").replaceChildren(...VT.map(([k]) =>
    el("button", {
      type: "button", class: "chip", "aria-pressed": String(st.vt === k),
      onclick: () => { if (st.vt === k) return; st.vt = k; renderChips(); run(); },
    }, t("vt." + k))));
}

function renderHow(q) {
  if (q.length < 2) { $("how").hidden = true; return; }
  const seen = new Set();
  const rows = [];
  for (const l of LANGS) {
    const t = translate(q, l);
    rows.push(el("li", {}, el("b", { title: langName(l) }, l), el("span", { lang: l }, t)));
    seen.add(t.toLowerCase());
  }
  $("how-list").replaceChildren(...rows);
  $("how").querySelector("summary").textContent =
    seen.size > 1 ? t("how.translated", { n: LANGS.length - 1 }) : t("how.none");
  $("how").hidden = false;
}

function renderLinks(q) {
  const term = q || "";
  st.linksQ = term;
  const ok = (s) => st.vt === "all" || s.t === "both" || s.t === st.vt;
  const groups = REGIONS.map(([key]) => {
    const name = t("region." + key);
    const list = SOURCES.filter((s) => s.r === key && ok(s));
    if (!list.length) return null;
    return el("section", { class: "region", "aria-label": name },
      el("h3", {}, name),
      el("div", { class: "grid" }, ...list.map((s) =>
        el("a", {
          class: "src", href: goHref(s.u(translate(term, s.l)), s.n), target: "_blank", rel: "noopener nofollow",
          title: sourceInfo(s) || s.d,
        }, el("span", { class: "cc" }, s.cc), el("span", {}, sourceLabel(s.n, t))))));
  });
  const list = groups.filter(Boolean);
  const half = Math.ceil(list.length / 2);
  // Two containers so the ad slot between them stays put (an AdSense <ins> must not be recreated).
  $("links").replaceChildren(...list.slice(0, half));
  $("links-b").replaceChildren(...list.slice(half));
  renderFeatured(term);
}

// Lithuanian info text as written; other languages join the source's info.<key> strings.
function sourceInfo(s) {
  if (lang === "lt" || !s.i) return lang === "lt" ? s.info : "";
  return s.i.split(" ").map((k) => t("info." + k, { c: regionName(s.cc) })).join("; ");
}

function renderFeatured(q) {
  const f = st.cfg.featured;
  $("featured").hidden = !f.length;
  if (!f.length) return;
  $("featured-list").replaceChildren(...f.map((x) => {
    const url = String(x.url).replace(/\{q\}/g, encodeURIComponent(q || ""));
    return el("a", { class: "fcard", href: goHref(url, x.n), target: "_blank", rel: "noopener sponsored" },
      el("span", { class: "adlabel" }, t("ad")),
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
    return stateBox("empty", t("empty.filtered.h"), t("empty.filtered.p"),
      el("button", { type: "button", class: "ghost", onclick: resetFilters }, t("empty.showAll")));
  }
  return stateBox("empty", t("empty.h"), t("empty.tips"),
    el("ul", {}, ...["empty.tip1", "empty.tip2", "empty.tip3", "empty.tip4"].map((k) => el("li", {}, t(k)))));
}

function resetFilters() {
  $("src").value = "";
  $("max").value = "";
  $("priced").checked = false;
  renderResults();
}

function thumb(i) {
  if (!i.image) return el("div", { class: "thumb", "aria-hidden": "true" }, t("nophoto"));
  const img = el("img", { class: "thumb", src: i.image, alt: "", loading: "lazy", decoding: "async", referrerpolicy: "no-referrer" });
  img.addEventListener("error", () => img.replaceWith(el("div", { class: "thumb", "aria-hidden": "true" }, t("nophoto"))), { once: true });
  return img;
}

function priceBox(i) {
  if (i.priceEur == null) return el("div", { class: "pr" }, el("span", { class: "na" }, t("price.onSite")));
  const ship = i.shippingEur
    ? t("price.ship", { p: fmt(i.priceEur, "EUR"), s: fmt(i.shippingEur, "EUR") })
    : i.shipping === 0 ? t("price.freeShip") : t("price.noShip");
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
    i.location && i.location !== i.country ? el("span", {}, t("item.from", { loc: i.location })) : null);
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
        t("src.failed") + bad.map((s) => s.name).join(", ")));
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
    $("rezultatai").replaceChildren(stateBox("info", t("linksOnly.h"), t("linksOnly.p"),
      el("a", { class: "ghost", href: "#links-h" }, t("linksOnly.btn"))));
    return;
  }
  const all = Array.isArray(d.items) ? d.items : [];
  let items = all.slice();

  const sources = [...new Set(all.map((i) => i.source))].sort((a, b) => a.localeCompare(b, t.locale));
  let src = $("src").value;
  if (src && !sources.includes(src)) src = "";
  $("src").replaceChildren(el("option", { value: "" }, t("src.all")),
    ...sources.map((x) => el("option", { value: x, selected: x === src }, x)));
  $("src").value = src;

  if (src) items = items.filter((i) => i.source === src);
  if ($("priced").checked) items = items.filter((i) => i.totalEur != null);
  const max = parseFloat(String($("max").value).replace(",", "."));
  if (Number.isFinite(max) && max > 0) items = items.filter((i) => i.totalEur == null || i.totalEur <= max); // unknown price stays unless "with price only"

  const s = $("sort").value;
  if (s === "price-desc") items.sort((a, b) => (b.totalEur ?? -1) - (a.totalEur ?? -1));
  else if (s === "source") items.sort((a, b) => a.source.localeCompare(b.source, t.locale) || (a.totalEur ?? Infinity) - (b.totalEur ?? Infinity));
  else items.sort((a, b) => (a.totalEur ?? Infinity) - (b.totalEur ?? Infinity));

  const priced = items.filter((i) => i.totalEur != null);
  const cheapest = priced.length ? Math.min(...priced.map((i) => i.totalEur)) : null;
  const srcCount = new Set(items.map((i) => i.source)).size;
  const sum = $("summary");
  if (items.length) {
    sum.replaceChildren(
      ...tNodes("sum.found", {
        n: el("strong", {}, String(items.length)), items: t.plural("sum.items", items.length),
        m: String(srcCount), srcs: t.plural("sum.srcs", srcCount),
      }),
      items.length !== all.length ? t("sum.of", { all: all.length }) : "",
      ...(cheapest != null ? tNodes("sum.cheapest", { p: el("strong", {}, fmt(cheapest, "EUR")) }) : ["."])
    );
  } else {
    sum.textContent = all.length ? t("sum.noneFiltered") : t("sum.none");
  }

  $("rezultatai").replaceChildren(...(items.length ? items.map(itemRow) : [emptyState(all.length > 0)]));
  renderSources(d);

  const notes = [];
  if (d.demo) notes.push(el("div", { class: "notice demo" }, t("note.demo")));
  if (d.rates?.source === "fallback") notes.push(el("div", { class: "notice" }, t("note.rates")));
  if (!Array.isArray(d.sources) && d.errors?.length) notes.push(el("div", { class: "notice" }, t("note.errors") + d.errors.join("; ")));
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
    $("summary").textContent = q ? t("min2") : "";
    $("rezultatai").replaceChildren();
    $("sources").replaceChildren();
    return;
  }
  const id = ++st.req;
  st.lastQ = q;
  $("summary").textContent = t("searching");
  $("sources").replaceChildren();
  $("rezultatai").setAttribute("aria-busy", "true");
  skeleton();
  try {
    const res = await fetch("/api/search?" + new URLSearchParams({ q, vt: st.vt }));
    let data = null;
    try { data = await res.json(); } catch { /* non-JSON error page */ }
    if (id !== st.req) return;
    if (!res.ok || !data) {
      // Server messages are Lithuanian; other languages map the known statuses.
      const known = { 400: "min2", 429: "err.rate", 500: "err.server" }[res.status];
      const fallback = t("err.status", { code: res.status });
      throw new Error(lang === "lt" ? data?.error || fallback : known ? t(known) : fallback);
    }
    st.data = data;
    renderResults();
  } catch (e) {
    if (id !== st.req) return;
    st.data = null;
    const offline = e instanceof TypeError;
    $("summary").textContent = t("err.failed") + ".";
    $("rezultatai").replaceChildren(stateBox("error", t("err.failed"),
      offline ? t("err.offline") : e.message,
      el("button", { type: "button", onclick: run }, t("retry"))));
  } finally {
    if (id === st.req) $("rezultatai").setAttribute("aria-busy", "false");
  }
}

$("f").addEventListener("submit", (e) => { e.preventDefault(); run(); });
for (const id of ["sort", "src", "priced"]) $(id).addEventListener("change", renderResults);
$("max").addEventListener("input", renderResults);
$("copy").addEventListener("click", copyLink);
onSwitch(() => shareUrl($("q").value.trim().slice(0, 120)));

readUrl();
renderChips();
run();
loadConfig().then(() => {
  renderLinks(st.linksQ);
  if (st.data && !st.data.linksOnly) renderResults();
  renderAds();
});
