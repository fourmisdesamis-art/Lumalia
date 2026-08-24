document.addEventListener("DOMContentLoaded", () => {

  /*
   * =========================================================
   * MENU MOBILE
   * =========================================================
   */

  const menuButton = document.querySelector(".menu-button");
  const mobileNavigation = document.querySelector("#mobileNavigation");

  if (menuButton && mobileNavigation) {

    menuButton.addEventListener("click", () => {

      const isOpen =
        mobileNavigation.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

    });


    /*
     * Fermer le menu après avoir cliqué sur un lien
     */

    const mobileLinks =
      mobileNavigation.querySelectorAll("a");

    mobileLinks.forEach((link) => {

      link.addEventListener("click", () => {

        mobileNavigation.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });


    /*
     * Fermer en cliquant en dehors
     */

    document.addEventListener("click", (event) => {

      const clickedMenu =
        mobileNavigation.contains(event.target);

      const clickedButton =
        menuButton.contains(event.target);

      if (!clickedMenu && !clickedButton) {

        mobileNavigation.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    });


    /*
     * Fermer avec Échap
     */

    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {

        mobileNavigation.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    });

  }


  /*
   * =========================================================
   * ANIMATION DES CARTES
   * =========================================================
   */

  const cards = document.querySelectorAll(
    ".rule-card, .important-card, .sanction-row"
  );

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");

          observerInstance.unobserve(entry.target);

        });

      },
      {
        threshold: 0.08
      }
    );


    cards.forEach((card) => {

      observer.observe(card);

    });

  }


  /*
   * =========================================================
   * FERMETURE DU MENU SI LA FENÊTRE REPASSE EN DESKTOP
   * =========================================================
   */

  window.addEventListener("resize", () => {

    if (window.innerWidth > 1000) {

      mobileNavigation?.classList.remove("open");

      menuButton?.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  });

});
