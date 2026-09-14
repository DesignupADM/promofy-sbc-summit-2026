import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const debugPort = process.env.CHROME_DEBUG_PORT ?? "9224";
const targetFile = path.resolve(process.argv[2] ?? "promofy-sbc-summit-2026-standalone.html");
const targets = await fetch(`http://127.0.0.1:${debugPort}/json`).then((response) => response.json());
const target = targets.find((candidate) => candidate.type === "page");

if (!target) throw new Error("No Chrome page target is available.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let commandId = 0;
const pending = new Map();
const eventWaiters = new Map();

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const handlers = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) handlers?.reject(new Error(message.error.message));
    else handlers?.resolve(message.result);
    return;
  }

  const waiters = eventWaiters.get(message.method) ?? [];
  waiters.splice(0).forEach((resolve) => resolve(message.params));
});

function send(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function waitForEvent(method) {
  return new Promise((resolve) => {
    const waiters = eventWaiters.get(method) ?? [];
    waiters.push(resolve);
    eventWaiters.set(method, waiters);
  });
}

async function evaluate(expression, awaitPromise = false) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setEmulatedMedia", {
  media: "screen",
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
});

const viewportResults = [];
const viewports = [
  { width: 1440, height: 900, mobile: false, screenshot: "/tmp/promofy-standalone-1440.png" },
  { width: 768, height: 1024, mobile: false, screenshot: "/tmp/promofy-standalone-768.png" },
  { width: 390, height: 844, mobile: true, screenshot: "/tmp/promofy-standalone-390.png" },
];

for (const viewport of viewports) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });

  const loaded = waitForEvent("Page.loadEventFired");
  await send("Page.navigate", { url: pathToFileURL(targetFile).href });
  await loaded;
  await evaluate("document.fonts.ready.then(() => true)", true);
  await evaluate(`(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((image) => { image.loading = "eager"; });
    return Promise.all(Array.from(document.images).map((image) => image.decode().catch(() => false))).then(() => true);
  })()`, true);

  const audit = await evaluate(`(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    sections: document.querySelectorAll("main > section").length,
    h1: document.querySelectorAll("h1").length,
    images: document.images.length,
    incompleteImages: Array.from(document.images).filter((image) => !image.complete || image.naturalWidth === 0).length,
    localReferences: document.querySelectorAll('[src^="/"], [href^="/"]').length,
    visibleHeaderCta: (() => {
      const element = document.querySelector(".header-meeting-cta");
      return Boolean(element && element.getBoundingClientRect().width && getComputedStyle(element).visibility !== "hidden");
    })(),
    firstRevealVisible: getComputedStyle(document.querySelector(".reveal")).opacity,
    fonts: document.fonts.status,
  }))()`);

  const metrics = await send("Page.getLayoutMetrics");
  const capture = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: metrics.cssContentSize.width,
      height: metrics.cssContentSize.height,
      scale: 1,
    },
  });
  fs.writeFileSync(viewport.screenshot, Buffer.from(capture.data, "base64"));
  viewportResults.push({ ...audit, screenshot: viewport.screenshot });
}

