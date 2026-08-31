import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const inputPath = path.join(root, "out", "index.html");
const outputPath = path.join(root, "promofy-sbc-summit-2026-standalone.html");

const mimeTypes = {
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function dataUri(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const mime = mimeTypes[extension] ?? "application/octet-stream";
  return `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
}

if (!fs.existsSync(inputPath)) {
  throw new Error("Run `npm run build` first so the static export exists in out/.");
}

let html = fs.readFileSync(inputPath, "utf8");
const stylesheetTag = html.match(/<link rel="stylesheet" href="([^"]+\.css)" data-precedence="next"\/>/);
if (!stylesheetTag) throw new Error("The exported page does not contain its expected stylesheet.");
const cssPath = path.join(root, "out", stylesheetTag[1].replace(/^\//, ""));
let css = fs.readFileSync(cssPath, "utf8");

css = css.replace(/url\((?:["']?)\.\.\/media\/([^)'\"]+)(?:["']?)\)/g, (_match, fileName) => {
  return `url("${dataUri(path.join(root, "out", "_next", "static", "media", fileName))}")`;
});

html = html.replace(stylesheetTag[0], `<style id="promofy-standalone-styles">${css}</style>`);

html = html
  .replace(/<link\b[^>]*rel="preload"[^>]*\/?\s*>/gi, "")
  .replace(/<meta name="next-size-adjust" content=""\/>/gi, "")
  .replace(/<script\b(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<div hidden=""><!--\$--><!--\/\$--><\/div>/, "");

const embeddedAssets = [
  "Ice.png",
  "Starties-Thrasher-Transparent-1.png",
  "promofy-live-experience-v2.jpg",
  "promofy-logo.svg",
  "promofy-sbc-hero.webp",
  "promofy-signal-system.webp",
];

for (const fileName of embeddedAssets) {
  const publicReference = `/assets/promofy/${fileName}`;
  const uri = dataUri(path.join(root, "out", "assets", "promofy", fileName));
  html = html.split(publicReference).join(uri);
}

const iconUri = dataUri(path.join(root, "out", "icon.svg"));
html = html.replace(/\/icon\.svg\?[^"']+/g, iconUri);

const formFieldNames = [
  "firstName",
  "lastName",
  "email",
  "company",
  "jobTitle",
  "interest",
  "preferredHost",
  "day",
  "time",
  "message",
];

for (const fieldName of formFieldNames) {
  html = html.replace(`id="${fieldName}"`, `name="${fieldName}" id="${fieldName}"`);
}

const standaloneScript = String.raw`
<script>
(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button");
  const mobileNav = document.getElementById("mobile-nav");

  const menuIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>';
  const closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>';

  function setMenu(open) {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuButton.innerHTML = open ? closeIcon : menuIcon;
    mobileNav.hidden = !open;
    mobileNav.classList.toggle("open", open);
  }

  menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  function updateHeader() {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-in"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const shouldOpen = trigger.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll(".faq-trigger").forEach((otherTrigger) => {
        const otherPanel = document.getElementById(otherTrigger.getAttribute("aria-controls"));
        otherTrigger.setAttribute("aria-expanded", "false");
        otherTrigger.closest(".faq-item")?.classList.remove("is-open");
        if (otherPanel) otherPanel.hidden = true;
      });
      if (shouldOpen) {
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        trigger.setAttribute("aria-expanded", "true");
        trigger.closest(".faq-item")?.classList.add("is-open");
        if (panel) panel.hidden = false;
      }
    });
  });

  const form = document.querySelector(".booking-form");
  const formStatus = form?.querySelector(".form-status");
  const submitButton = form?.querySelector("button[type='submit']");
  const requiredMessages = {
    firstName: "Please enter your first name.",
    lastName: "Please enter your last name.",
    email: "Please enter your work email.",
    interest: "Please choose your area of interest.",
    day: "Please choose a preferred day.",
  };

  function clearFieldError(control) {
    const field = control.closest(".field");
    field?.querySelector(".field-error")?.remove();
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-describedby");
  }

  function setFieldError(control, message) {
    clearFieldError(control);
    const error = document.createElement("span");
    error.className = "field-error";
    error.id = control.id + "-error";
    error.setAttribute("role", "alert");
    error.textContent = message;
    const field = control.closest(".field");
    const anchor = field?.querySelector(".select-wrap") || control;
    anchor.insertAdjacentElement("afterend", error);
    control.setAttribute("aria-invalid", "true");
    control.setAttribute("aria-describedby", error.id);
  }

  form?.querySelectorAll("input, select, textarea").forEach((control) => {
    const clear = () => {
      clearFieldError(control);
      if (formStatus) formStatus.textContent = "";
    };
    control.addEventListener("input", clear);
    control.addEventListener("change", clear);
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!submitButton || submitButton.disabled) return;

    let firstInvalid = null;
    Object.entries(requiredMessages).forEach(([id, message]) => {
      const control = document.getElementById(id);
      if (!control) return;
      clearFieldError(control);
      const value = control.value.trim();
      let error = value ? "" : message;
      if (id === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        error = "Please enter a valid email address.";
      }
      if (error) {
        setFieldError(control, error);
        if (!firstInvalid) firstInvalid = control;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    if (formStatus) formStatus.textContent = "";

    const values = Object.fromEntries(new FormData(form).entries());
    values.source = "sbc-summit-2026-standalone";
    const endpoint = window.PROMOFY_MEETING_FORM_ENDPOINT || "";

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!response.ok) throw new Error("Request failed (" + response.status + ")");
      }
      form.reset();
      if (formStatus) {
        formStatus.innerHTML = '<p class="ok">Thanks — your SBC meeting request is in. The Promofy team will confirm your slot by email shortly.</p>';
      }
    } catch (_error) {
      if (formStatus) {
        formStatus.innerHTML = '<span class="err">Your request was not sent. Try again, or use a team member\'s direct booking link above.</span>';
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send meeting request";
    }
  });
})();
</script>`;

html = html
  .replace("<head>", '<head><!-- Self-contained Promofy SBC Summit 2026 build: CSS, fonts, images and interactions are embedded. -->')
  .replace("</body>", `${standaloneScript}</body>`);

fs.writeFileSync(outputPath, html);

const remainingLocalReferences = html.match(/(?:src|href)=["']\/(?!\/)[^"']+/g) ?? [];
if (remainingLocalReferences.length > 0) {
  throw new Error(`Standalone build still contains local references: ${remainingLocalReferences.join(", ")}`);
}

console.log(JSON.stringify({
  output: outputPath,
  bytes: fs.statSync(outputPath).size,
  embeddedAssets: embeddedAssets.length + 6,
  remainingLocalReferences: remainingLocalReferences.length,
}, null, 2));
