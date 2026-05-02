const pages = [
  ["home", "Home", "index.html"],
  ["services", "Services", "services.html"],
  ["solutions", "Solutions", "solutions.html"],
  ["pricing", "Pricing", "pricing.html"],
  ["resources", "Resources", "resources.html"],
  ["about", "About", "about.html"],
  ["contact", "Contact", "contact.html"]
];

const currentPage = document.body.dataset.page || "home";
const header = document.querySelector("[data-header]");
const footer = document.querySelector("[data-footer]");

function navLinks() {
  return pages
    .map(([key, label, href]) => {
      const current = key === currentPage ? ' aria-current="page"' : "";
      return `<a href="${href}"${current}>${label}</a>`;
    })
    .join("");
}

if (header) {
  header.innerHTML = `
    <nav class="nav-shell" aria-label="Primary navigation">
      <a class="brand" href="index.html" aria-label="FlowPilot AI home">
        <span class="brand-mark" aria-hidden="true">F</span>
        <span>FlowPilot AI</span>
      </a>
      <div class="nav-links">${navLinks()}</div>
      <a class="button primary nav-cta" href="contact.html">Get started</a>
      <button class="menu-button" type="button" aria-label="Open menu" aria-expanded="false">
        <span></span>
      </button>
    </nav>
  `;
}

if (footer) {
  footer.innerHTML = `
    <div class="footer-grid">
      <div>
        <a class="footer-brand" href="index.html">FlowPilot AI</a>
        <p>AI automation systems for teams that need cleaner workflows, faster handoffs, and fewer repetitive tasks.</p>
      </div>
      <div class="footer-links">
        <a href="services.html">Services</a>
        <a href="solutions.html">Solutions</a>
        <a href="pricing.html">Pricing</a>
        <a href="contact.html">Contact</a>
      </div>
    </div>
  `;
}

const menuButton = document.querySelector(".menu-button");
const navShell = document.querySelector(".nav-shell");

if (menuButton && navShell) {
  menuButton.addEventListener("click", () => {
    const isOpen = navShell.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
}

const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.reset();
    formStatus.textContent = "Request captured. Connect this form to your CRM or email service before launch.";
  });
}
