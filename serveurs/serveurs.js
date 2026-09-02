document.addEventListener("DOMContentLoaded", () => {

    const mobileButton = document.getElementById("mobileMenuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    if (mobileButton && mobileMenu) {

        mobileButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("open");
        });

    }


    const cards = document.querySelectorAll(".server-card");

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold:0.12
        }
    );


    cards.forEach(card => {

        card.style.opacity = "0";
        card.style.transform = "translateY(25px)";
        card.style.transition = "opacity .6s ease, transform .6s ease";

        observer.observe(card);

    });


    const style = document.createElement("style");

    style.textContent = `
        .server-card.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;

    document.head.appendChild(style);


    const serverLinks = document.querySelectorAll(".server-arrow");

    serverLinks.forEach(link => {

        link.addEventListener("click", event => {

            const href = link.getAttribute("href");

            if (!href || href === "#") {

                event.preventDefault();

            }

        });

    });


    window.addEventListener("scroll", () => {

        const navbar = document.querySelector(".navbar");

        if (!navbar) return;

        if (window.scrollY > 30) {

            navbar.style.background = "rgba(8,9,13,.92)";

        } else {

            navbar.style.background = "rgba(8,9,13,.78)";

        }

    });

});
