const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeStorageKey = "lumalia-theme";

// Gestion du thème clair / sombre
try {
    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme) {
        root.dataset.theme = savedTheme;
    } else {
        root.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
} catch {
    root.dataset.theme = "dark";
}

function updateThemeToggle() {
    if (!themeToggle) return;
    const isDark = root.dataset.theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("title", isDark ? "Passer au thème clair" : "Passer au thème sombre");
}

updateThemeToggle();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = nextTheme;

        try {
            localStorage.setItem(themeStorageKey, nextTheme);
        } catch {}

        updateThemeToggle();
    });
}

// Bouton de copie de l'IP du serveur
const copyBtn = document.getElementById("copy-ip-btn");
const copyText = document.getElementById("copy-text");

if (copyBtn && copyText) {
    copyBtn.addEventListener("click", async () => {
        const ip = "play.lumalia.fr";
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(ip);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = ip;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }

            const prevHtml = copyText.textContent;
            copyText.textContent = "✓ IP Copiée !";
            copyBtn.classList.add("copied");

            setTimeout(() => {
                copyText.textContent = prevHtml;
                copyBtn.classList.remove("copied");
            }, 2500);
        } catch (e) {
            console.error("Échec de copie de l'IP", e);
        }
    });
}
