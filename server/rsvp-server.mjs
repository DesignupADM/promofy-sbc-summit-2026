// Promofy SBC Summit — bundled Node server.
//
// Serves the static `out/` export and collects RSVP submissions into
// `data/rsvps.csv` via POST /api/rsvp. Zero dependencies, Node 18+.
//
// Build the site with the endpoint baked in, then run this server:
//
//   NEXT_PUBLIC_RSVP_FORM_ENDPOINT=/api/rsvp npm run build
//   npm run start:csv
//
// The same payload shape is accepted as the HubSpot Forms API fallback
// documented in README.md, so any JSON-compatible CRM endpoint can replace it.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "out");
const DATA_DIR = path.resolve(__dirname, "..", "data");
const CSV_PATH = path.join(DATA_DIR, "rsvps.csv");

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";
const MAX_BODY_BYTES = 64 * 1024;
const MAX_FIELD_CHARS = 300;
const RATE_LIMIT = { windowMs: 60_000, max: 20 };

const CSV_COLUMNS = [
  "timestamp",
  "first_name",
  "last_name",
  "email",
  "company",
  "job_title",
  "days",
  "status",
  "source",
];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Neutralises CSV/formula injection and quotes cells that need it. */
function csvCell(value) {
  let v = String(value ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .trim();
  if (/^[=+\-@]/.test(v)) v = `'${v}`;
  if (/[",]/.test(v)) v = `"${v.replace(/"/g, '""')}"`;
  return v;
}

function ensureCsv() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, `${CSV_COLUMNS.join(",")}\n`, "utf8");
  }
}

/** Serialises appends so concurrent submissions never interleave rows. */
let writeQueue = Promise.resolve();
function appendRow(row) {
  writeQueue = writeQueue.then(() =>
    fs.promises.appendFile(CSV_PATH, `${row.join(",")}\n`, "utf8"),
  );
  return writeQueue;
}

function cleanField(value) {
  return String(value ?? "").slice(0, MAX_FIELD_CHARS).trim();
}

function validateRsvp(body) {
  const errors = [];
  if (!cleanField(body.firstName)) errors.push("first_name is required");
  if (!cleanField(body.lastName)) errors.push("last_name is required");
  const email = cleanField(body.email);
  if (!email) errors.push("email is required");
  else if (!EMAIL_RE.test(email)) errors.push("email is invalid");
  return errors;
}

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 10_000) hits.clear();
  return list.length > RATE_LIMIT.max;
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size <= MAX_BODY_BYTES) chunks.push(chunk);
    });
    req.on("end", () => {
      if (size > MAX_BODY_BYTES) reject(new Error("payload too large"));
      else resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", reject);
  });
}

async function handleRsvp(req, res, ip) {
  if (rateLimited(ip)) return sendJson(res, 429, { error: "Too many requests. Please try again later." });

  let raw;
  try {
    raw = await readBody(req);
  } catch {
    return sendJson(res, 413, { error: "Payload too large." });
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return sendJson(res, 400, { error: "Invalid JSON payload." });
  }

  // Honeypot: real visitors never see or fill this field. Pretend success.
  if (String(body.website ?? "").trim()) {
    return sendJson(res, 200, { ok: true });
  }

  const errors = validateRsvp(body);
  if (errors.length > 0) return sendJson(res, 400, { errors });

  const row = [
    new Date().toISOString(),
    csvCell(body.firstName),
    csvCell(body.lastName),
    csvCell(body.email),
    csvCell(body.company),
    csvCell(body.jobTitle),
    csvCell(body.days),
    csvCell(body.status ?? "Confirmed"),
    csvCell(body.source ?? "sbc-summit-2026-rsvp"),
  ];

  try {
    ensureCsv();
    await appendRow(row);
  } catch (error) {
    console.error("[rsvp] failed to write CSV:", error.message);
    return sendJson(res, 500, { error: "Could not record the RSVP. Please try again." });
  }

  console.log(`[rsvp] recorded ${body.email} (${body.firstName} ${body.lastName})`);
  return sendJson(res, 200, { ok: true });
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  let relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");

  let filePath = path.resolve(ROOT, relative);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Not found");
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
    ...(ext === ".html" ? { "Cache-Control": "no-cache" } : { "Cache-Control": "public, max-age=31536000, immutable" }),
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  const ip = (req.socket.remoteAddress ?? "unknown").replace(/^.*:/, "");

  if (pathname === "/api/rsvp") {
    if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed." });
    return handleRsvp(req, res, ip);
  }

  if (pathname.startsWith("/api/")) {
    return sendJson(res, 404, { error: "Not found." });
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    return res.end("Method not allowed");
  }
  return serveStatic(req, res);
});

ensureCsv();
server.listen(PORT, HOST, () => {
  console.log(`Promofy SBC RSVP server on http://${HOST}:${PORT}`);
  console.log(`RSVPs append to ${CSV_PATH}`);
});
