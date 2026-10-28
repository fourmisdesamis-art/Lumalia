const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeStorageKey = "lumalia-theme";

try {
    root.dataset.theme = localStorage.getItem(themeStorageKey) === "dark" ? "dark" : "light";
} catch {
    root.dataset.theme = "light";
}

function updateThemeToggle() {
    const isDark = root.dataset.theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("title", isDark ? "Passer au thème clair" : "Passer au thème sombre");
}

updateThemeToggle();

themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;

    try {
        localStorage.setItem(themeStorageKey, nextTheme);
    } catch {}

    updateThemeToggle();
});

requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        root.classList.add("page-ready");
    });
});