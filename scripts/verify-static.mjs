import fs from "node:fs";

const pages = ["out/index.html", "out/sbc-summit-2026/index.html"];
const requiredIds = [
  "meet-us",
  "why-promofy",
  "live-experience",
  "request-meeting",
  "faq-heading",
  "final-heading",
];
const forbiddenCopy = [
  "Choose your conversation",
  "Trusted by operators &amp; partners worldwide",
  "Built to work with your stack",
  "Global by design",
  "Powered by Promofy",
];
const expectedSections = [
  "hero",
  "event-team",
  "feature-bento",
  "live",
  "awards",
  "booking",
  "faq",
  "final",
];

let failed = false;

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  const hashLinks = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  const missingAnchors = [...new Set(hashLinks.filter((id) => !ids.includes(id)))];
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  const imagesMissingAlt = images.filter((tag) => !/\salt=("[^"]*"|'[^']*')/.test(tag));
  const absentIds = requiredIds.filter((id) => !ids.includes(id));
  const presentForbiddenCopy = forbiddenCopy.filter((copy) => html.includes(copy));
  const h1Count = (html.match(/<h1\b/g) ?? []).length;
  const requestMeetingLinks = (html.match(/href="#request-meeting"/g) ?? []).length;
  const renderedSections = [...html.matchAll(/<section\s+class="([^"]+)"/g)].map(
    (match) => match[1].split(" ")[0],
  );
  const sectionOrderMatches = JSON.stringify(renderedSections) === JSON.stringify(expectedSections);

  const result = {
    h1Count,
    duplicateIds,
    missingAnchors,
    imagesMissingAlt: imagesMissingAlt.length,
    absentIds,
    presentForbiddenCopy,
    requestMeetingLinks,
    renderedSections,
    sectionOrderMatches,
  };

  console.log(`${file}: ${JSON.stringify(result)}`);

  if (
    h1Count !== 1 ||
    duplicateIds.length > 0 ||
    missingAnchors.length > 0 ||
    imagesMissingAlt.length > 0 ||
    absentIds.length > 0 ||
    presentForbiddenCopy.length > 0 ||
    !sectionOrderMatches
  ) {
    failed = true;
  }
}

const cssFiles = fs
  .readdirSync("out/_next/static/chunks")
  .filter((file) => file.endsWith(".css"))
  .map((file) => `out/_next/static/chunks/${file}`);
const compiledCss = cssFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const forbiddenFont = /(?:font-family|--font-[^:]+):[^;}\"]*(?:Inter|Manrope|SF Pro)/i;
const fontResult = {
  montserratPresent: compiledCss.includes("Montserrat"),
  forbiddenFontPresent: forbiddenFont.test(compiledCss),
};

console.log(`compiled typography: ${JSON.stringify(fontResult)}`);

if (!fontResult.montserratPresent || fontResult.forbiddenFontPresent) {
  failed = true;
}

if (failed) {
  process.exitCode = 1;
}
