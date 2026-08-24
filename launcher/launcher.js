/* =========================
   LUMALIA LAUNCHER PAGE
========================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE MENU
    ========================== */

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");

    if (mobileMenuButton && mobileMenu) {

        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
        });

        const mobileLinks =
            mobileMenu.querySelectorAll("a");

        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
            });

        });
    }


    /* =========================
       DOWNLOAD BUTTONS
    ========================== */

    const downloadButtons = [
        document.getElementById("downloadButton"),
        document.getElementById("downloadButtonBottom")
    ];

    /*
     * URL DIRECTE DU LAUNCHER
     *
     * Le fichier .exe doit être accessible
     * publiquement depuis cette adresse.
     */

    const launcherDownloadUrl =
        "https://lumania.fr/downloads/Lumalia-Launcher.exe";


    downloadButtons.forEach(button => {

        if (!button) {
            return;
        }

        button.addEventListener("click", event => {

            event.preventDefault();

            /*
             * Création d'un lien temporaire
             * pour déclencher le téléchargement.
             */

            const downloadLink =
                document.createElement("a");

            downloadLink.href =
                launcherDownloadUrl;

            downloadLink.download =
                "Lumalia-Launcher.exe";

            document.body.appendChild(downloadLink);

            downloadLink.click();

            document.body.removeChild(downloadLink);

        });

    });


    /* =========================
       NAVBAR SCROLL
    ========================== */

    const navbar =
        document.querySelector(".navbar");

    let lastScroll = 0;

    window.addEventListener("scroll", () => {

        const currentScroll =
            window.scrollY;

        if (!navbar) {
            return;
        }

        if (currentScroll > 20) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        lastScroll = currentScroll;

    });


    /* =========================
       SMOOTH REVEAL
    ========================== */

    const revealElements =
        document.querySelectorAll(
            ".feature-card, .section-label, .features-section h2, .section-description"
        );

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "revealed"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {

        element.classList.add("reveal");

        observer.observe(element);

    });


    /* =========================
       ESCAPE → CLOSE MOBILE MENU
    ========================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            if (mobileMenu) {
                mobileMenu.classList.remove("active");
            }

        }

    });

});
