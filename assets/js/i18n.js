/* =========================================================
   LUMALIA — i18n.js
   Système de traduction FR / EN
   =========================================================
   - Charge le fichier JSON correspondant à la langue
   - Applique les traductions aux éléments [data-i18n]
   - Sauvegarde la langue dans localStorage sous "luma-lang"
   - Détecte la langue du navigateur si aucun choix
   - API : window.LumaI18n.set(lang) / .get() / .t(key)
   ========================================================= */

(function () {
  const STORAGE_KEY = "luma-lang";
  const SUPPORTED = ["fr", "en"];
  const FALLBACK = "fr";

  let currentLang = FALLBACK;
  let translations = {};

  /** Détecte la langue à utiliser au démarrage */
  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;

    const browser = (navigator.language || "").slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(browser)) return browser;

    return FALLBACK;
  }

  /** Charge un fichier JSON de langue */
  async function loadTranslations(lang) {
    const res = await fetch(`/assets/lang/${lang}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Impossible de charger ${lang}.json`);
    return res.json();
  }

  /** Récupère une valeur dans un objet via un chemin "a.b.c" */
  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  /** Applique les traductions à tous les [data-i18n] */
  function applyTranslations() {
    // Textes
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getNestedValue(translations, key);
      if (value !== undefined) el.textContent = value;
    });

    // Attributs (ex: data-i18n-attr="placeholder:key" ou "aria-label:key")
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const spec = el.getAttribute("data-i18n-attr");
      spec.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        const value = getNestedValue(translations, key);
        if (value !== undefined) el.setAttribute(attr, value);
      });
    });

    // Attribut lang + title
    document.documentElement.setAttribute("lang", currentLang);
  }

  /** Change la langue de l'interface */
  async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    try {
      translations = await loadTranslations(lang);
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      applyTranslations();
      window.dispatchEvent(new CustomEvent("luma:lang-change", { detail: { lang } }));
    } catch (err) {
      console.error("[i18n]", err);
    }
  }

  /** Traduit une clé à la volée (pour le JS) */
  function t(key) {
    const value = getNestedValue(translations, key);
    return value !== undefined ? value : key;
  }

  /** Initialisation */
  async function init() {
    currentLang = detectLang();
    try {
      translations = await loadTranslations(currentLang);
      applyTranslations();
      window.dispatchEvent(new CustomEvent("luma:lang-ready", { detail: { lang: currentLang } }));
    } catch (err) {
      console.error("[i18n] init échouée :", err);
    }
  }

  // API globale
  window.LumaI18n = {
    set: setLang,
    get: () => currentLang,
    t,
    ready: false,
  };

  // Lance l'init quand le DOM est prêt (ou tout de suite s'il l'est déjà)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
