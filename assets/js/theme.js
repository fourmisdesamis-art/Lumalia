/* =========================================================
   LUMALIA — theme.js
   Gestion du thème clair / sombre / auto
   =========================================================
   - Sauvegarde dans localStorage sous "luma-theme"
   - Valeurs possibles : "light" | "dark" | "auto"
   - Applique data-theme="light|dark" sur <html>
   - Le mode "auto" suit prefers-color-scheme
   ========================================================= */

(function () {
  const STORAGE_KEY = "luma-theme";
  const html = document.documentElement;
  const mql = window.matchMedia("(prefers-color-scheme: dark)");

  /** Récupère le thème choisi par l'utilisateur (light | dark | auto) */
  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY) || "auto";
  }

  /** Résout "auto" en "light" ou "dark" selon le système */
  function resolveTheme(theme) {
    if (theme === "auto") {
      return mql.matches ? "dark" : "light";
    }
    return theme;
  }

  /** Applique le thème effectif sur <html> */
  function applyTheme(theme) {
    const effective = resolveTheme(theme);
    html.setAttribute("data-theme", effective);
    html.setAttribute("data-theme-pref", theme); // garde la préférence brute
    // Met à jour la meta theme-color (barre du navigateur mobile)
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", effective === "dark" ? "#0b0d12" : "#ffffff");
    }
  }

  /** Change la préférence utilisateur */
  function setTheme(theme) {
    if (!["light", "dark", "auto"].includes(theme)) return;
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
    // Notifie les autres scripts (ex: page paramètres)
    window.dispatchEvent(new CustomEvent("luma:theme-change", { detail: { theme } }));
  }

  /** Bascule clair <-> sombre (utilisé par le bouton rapide navbar) */
  function toggleTheme() {
    const current = resolveTheme(getStoredTheme());
    setTheme(current === "dark" ? "light" : "dark");
  }

  /** Renvoie le thème effectif actuel ("light" ou "dark") */
  function getEffectiveTheme() {
    return resolveTheme(getStoredTheme());
  }

  /** Renvoie la préférence brute ("light" | "dark" | "auto") */
  function getThemePreference() {
    return getStoredTheme();
  }

  // --- Initialisation immédiate (évite le flash au chargement) ---
  applyTheme(getStoredTheme());

  // --- Réagit aux changements système si mode auto ---
  mql.addEventListener("change", () => {
    if (getStoredTheme() === "auto") applyTheme("auto");
  });

  // --- API globale ---
  window.LumaTheme = {
    set: setTheme,
    toggle: toggleTheme,
    get: getEffectiveTheme,
    getPreference: getThemePreference,
  };
})();
