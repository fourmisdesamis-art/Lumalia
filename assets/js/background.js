/* =========================================================
   LUMALIA — background.js
   Fond animé léger : particules flottantes + blobs flous
   =========================================================
   - Un canvas plein écran fixé derrière le contenu (z-index: -1)
   - Des particules discrètes qui montent lentement
   - Deux "blobs" flous qui dérivent en arrière-plan (faits en CSS)
   - S'adapte au thème clair/sombre
   - Respecte prefers-reduced-motion
   ========================================================= */

(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return; // pas d'animation si l'utilisateur le demande

  const canvas = document.getElementById("luma-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height, dpr;
  let particles = [];
  let animationId = null;
  let isDark = false;

  const PARTICLE_COUNT = 45;
  const MAX_LINK_DIST = 0;

  /** Ajuste la taille du canvas à la fenêtre */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** Crée une particule */
  function createParticle(initial = false) {
    return {
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + 10,
      radius: Math.random() * 1.6 + 0.6,
      speedY: -(Math.random() * 0.25 + 0.08),
      speedX: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.35 + 0.15,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.01 + 0.005,
    };
  }

  /** Initialise le tableau de particules */
  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(true));
    }
  }

  /** Récupère la couleur de particules selon le thème */
  function getParticleColor() {
    return isDark ? "180, 170, 255" : "124, 92, 255"; // RGB du violet
  }

  /** Boucle d'animation */
  function animate() {
    ctx.clearRect(0, 0, width, height);
    const color = getParticleColor();

    particles.forEach((p) => {
      // Mouvement
      p.y += p.speedY;
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 0.25;

      // Réapparition en bas si sortie par le haut
      if (p.y < -10) {
        Object.assign(p, createParticle(false));
      }
      // Wrap horizontal
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      // Dessin
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
      ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
  }

  /** Détecte le thème courant et met à jour la couleur */
  function syncTheme() {
    const theme = document.documentElement.getAttribute("data-theme");
    isDark = theme === "dark";
    canvas.style.opacity = isDark ? "0.5" : "0.7";
  }

  /** Init */
  function init() {
    resize();
    initParticles();
    syncTheme();
    animate();

    window.addEventListener("resize", () => {
      resize();
      // Repositionne les particules dans la nouvelle zone
      particles.forEach((p) => {
        if (p.x > width) p.x = Math.random() * width;
        if (p.y > height) p.y = Math.random() * height;
      });
    });

    window.addEventListener("luma:theme-change", syncTheme);

    // Pause quand l'onglet est caché (économie CPU)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
        animationId = null;
      } else if (!animationId) {
        animate();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
