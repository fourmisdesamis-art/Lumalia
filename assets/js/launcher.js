/* =========================================================
   LUMALIA — launcher.js
   Récupère la dernière release GitHub et met à jour la page
   ========================================================= */

(function () {
  "use strict";

  const REPO = "fourmisdesamis-art/Voltyx-Launcher";
  const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;

  const downloadBtn = document.getElementById("download-btn");
  const downloadBtnText = document.getElementById("download-btn-text");
  const versionInfo = document.getElementById("version-info");
  const changelog = document.getElementById("changelog");
  const changelogSubtitle = document.getElementById("changelog-subtitle");

  // ---------- Helpers ----------
  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function formatBytes(bytes) {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(1) + " Mo";
  }

  // Détecte l'OS du visiteur
  function getOS() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("win")) return "windows";
    if (ua.includes("mac")) return "mac";
    if (ua.includes("linux")) return "linux";
    return "unknown";
  }

  // ---------- Fetch la dernière release ----------
  async function loadLatestRelease() {
    try {
      const response = await fetch(API_URL, {
        headers: { "Accept": "application/vnd.github+json" }
      });

      if (!response.ok) {
        throw new Error(`GitHub API ${response.status}`);
      }

      const release = await response.json();
      const version = release.tag_name.replace(/^v/, "");
      const publishedDate = formatDate(release.published_at);

      // ---------- Trouve l'asset .exe ----------
      const exeAsset = release.assets.find((a) => a.name.endsWith(".exe"));

      // ---------- Met à jour le bouton ----------
      if (downloadBtn && exeAsset) {
        const os = getOS();

        if (os === "windows") {
          downloadBtn.href = exeAsset.browser_download_url;
          downloadBtnText.textContent = `Télécharger pour Windows (v${version})`;
        } else {
          // Autre OS : redirige vers la page releases
          downloadBtn.href = release.html_url;
          downloadBtnText.textContent = `Voir les téléchargements (v${version})`;
        }

        // Ajoute la taille du fichier
        if (exeAsset.size) {
          const sizeSpan = document.createElement("span");
          sizeSpan.className = "btn-download__size";
          sizeSpan.textContent = ` · ${formatBytes(exeAsset.size)}`;
          downloadBtnText.appendChild(sizeSpan);
        }
      }

      // ---------- Met à jour l'info de version ----------
      if (versionInfo) {
        versionInfo.innerHTML = `
          <span class="launcher-hero__version-dot"></span>
          <span>Dernière version&nbsp;: <strong>v${version}</strong> · publiée le ${publishedDate}</span>
        `;
      }

      // ---------- Met à jour le sous-titre du changelog ----------
      if (changelogSubtitle) {
        changelogSubtitle.textContent = `Version v${version} · ${publishedDate}`;
      }

      // ---------- Affiche le changelog ----------
      renderChangelog(release.body, release.html_url);

    } catch (err) {
      console.error("[Launcher] Erreur lors du chargement de la release :", err);

      if (versionInfo) {
        versionInfo.innerHTML = `
          <span class="launcher-hero__version-dot launcher-hero__version-dot--error"></span>
          <span>Impossible de charger la dernière version. <a href="https://github.com/${REPO}/releases" target="_blank" rel="noopener">Voir sur GitHub</a></span>
        `;
      }

      if (changelog) {
        changelog.innerHTML = `<div class="changelog__loading">Impossible de charger les nouveautés.</div>`;
      }
    }
  }

  // ---------- Rend le changelog (markdown basique) ----------
  function renderChangelog(body, releaseUrl) {
    if (!changelog) return;

    if (!body || body.trim() === "") {
      changelog.innerHTML = `
        <div class="changelog__empty">
          Aucune note de version pour cette release.
          <a href="${releaseUrl}" target="_blank" rel="noopener">Voir sur GitHub →</a>
        </div>
      `;
      return;
    }

    // Parse très simple du markdown GitHub en HTML
    const html = body
      .split("\n")
      .map((line) => {
        // Titres
        if (line.startsWith("### ")) return `<h4>${escape(line.slice(4))}</h4>`;
        if (line.startsWith("## ")) return `<h3>${escape(line.slice(3))}</h3>`;
        if (line.startsWith("# ")) return `<h3>${escape(line.slice(2))}</h3>`;

        // Listes
        if (line.match(/^[-*]\s+/)) {
          return `<li>${escape(line.replace(/^[-*]\s+/, ""))}</li>`;
        }

        // Ligne vide
        if (line.trim() === "") return "";

        // Paragraphe normal
        return `<p>${escape(line)}</p>`;
      })
      .join("\n")
      // Wrap les <li> successifs dans une <ul>
      .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

    changelog.innerHTML = html;
  }

  function escape(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", loadLatestRelease);
})();
