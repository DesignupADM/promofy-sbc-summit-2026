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

const interactions = await evaluate(`(() => {
  const menu = document.querySelector(".menu-button");
  menu.click();
  const menuOpened = menu.getAttribute("aria-expanded") === "true" && !document.getElementById("mobile-nav").hidden;
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  const menuClosed = menu.getAttribute("aria-expanded") === "false" && document.getElementById("mobile-nav").hidden;

  const faq = document.querySelector(".faq-trigger");
  faq.click();
  const panel = document.getElementById(faq.getAttribute("aria-controls"));
  const faqOpened = faq.getAttribute("aria-expanded") === "true" && panel.hidden === false && panel.getAttribute("role") === "region";

  const form = document.querySelector(".booking-form");
  form.querySelector("button[type='submit']").click();
  const invalidFocus = document.activeElement?.id;
  const validationAlerts = form.querySelectorAll('[role="alert"]').length;

  [
    ["firstName", "Alex"],
    ["lastName", "Silva"],
    ["email", "alex@example.com"],
    ["interest", "AI"],
    ["day", "Flexible"],
  ].forEach(([id, value]) => {
    const control = document.getElementById(id);
    control.value = value;
    control.dispatchEvent(new Event("input", { bubbles: true }));
    control.dispatchEvent(new Event("change", { bubbles: true }));
  });
  form.querySelector("button[type='submit']").click();
  const success = form.querySelector(".form-status")?.textContent.includes("request is in") ?? false;

  return { menuOpened, menuClosed, faqOpened, invalidFocus, validationAlerts, success };
})()`);

const failures = viewportResults.flatMap((result) => {
  const viewportFailures = [];
  if (result.scrollWidth > result.width) viewportFailures.push(`${result.width}px horizontal overflow`);
  if (result.sections !== 8) viewportFailures.push(`${result.width}px section count`);
  if (result.h1 !== 1) viewportFailures.push(`${result.width}px H1 count`);
  if (result.incompleteImages !== 0) viewportFailures.push(`${result.width}px images`);
  if (result.localReferences !== 0) viewportFailures.push(`${result.width}px local references`);
  if (!result.visibleHeaderCta) viewportFailures.push(`${result.width}px header CTA`);
  if (result.firstRevealVisible !== "1") viewportFailures.push(`${result.width}px reveal visibility`);
  if (result.fonts !== "loaded") viewportFailures.push(`${result.width}px fonts`);
  return viewportFailures;
});

if (!Object.values(interactions).every((value, index) => index === 3 ? value === "firstName" : index === 4 ? value === 5 : value === true)) {
  failures.push("interactive behavior");
}

console.log(JSON.stringify({ viewportResults, interactions, failures }, null, 2));
socket.close();

if (failures.length > 0) process.exitCode = 1;
