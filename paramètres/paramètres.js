"use strict";


/* =========================================================
   LUMALIA — PARAMÈTRES
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const settingsSidebar =
    document.getElementById("settingsSidebar");

const mobileOverlay =
    document.getElementById("mobileOverlay");

const closeSidebar =
    document.getElementById("closeSidebar");

const settingsLinks =
    document.querySelectorAll(".settings-link");

const bio =
    document.getElementById("bio");

const bioCount =
    document.getElementById("bioCount");

const saveAccount =
    document.getElementById("saveAccount");


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function openSidebar() {

    if (!settingsSidebar) return;

    settingsSidebar.classList.add("open");

    mobileOverlay?.classList.add("active");

    mobileMenuButton?.setAttribute(
        "aria-expanded",
        "true"
    );

    document.body.style.overflow = "hidden";
}


function closeSettingsSidebar() {

    if (!settingsSidebar) return;

    settingsSidebar.classList.remove("open");

    mobileOverlay?.classList.remove("active");

    mobileMenuButton?.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.style.overflow = "";
}


mobileMenuButton?.addEventListener(
    "click",
    openSidebar
);


closeSidebar?.addEventListener(
    "click",
    closeSettingsSidebar
);


mobileOverlay?.addEventListener(
    "click",
    closeSettingsSidebar
);


/* =========================================================
   ESCAPE
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {
            closeSettingsSidebar();
        }

    }
);


/* =========================================================
   SIDEBAR LINKS
   ========================================================= */

settingsLinks.forEach((link) => {

    link.addEventListener(
        "click",
        () => {

            settingsLinks.forEach(
                (otherLink) => {
                    otherLink.classList.remove("active");
                }
            );

            link.classList.add("active");

            closeSettingsSidebar();

        }
    );

});


/* =========================================================
   ACTIVE SECTION
   ========================================================= */

const sections =
    document.querySelectorAll(
        ".settings-section"
    );


if ("IntersectionObserver" in window) {

    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const sectionId =
                            entry.target.id;

                        settingsLinks.forEach(
                            (link) => {

                                const target =
                                    link.dataset.section;

                                link.classList.toggle(
                                    "active",
                                    target === sectionId
                                );

                            }
                        );

                    }
                );

            },
            {
                rootMargin: "-20% 0px -65% 0px",
                threshold: 0
            }
        );


    sections.forEach(
        (section) => {
            sectionObserver.observe(section);
        }
    );
}


/* =========================================================
   BIO CHARACTER COUNTER
   ========================================================= */

function updateBioCounter() {

    if (!bio || !bioCount) {
        return;
    }

    bioCount.textContent =
        bio.value.length;
}


bio?.addEventListener(
    "input",
    updateBioCounter
);

updateBioCounter();


/* =========================================================
   SAVE ACCOUNT
   ========================================================= */

saveAccount?.addEventListener(
    "click",
    () => {

        const originalText =
            saveAccount.textContent;

        saveAccount.textContent =
            "Enregistré ✓";

        saveAccount.disabled = true;

        setTimeout(
            () => {

                saveAccount.textContent =
                    originalText;

                saveAccount.disabled = false;

            },
            1800
        );

    }
);


/* =========================================================
   RESPONSIVE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 760
        ) {
            closeSettingsSidebar();
        }

    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateBioCounter();

    }
);
