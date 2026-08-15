"use strict";


/* =========================================================
   LUMALIA — INDEX
   js/index.js
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");
const navbar = document.querySelector(".navbar");

const mobileMenuLinks = document.querySelectorAll(
    ".mobile-menu-content a"
);


/* =========================================================
   MOBILE MENU
   ========================================================= */

function openMobileMenu() {
    if (!mobileMenu || !mobileMenuButton) return;

    mobileMenu.classList.add("active");

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "true"
    );

    document.body.style.overflow = "hidden";
}


function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuButton) return;

    mobileMenu.classList.remove("active");

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.style.overflow = "";
}


function toggleMobileMenu() {
    if (!mobileMenu) return;

    if (mobileMenu.classList.contains("active")) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}


if (mobileMenuButton) {

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    mobileMenuButton.addEventListener(
        "click",
        toggleMobileMenu
    );
}


/* =========================================================
   MOBILE MENU — LINKS
   ========================================================= */

mobileMenuLinks.forEach((link) => {

    link.addEventListener("click", () => {
        closeMobileMenu();
    });

});


/* =========================================================
   ESCAPE — CLOSE MENU
   ========================================================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeMobileMenu();
    }

});


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener("resize", () => {

    if (
        window.innerWidth > 760 &&
        mobileMenu &&
        mobileMenu.classList.contains("active")
    ) {
        closeMobileMenu();
    }

});


/* =========================================================
   HEADER — SCROLL
   ========================================================= */

function updateNavbar() {

    if (!navbar) return;

    if (window.scrollY > 20) {

        navbar.style.boxShadow =
            "0 8px 30px rgba(20, 15, 35, 0.06)";

    } else {

        navbar.style.boxShadow = "none";

    }

}


window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
);

updateNavbar();


/* =========================================================
   SMOOTH ANCHOR NAVIGATION
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

        const targetId = link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        const navbarHeight = navbar
            ? navbar.offsetHeight
            : 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });

    });

});


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements = document.querySelectorAll(
    ".feature-card, .server-card, .section-heading, .cta-container"
);


if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach((element) => {

        element.style.opacity = "0";
        element.style.transform = "translateY(25px)";

        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

        revealObserver.observe(element);

    });

}


/* =========================================================
   SERVER CARDS
   ========================================================= */

const serverCards = document.querySelectorAll(
    ".server-card"
);


serverCards.forEach((card) => {

    card.addEventListener("mouseenter", () => {

        serverCards.forEach((otherCard) => {

            if (otherCard !== card) {
                otherCard.style.opacity = "0.72";
            }

        });

    });


    card.addEventListener("mouseleave", () => {

        serverCards.forEach((otherCard) => {
            otherCard.style.opacity = "1";
        });

    });

});


/* =========================================================
   PAGE LOADED
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    document.body.classList.add("lumalia-ready");

});
