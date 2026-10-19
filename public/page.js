// Small helpers for text pages (loaded as a module so it works under a strict CSP).
import { t } from "/i18n.js";

for (const btn of document.querySelectorAll("[data-copy]")) {
  btn.hidden = false;
  btn.addEventListener("click", async () => {
    const text = btn.dataset.copy;
    const out = document.getElementById(btn.getAttribute("aria-describedby") || "");
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch { /* fall back below */ }
    if (!ok) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.className = "sr";
      document.body.append(ta);
      ta.select();
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove();
    }
    if (out) {
      out.textContent = ok ? t("copied") : t("copy.fail");
      clearTimeout(btn._t);
      btn._t = setTimeout(() => (out.textContent = ""), 2500);
    }
  });
}
