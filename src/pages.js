// Server-rendered HTML bits: AdSense tag, SEO landing pages, /dalys index, sitemap, robots.
import { PARTS, capitalise } from "./shared/seo.js";

export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const siteUrl = (env = process.env) => {
  const u = String(env.SITE_URL || "").trim().replace(/\/+$/, "");
  return /^https?:\/\/[^\s"<>]+$/.test(u) ? u : "https://parts-dalys.eu";
};

export function adsenseHead(ads) {
  if (!ads) return "";
  const c = escapeHtml(ads.client);
  return `<meta name="google-adsense-account" content="${c}">\n`
    + `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${c}" crossorigin="anonymous"></script>\n`;
}

export const injectHead = (html, extra) => (extra ? html.replace(/<\/head>/i, extra + "</head>") : html);

// Replaces content="" of the first <meta>/<link> tag matching attr=value, or adds the tag to <head>.
function setTag(html, tag, key, val, attr, content) {
  const re = new RegExp(`<${tag}\\b[^>]*\\b${key}="${val}"[^>]*>`, "i");
  const el = `<${tag} ${key}="${val}" ${attr}="${escapeHtml(content)}">`;
  return re.test(html) ? html.replace(re, () => el) : injectHead(html, el + "\n");
}

export const partTitle = (p) => `Naudota detalė: ${capitalise(p.name)} – paieška visoje Europoje | Parts-dalys.eu`;

// index.html turned into a landing page for one part: title, meta, canonical, prefilled search.
export function renderPartPage(indexHtml, part, base) {
  const name = capitalise(part.name);
  const url = `${base}/dalys/${part.slug}`;
  const desc = `${name} – naudotos detalės paieška vienu metu eBay, ardymo įmonių ir skelbimų svetainėse visoje Europoje. Užklausa automatiškai išverčiama (${part.en}), kainos eurais.`;
  let h = indexHtml.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escapeHtml(partTitle(part))}</title>`);
  h = setTag(h, "meta", "name", "description", "content", desc);
  h = setTag(h, "meta", "property", "og:title", "content", partTitle(part));
  h = setTag(h, "meta", "property", "og:description", "content", desc);
  h = setTag(h, "meta", "property", "og:url", "content", url);
  h = setTag(h, "link", "rel", "canonical", "href", url);
  h = setTag(h, "meta", "name", "initial-query", "content", part.name);
  h = h.replace(/<input\b[^>]*\bid="q"[^>]*>/i, (tag) => {
    const v = `value="${escapeHtml(part.name)}"`;
    return /\bvalue="[^"]*"/i.test(tag) ? tag.replace(/\bvalue="[^"]*"/i, () => v) : tag.replace(/\s*\/?>$/, (end) => ` ${v}${end}`);
  });
  const intro = `\n<h1 class="seo-h1">${escapeHtml(name)} – naudotos detalės paieška</h1>\n`
    + `<p class="hint seo-intro">Ieškome „${escapeHtml(part.name)}“ (${escapeHtml(part.en)}) Lietuvos, Lenkijos, Vokietijos ir kitų šalių skelbimuose bei ardymo įmonėse. `
    + `Patikslinkite automobilio markę, modelį arba OEM numerį. <a href="/dalys">Visos detalės</a></p>\n`;
  return h.replace(/<main\b[^>]*>/i, (m) => m + intro);
}

const shell = (title, desc, canonical, body, head = "") => `<!doctype html>
<html lang="lt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
${head}</head>
<body>
<div class="wrap">
  <header>
    <a class="brand" href="/">Parts-dalys<span>.eu</span></a>
  </header>
  <main class="wrap-inner" id="main">
${body}
  </main>
  <footer>
    <span>© Parts-dalys.eu</span>
    <nav aria-label="Papildoma"><a href="/">Paieška</a><a href="/apie.html">Apie</a></nav>
  </footer>
</div>
</body>
</html>
`;

export function renderPartsIndex(base, head = "") {
  const items = [...PARTS].sort((a, b) => a.name.localeCompare(b.name, "lt"))
    .map((p) => `      <li><a href="/dalys/${p.slug}">${escapeHtml(capitalise(p.name))}</a></li>`).join("\n");
  const body = `    <h1>Naudotų automobilių ir sunkvežimių dalių katalogas</h1>
    <p class="hint">Pasirinkite detalę – paieška vienu metu apims eBay, ardymo įmones ir skelbimų svetaines visoje Europoje.</p>
    <ul class="parts-index">
${items}
    </ul>`;
  return shell("Naudotos automobilių dalys pagal pavadinimą | Parts-dalys.eu",
    "Visų naudotų automobilių ir sunkvežimių dalių sąrašas: starteriai, generatoriai, pavarų dėžės, turbinos ir kt. Paieška visoje Europoje.",
    `${base}/dalys`, body, head);
}

const xml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);

export function renderSitemap(base) {
  const paths = ["/", "/apie.html", "/verslui.html", "/privatumas.html", "/dalys", ...PARTS.map((p) => `/dalys/${p.slug}`)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${xml(base + p)}</loc></url>`).join("\n")}
</urlset>
`;
}

export const renderRobots = (base) => `User-agent: *\nAllow: /\nDisallow: /go\nDisallow: /api/\n\nSitemap: ${base}/sitemap.xml\n`;