const interactions = await evaluate(`(async () => {
  const menu = document.querySelector(".menu-button");
  menu.click();
  const menuOpened = menu.getAttribute("aria-expanded") === "true" && !document.getElementById("mobile-nav").hidden;
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  const menuClosed = menu.getAttribute("aria-expanded") === "false" && document.getElementById("mobile-nav").hidden;

  const faq = document.querySelector(".faq-trigger");
  faq.click();
  const panel = document.getElementById(faq.getAttribute("aria-controls"));
  const faqOpened = faq.getAttribute("aria-expanded") === "true" && panel.hidden === false && panel.getAttribute("role") === "region";

  const continueButton = document.getElementById("booking-step-host").querySelector("button");
  continueButton.click();
  const hostErrorShown = Boolean(document.getElementById("host-error"));
  const hostErrorFocus = document.activeElement?.id;

  const opened = [];
  window.open = (url) => {
    opened.push(url);
    return { closed: false };
  };

  const host = document.getElementById("host-vakhtang");
  host.checked = true;
  host.dispatchEvent(new Event("change", { bubbles: true }));
  continueButton.click();
  const detailsShown = document.getElementById("booking-step-details").hidden === false;

  const form = document.getElementById("booking-step-details").querySelector("form");
  form.querySelector("button[type='submit']").click();
  const invalidFocus = document.activeElement?.id;
  const validationAlerts = form.querySelectorAll('[role="alert"]').length;

  const submissions = [];
  window.fetch = async (url, options) => {
    submissions.push({ url, body: JSON.parse(options.body) });
    return { ok: true };
  };
  form.dataset.meetingConfig = JSON.stringify({ portalId: "123456", formId: "12345678-1234-1234-1234-123456789abc" });

  [
    ["firstName", "Alex"],
    ["lastName", "Silva"],
    ["email", "alex@example.com"],
  ].forEach(([id, value]) => {
    const control = document.getElementById(id);
    control.value = value;
    control.dispatchEvent(new Event("input", { bubbles: true }));
  });
  form.querySelector("button[type='submit']").click();
  await new Promise((resolve) => setTimeout(resolve, 0));

  const handoffShown = document.getElementById("booking-step-handoff").hidden === false;
  const bookingUrl = opened[0] ?? "";
  const prefill = new URL(bookingUrl).searchParams;
  const handoffHref = document.getElementById("booking-handoff-link").getAttribute("href");
  const submission = submissions[0];
  const hubspotFields = submission
    ? Object.fromEntries(submission.body.fields.map((field) => [field.name, field.value]))
    : {};

  const back = document.querySelector("#booking-step-handoff .booking-back");
  back.click();
  const restarted = document.getElementById("booking-step-host").hidden === false;

  return {
    menuOpened,
    menuClosed,
    faqOpened,
    hostErrorShown,
    hostErrorFocus,
    detailsShown,
    invalidFocus,
    validationAlerts,
    handoffShown,
    bookingHost: prefill.get("host") ?? new URL(bookingUrl).pathname,
    bookingFirstName: prefill.get("firstname"),
    bookingLastName: prefill.get("lastname"),
    bookingEmail: prefill.get("email"),
    handoffHrefMatches: handoffHref === bookingUrl,
    hubspotUrl: submission?.url ?? "",
    hubspotFirstName: hubspotFields.firstname,
    hubspotLastName: hubspotFields.lastname,
    hubspotEmail: hubspotFields.email,
    hubspotPreferredHost: hubspotFields.sbc_preferred_host,
    hubspotSource: hubspotFields.sbc_submission_source,
    hubspotEmptyFields: submission ? submission.body.fields.filter((field) => field.value === "").length : -1,
    hubspotSubmittedAt: Number(submission?.body?.submittedAt) > 0,
    restarted,
  };
})()`, true);

const failures = viewportResults.flatMap((result) => {
  const viewportFailures = [];
  if (result.scrollWidth > result.width) viewportFailures.push(`${result.width}px horizontal overflow`);
  if (result.sections !== 7) viewportFailures.push(`${result.width}px section count`);
  if (result.h1 !== 1) viewportFailures.push(`${result.width}px H1 count`);
  if (result.incompleteImages !== 0) viewportFailures.push(`${result.width}px images`);
  if (result.localReferences !== 0) viewportFailures.push(`${result.width}px local references`);
  if (!result.visibleHeaderCta) viewportFailures.push(`${result.width}px header CTA`);
  if (result.firstRevealVisible !== "1") viewportFailures.push(`${result.width}px reveal visibility`);
  if (result.fonts !== "loaded") viewportFailures.push(`${result.width}px fonts`);
  return viewportFailures;
});

const interactionsExpectations = [
  ["menuOpened", true],
  ["menuClosed", true],
  ["faqOpened", true],
  ["hostErrorShown", true],
  ["hostErrorFocus", "host-irakli"],
  ["detailsShown", true],
  ["invalidFocus", "firstName"],
  ["validationAlerts", 3],
  ["handoffShown", true],
  ["bookingFirstName", "Alex"],
  ["bookingLastName", "Silva"],
  ["bookingEmail", "alex@example.com"],
  ["handoffHrefMatches", true],
  ["hubspotUrl", "https://api.hsforms.com/submissions/v3/integration/submit/123456/12345678-1234-1234-1234-123456789abc"],
  ["hubspotFirstName", "Alex"],
  ["hubspotLastName", "Silva"],
  ["hubspotEmail", "alex@example.com"],
  ["hubspotPreferredHost", "Vakhtang Mdivani"],
  ["hubspotSource", "sbc-summit-2026-landing"],
  ["hubspotEmptyFields", 0],
  ["hubspotSubmittedAt", true],
  ["restarted", true],
];

const interactionFailures = interactionsExpectations
  .filter(([key, expected]) => interactions[key] !== expected)
  .map(([key, expected]) => `${key}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(interactions[key])}`);

if (!String(interactions.bookingHost).includes("vakho")) {
  interactionFailures.push(`bookingHost: expected Vakhtang's HubSpot link, got ${JSON.stringify(interactions.bookingHost)}`);
}

if (interactionFailures.length > 0) {
  failures.push(`interactive behavior (${interactionFailures.join("; ")})`);
}

console.log(JSON.stringify({ viewportResults, interactions, failures }, null, 2));
socket.close();

if (failures.length > 0) process.exitCode = 1;
