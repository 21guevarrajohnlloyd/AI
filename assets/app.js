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

const aboutEditStorageKey = "flowpilot-about-content";
const aboutEditableNodes = document.querySelectorAll("[data-edit-key]");

function syncAboutContactLinks() {
  const emailLink = document.querySelector('[data-edit-key="contact.email"]');
  if (emailLink && emailLink.textContent.includes("@")) {
    emailLink.setAttribute("href", `mailto:${emailLink.textContent.trim()}`);
  }
}

function readAboutContent() {
  try {
    return JSON.parse(localStorage.getItem(aboutEditStorageKey) || "{}");
  } catch {
    return {};
  }
}

if (currentPage === "about" && aboutEditableNodes.length) {
  const savedContent = readAboutContent();

  aboutEditableNodes.forEach((node) => {
    const savedValue = savedContent[node.dataset.editKey];
    if (typeof savedValue === "string") {
      node.textContent = savedValue;
    }
  });
  syncAboutContactLinks();

  const editParams = new URLSearchParams(window.location.search);

  if (editParams.get("edit") === "about") {
    document.body.classList.add("about-edit-mode");

    aboutEditableNodes.forEach((node) => {
      node.setAttribute("contenteditable", "true");
      node.setAttribute("spellcheck", "true");
      if (node.tagName === "A") {
        node.addEventListener("click", (event) => event.preventDefault());
      }
    });

    const toolbar = document.createElement("div");
    toolbar.className = "edit-toolbar";
    toolbar.innerHTML = `
      <strong>Editing About</strong>
      <button class="button primary" type="button" data-save-about>Save</button>
      <button class="button secondary" type="button" data-reset-about>Reset</button>
      <span data-edit-status aria-live="polite"></span>
    `;
    document.body.appendChild(toolbar);

    toolbar.querySelector("[data-save-about]").addEventListener("click", () => {
      const nextContent = {};
      aboutEditableNodes.forEach((node) => {
        nextContent[node.dataset.editKey] = node.textContent.trim();
      });
      localStorage.setItem(aboutEditStorageKey, JSON.stringify(nextContent));
      syncAboutContactLinks();
      toolbar.querySelector("[data-edit-status]").textContent = "Saved in this browser.";
    });

    toolbar.querySelector("[data-reset-about]").addEventListener("click", () => {
      localStorage.removeItem(aboutEditStorageKey);
      window.location.reload();
    });
  }
}
