// UI language for every page: ?lang= > saved choice > browser language > Lithuanian.
// Translates [data-i18n] text, [data-i18n-attr] attributes and [data-lang] blocks, and adds the switcher.
import { UI_LANGS, LANG_LABELS, DEFAULT_LANG, pickLang, makeT } from "/shared/i18n.js";

const KEY = "lang";
const urlLang = new URLSearchParams(location.search).get("lang");
const fromUrl = UI_LANGS.includes(urlLang) ? urlLang : "";
let saved = "";
try { saved = localStorage.getItem(KEY) || ""; } catch { /* storage blocked */ }
// SEO part pages are Lithuanian landing pages: only an explicit choice (URL or saved) switches them.
const seo = location.pathname.startsWith("/dalys/");
const browser = seo ? [] : navigator.languages?.length ? navigator.languages : [navigator.language];

export const lang = fromUrl || (UI_LANGS.includes(saved) ? saved : "") || pickLang(...browser);
export const t = makeT(lang);

// The page can supply the URL to reload with (e.g. one carrying the current search query).
let urlFor = () => location.href;
export const onSwitch = (fn) => { urlFor = fn; };

function apply() {
  document.documentElement.lang = lang;
  if (lang === DEFAULT_LANG) return; // the HTML is written in Lithuanian
  for (const e of document.querySelectorAll("[data-i18n]")) e.textContent = t(e.dataset.i18n);
  for (const e of document.querySelectorAll("[data-i18n-attr]")) {
    for (const pair of e.dataset.i18nAttr.split(";")) {
      const [attr, key] = pair.split(":");
      e.setAttribute(attr.trim(), t(key.trim()));
    }
  }
  for (const e of document.querySelectorAll("[data-lang]")) e.hidden = e.dataset.lang !== lang;
  const page = document.body.dataset.page;
  if (page && !seo) {
    document.title = t(page + ".title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t(page + ".desc"));
  }
  // Without storage the URL is the only memory: carry ?lang= over to the site's own pages.
  if (fromUrl) {
    for (const a of document.querySelectorAll('a[href^="/"]')) {
      const u = new URL(a.href);
      if (u.origin !== location.origin || !/^\/(?:[\w-]+\.html)?$/.test(u.pathname)) continue;
      u.searchParams.set("lang", lang);
      a.href = u.pathname + u.search + u.hash;
    }
  }
}

function switcher() {
  const header = document.querySelector("body > .wrap > header");
  if (!header) return;
  const sel = document.createElement("select");
  sel.className = "lang";
  sel.setAttribute("aria-label", t("lang.label"));
  for (const l of UI_LANGS) sel.append(new Option(`${l.toUpperCase()}\u2003\u2003${LANG_LABELS[l]}`, l, false, l === lang));
  sel.addEventListener("change", () => {
    try { localStorage.setItem(KEY, sel.value); } catch { /* storage blocked: the URL carries it */ }
    const u = new URL(urlFor(), location.href);
    u.searchParams.set("lang", sel.value);
    location.assign(u.toString());
  });
  header.append(sel);
}

apply();
switcher();
