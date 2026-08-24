document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     MENU MOBILE
  ========================= */

  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

      const isOpen = mobileMenu.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

    });

    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach((link) => {

      link.addEventListener("click", () => {

        mobileMenu.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* =========================
     NAVIGATION RÈGLEMENT
  ========================= */

  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const ruleSections = document.querySelectorAll(".rule-card");

  if (sidebarLinks.length && ruleSections.length) {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          const id = entry.target.id;

          sidebarLinks.forEach((link) => {
            link.classList.remove("active");

            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });

        });

      },
      {
        rootMargin: "-25% 0px -65% 0px"
      }
    );

    ruleSections.forEach((section) => {
      observer.observe(section);
    });

  }


  /* =========================
     SMOOTH SCROLL
  ========================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });

});
