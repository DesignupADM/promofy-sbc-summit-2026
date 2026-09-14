import fs from "node:fs";
import path from "node:path";
import { submitMeeting } from "../src/lib/submit-meeting.mjs";

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

const formFieldNames = ["firstName", "lastName", "email"];

for (const fieldName of formFieldNames) {
  html = html.replace(`id="${fieldName}"`, `name="${fieldName}" id="${fieldName}"`);
}

const standaloneScript = String.raw`
<script>
(() => {
  "use strict";
  const submitMeeting = ${submitMeeting.toString()};

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

  const fields = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
  };
  const hostInputs = Array.from(document.querySelectorAll('input[name="host"]'));
  const hostPanel = document.getElementById("booking-step-host");
  const detailsPanel = document.getElementById("booking-step-details");
  const handoffPanel = document.getElementById("booking-step-handoff");
  const detailsForm = detailsPanel?.querySelector("form");
  const progressSteps = Array.from(document.querySelectorAll(".booking-progress li"));
  const continueButton = hostPanel?.querySelector("button");
  const bookingOptions = hostPanel?.querySelector(".booking-hosts");
  const stepNumbers = ["1", "2"];
  const checkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
  const requiredMessages = {
    firstName: "Please enter your first name.",
    lastName: "Please enter your last name.",
    email: "Please enter your work email.",
  };

  let selectedInput = hostInputs.find((input) => input.checked) || null;

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function hostFromInput(input) {
    return {
      firstName: input.dataset.hostFirst || "",
      name: input.dataset.hostName || "",
      role: input.dataset.hostRole || "",
      initials: input.dataset.hostInitials || "",
      avatar: input.dataset.hostAvatar || "",
      bookingUrl: input.dataset.bookingUrl || "",
    };
  }

  function renderTarget(host) {
    const avatar = document.getElementById("booking-target-avatar");
    if (avatar) {
      avatar.className = "booking-avatar booking-avatar--" + host.avatar;
      avatar.textContent = host.initials;
    }
    setText("booking-target-name", host.name);
    setText("booking-target-role", host.role);
    setText("booking-submit-label", "Open " + host.firstName + "'s calendar");
    setText("booking-handoff-name", host.firstName);
    setText("booking-handoff-label", "Open " + host.firstName + "'s calendar");
  }

  function renderProgress(step) {
    const currentIndex = step === "handoff" ? -1 : step === "details" ? 1 : 0;
    progressSteps.forEach((item, index) => {
      const isDone = currentIndex === -1 || index < currentIndex;
      item.classList.toggle("is-current", index === currentIndex);
      item.classList.toggle("is-done", isDone);
      const badge = item.querySelector("span");
      if (badge) badge.innerHTML = isDone ? checkIcon : stepNumbers[index];
    });
  }

  function showStep(step) {
    if (hostPanel) hostPanel.hidden = step !== "host";
    if (detailsPanel) detailsPanel.hidden = step !== "details";
    if (handoffPanel) handoffPanel.hidden = step !== "handoff";
    renderProgress(step);
  }

  function clearHostError() {
    document.getElementById("host-error")?.remove();
  }

  function showHostError(message) {
    clearHostError();
    const error = document.createElement("span");
    error.className = "field-error";
    error.id = "host-error";
    error.setAttribute("role", "alert");
    error.textContent = message;
    bookingOptions?.insertAdjacentElement("afterend", error);
  }

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
    control.insertAdjacentElement("afterend", error);
    control.setAttribute("aria-invalid", "true");
    control.setAttribute("aria-describedby", error.id);
  }

  function withPrefill(href, values) {
    try {
      const url = new URL(href, window.location.href);
      [
        ["firstname", values.firstName],
        ["lastname", values.lastName],
        ["email", values.email],
      ].forEach(([key, value]) => {
        if (value && value.trim()) url.searchParams.set(key, value.trim());
      });
      return url.toString();
    } catch (_error) {
      return href;
    }
  }

  hostInputs.forEach((input) => {
    input.addEventListener("change", () => {
      selectedInput = input;
      clearHostError();
      renderTarget(hostFromInput(input));
    });
  });

  Object.values(fields).forEach((control) => {
    control?.addEventListener("input", () => clearFieldError(control));
  });

  continueButton?.addEventListener("click", () => {
    if (!selectedInput) {
      showHostError("Please choose who you'd like to meet.");
      hostInputs[0]?.focus();
      return;
    }
    clearHostError();
    renderTarget(hostFromInput(selectedInput));
    showStep("details");
    (fields.firstName?.value ? fields.email : fields.firstName)?.focus();
  });

  detailsForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;
    Object.entries(requiredMessages).forEach(([id, message]) => {
      const control = fields[id];
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

    const host = hostFromInput(selectedInput);
    const bookingUrl = withPrefill(host.bookingUrl, {
      firstName: fields.firstName.value,
      lastName: fields.lastName.value,
      email: fields.email.value,
    });

    window.open(bookingUrl, "_blank", "noopener,noreferrer");

    const handoffLink = document.getElementById("booking-handoff-link");
    if (handoffLink) handoffLink.href = bookingUrl;

    showStep("handoff");

    const config = JSON.parse(detailsForm.dataset.meetingConfig || "{}");
    config.endpoint = window.PROMOFY_MEETING_FORM_ENDPOINT || config.endpoint;
    submitMeeting(
      {
        firstName: fields.firstName.value.trim(),
        lastName: fields.lastName.value.trim(),
        email: fields.email.value.trim(),
        preferredHost: host.name,
      },
      config,
    ).catch(() => undefined);
  });

  document.querySelectorAll(".booking-back").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.closest("#booking-step-handoff")) {
        detailsForm?.reset();
        Object.values(fields).forEach((control) => control && clearFieldError(control));
      }
      showStep("host");
      (selectedInput || hostInputs[0])?.focus();
    });
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
