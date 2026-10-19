// SEO landing pages: one /dalys/<slug> per dictionary part, slug from the Lithuanian name.
import { DICT } from "./translate.js";

// "Pavarų dėžė" -> "pavaru-deze": strip diacritics, lowercase, non-alphanumerics to single dashes.
export const slugify = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const capitalise = (s) => s.charAt(0).toLocaleUpperCase("lt") + s.slice(1);

// [{slug, name, en}] in dictionary order; first entry wins on a slug clash.
export const PARTS = (() => {
  const seen = new Set();
  const out = [];
  for (const [lt, en] of DICT) {
    const slug = slugify(lt);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push({ slug, name: lt, en });
  }
  return out;
})();

const BY_SLUG = new Map(PARTS.map((p) => [p.slug, p]));
export const partBySlug = (slug) => BY_SLUG.get(slug) || null;
