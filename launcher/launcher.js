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
     * Quand ton fichier .exe sera disponible,
     * remplace simplement cette URL.
     *
     * Exemple :
     *
     * const launcherDownloadUrl =
     *     "https://lumania.fr/downloads/Lumalia-Launcher.exe";
     */

    const launcherDownloadUrl = "#";


    downloadButtons.forEach(button => {

        if (!button) {
            return;
        }

        button.addEventListener("click", event => {

            if (launcherDownloadUrl === "#") {

                event.preventDefault();

                showDownloadMessage();

                return;
            }

            button.href = launcherDownloadUrl;

        });

    });


    /* =========================
       DOWNLOAD MESSAGE
    ========================== */

    function showDownloadMessage() {

        const existingMessage =
            document.querySelector(".download-message");

        if (existingMessage) {
            return;
        }

        const message =
            document.createElement("div");

        message.className = "download-message";

        message.innerHTML = `
            <div class="download-message-icon">
                ↓
            </div>

            <div>
                <strong>Le téléchargement arrive bientôt.</strong>
                <p>
                    Le Lumalia Launcher sera bientôt disponible.
                </p>
            </div>

            <button aria-label="Fermer">×</button>
        `;

        document.body.appendChild(message);


        requestAnimationFrame(() => {

            message.classList.add("visible");

        });


        const closeButton =
            message.querySelector("button");

        closeButton.addEventListener("click", () => {

            closeDownloadMessage(message);

        });


        setTimeout(() => {

            closeDownloadMessage(message);

        }, 5000);

    }


    function closeDownloadMessage(message) {

        message.classList.remove("visible");

        setTimeout(() => {

            message.remove();

        }, 300);

    }


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
