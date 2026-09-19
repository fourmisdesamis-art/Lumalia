/* =========================================================
   LUMALIA — navbar.js
   Burger + dropdown + langue + thème + utilisateur + admin
   ========================================================= */

(function () {
  function initNavbar() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    /* ---- 1. Burger mobile ---- */
    const burger = navbar.querySelector(".navbar__burger");
    const links = navbar.querySelector(".navbar__links");
    if (burger && links) {
      burger.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });

      links.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          if (a.classList.contains("navbar__link--parent")) return;
          links.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }

    /* ---- 1b. Dropdown accordéon sur mobile ---- */
    navbar.querySelectorAll(".navbar__item").forEach((item) => {
      const parentLink = item.querySelector(".navbar__link--parent");
      if (!parentLink) return;

      parentLink.addEventListener("click", (e) => {
        if (window.matchMedia("(max-width: 900px)").matches) {
          e.preventDefault();
          item.classList.toggle("open");
        }
      });
    });

    /* ---- 2. Langue ---- */
    const langSwitch = navbar.querySelector(".lang-switch");
    if (langSwitch) {
      const btn = langSwitch.querySelector(".lang-switch__btn");
      const label = langSwitch.querySelector(".lang-switch__label");
      const items = langSwitch.querySelectorAll(".lang-switch__item");

      function refreshLangUI() {
        const lang = window.LumaI18n ? window.LumaI18n.get() : "fr";
        if (label) label.textContent = lang.toUpperCase();
        items.forEach((it) => {
          it.classList.toggle("active", it.dataset.lang === lang);
        });
      }

      btn?.addEventListener("click", (e) => {
        e.stopPropagation();
        langSwitch.classList.toggle("open");
      });

      document.addEventListener("click", () => {
        langSwitch.classList.remove("open");
      });

      items.forEach((item) => {
        item.addEventListener("click", () => {
          const lang = item.dataset.lang;
          if (lang && window.LumaI18n) window.LumaI18n.set(lang);
          langSwitch.classList.remove("open");
        });
      });

      window.addEventListener("luma:lang-change", refreshLangUI);
      window.addEventListener("luma:lang-ready", refreshLangUI);
      refreshLangUI();
    }

    /* ---- 3. Thème ---- */
    const themeBtn = navbar.querySelector("[data-theme-toggle]");
    if (themeBtn) {
      const iconSun = themeBtn.querySelector(".icon-sun");
      const iconMoon = themeBtn.querySelector(".icon-moon");

      function refreshThemeUI() {
        const eff = window.LumaTheme ? window.LumaTheme.get() : "light";
        if (iconSun) iconSun.style.display = eff === "dark" ? "block" : "none";
        if (iconMoon) iconMoon.style.display = eff === "dark" ? "none" : "block";
      }

      themeBtn.addEventListener("click", () => {
        window.LumaTheme?.toggle();
        refreshThemeUI();
      });

      window.addEventListener("luma:theme-change", refreshThemeUI);
      refreshThemeUI();
    }

    /* ---- 4. Lien actif ---- */
    const path = window.location.pathname.replace(/\/$/, "") || "/";
    navbar.querySelectorAll(".navbar__link, .navbar__dropdown-item").forEach((a) => {
      const href = (a.getAttribute("href") || "").replace(/\/$/, "") || "/";
      const isExact = href === path;
      const isPrefix = href !== "/" && path.startsWith(href + "/");
      if (isExact || isPrefix) {
        a.setAttribute("aria-current", "page");
      }
    });

    /* ---- 5. Affichage de l'utilisateur connecté ---- */
    function refreshUserUI() {
      const user = JSON.parse(localStorage.getItem("luma_user") || "null");

      const authLinks = navbar.querySelectorAll("[data-auth-link]");
      authLinks.forEach(function (el) {
        if (user) {
          el.style.display = "none";
        } else {
          el.style.display = "";
        }
      });

      let userBtn = navbar.querySelector(".navbar__user-btn");

      if (user) {
        if (!userBtn) {
          userBtn = document.createElement("a");
          userBtn.className = "navbar__user-btn";
          userBtn.href = "/profil";
          userBtn.setAttribute("aria-label", "Mon profil");

          const discordBtn = navbar.querySelector('[data-i18n="nav.discord"]');
          const actions = navbar.querySelector(".navbar__actions");
          if (discordBtn && actions) {
            actions.insertBefore(userBtn, discordBtn);
          } else if (actions) {
            actions.appendChild(userBtn);
          }
        }

        const initial = user.username ? user.username.charAt(0).toUpperCase() : "?";
        userBtn.innerHTML =
          '<span class="navbar__user-avatar">' + initial + '</span>' +
          '<span class="navbar__user-name">' + (user.username || "Joueur") + '</span>';
        userBtn.style.display = "";
      } else if (userBtn) {
        userBtn.remove();
      }
    }

    /* ---- 6. Bouton Admin (si HA/Admin) ---- */
    async function refreshAdminButton() {
      const fbAuth = window.firebase && window.firebase.auth ? window.firebase.auth() : null;
      const fbUser = fbAuth ? fbAuth.currentUser : null;
      if (!fbUser) {
        // Pas connecté : retire le bouton s'il existe
        const existing = navbar.querySelector(".navbar__admin-btn");
        if (existing) existing.remove();
        return;
      }

      try {
        const doc = await window.firebase.firestore()
          .collection("Utilisateurs")
          .doc(fbUser.uid)
          .get();

        if (!doc.exists) return;

        const data = doc.data();
        const grade = (data.grade || "").trim();
        const role = (data.role || "").trim().toLowerCase();

        const isHA = grade === "HA" || grade === "Ha" || grade === "ha";
        const isAdminGrade =
          grade === "Administrateur" ||
          grade === "Admin" ||
          grade === "administrateur" ||
          grade === "admin";
        const isAdminRole = role === "administrateur" || role === "admin";

        const isStaff = isHA || isAdminGrade || isAdminRole;

        console.log("[navbar] Grade détecté :", grade, "| Role :", role, "| isStaff :", isStaff);

        const actions = navbar.querySelector(".navbar__actions");
        if (!actions) return;

        // Supprime l'ancien bouton s'il existe
        const existing = navbar.querySelector(".navbar__admin-btn");
        if (existing) existing.remove();

        if (isStaff) {
          const btn = document.createElement("a");
          btn.href = "/forum/admin";
          btn.className = "navbar__admin-btn";
          btn.setAttribute("aria-label", "Administration du forum");
          btn.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
            '<span>Admin</span>';

          const discordBtn = actions.querySelector('[data-i18n="nav.discord"]');
          if (discordBtn) {
            actions.insertBefore(btn, discordBtn);
          } else {
            actions.appendChild(btn);
          }
        }
      } catch (err) {
        console.warn("[navbar] Impossible de charger le grade :", err);
      }
    }

    /* ---- Initialisation ---- */
    refreshUserUI();
    refreshAdminButton();

    // Réagit aux changements de session Firebase
    if (window.firebase && window.firebase.auth) {
      window.firebase.auth().onAuthStateChanged(function (fbUser) {
        if (!fbUser) {
          // Déconnecté : nettoie localStorage + retire boutons
          localStorage.removeItem("luma_user");
          const adminBtn = navbar.querySelector(".navbar__admin-btn");
          if (adminBtn) adminBtn.remove();
        }
        refreshUserUI();
        refreshAdminButton();
      });
    }

    // Écoute un event custom pour forcer la mise à jour
    window.addEventListener("luma:user-change", refreshUserUI);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavbar);
  } else {
    initNavbar();
  }
})();
