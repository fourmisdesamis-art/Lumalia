```javascript
/* =========================================================
   LUMALIA — RÈGLEMENT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileButton = document.getElementById("mobileMenuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    if (mobileButton && mobileMenu) {

        mobileButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
        });


        /* Fermer le menu lorsqu'un lien est sélectionné */

        const mobileLinks = mobileMenu.querySelectorAll("a");

        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
            });

        });


        /* Fermer le menu lorsqu'on clique ailleurs */

        document.addEventListener("click", (event) => {

            const clickedInsideMenu =
                mobileMenu.contains(event.target);

            const clickedButton =
                mobileButton.contains(event.target);

            if (!clickedInsideMenu && !clickedButton) {
                mobileMenu.classList.remove("active");
            }

        });

    }


    /* =====================================================
       ANIMATION DES CARTES
    ===================================================== */

    const animatedElements = document.querySelectorAll(
        ".rule-card, .info-card, .sanction-item, .staff-note"
    );

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observerInstance.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.08
        }
    );


    animatedElements.forEach(element => {

        element.style.opacity = "0";
        element.style.transform = "translateY(18px)";
        element.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

        observer.observe(element);

    });


    /* =====================================================
       CLASSE VISIBLE
    ===================================================== */

    const style = document.createElement("style");

    style.textContent = `
        .rule-card.visible,
        .info-card.visible,
        .sanction-item.visible,
        .staff-note.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;

    document.head.appendChild(style);


    /* =====================================================
       FERMETURE DU MENU AVEC ESC
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            if (mobileMenu) {
                mobileMenu.classList.remove("active");
            }

        }

    });

});
```
