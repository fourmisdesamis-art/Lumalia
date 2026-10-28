const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!prefersReducedMotion.matches) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.documentElement.classList.add("page-ready");
        });
    });
}