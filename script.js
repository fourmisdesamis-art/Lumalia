requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        document.documentElement.classList.add("page-ready");
    });
});