const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton) {
  menuButton.addEventListener("click", () => {
    const opened = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!opened));
    navLinks.classList.toggle("mobile-open", !opened);
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", () => {
    if (navLinks) {
      navLinks.classList.remove("mobile-open");
      menuButton?.setAttribute("aria-expanded", "false");
    }
  });
});

const style = document.createElement("style");
style.textContent = `
  @media (max-width: 1000px) {
    .nav-links.mobile-open {
      display: flex;
      position: absolute;
      top: 64px;
      left: 0;
      right: 0;
      padding: 18px 22px;
      flex-direction: column;
      gap: 18px;
      background: rgba(7,6,17,.97);
      border-bottom: 1px solid rgba(255,255,255,.08);
      backdrop-filter: blur(22px);
    }
  }
`;
document.head.appendChild(style);
