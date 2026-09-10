import assert from "node:assert/strict";
import { test } from "node:test";
import { submitMeeting } from "../src/lib/submit-meeting.mjs";

test("meeting submissions preserve all details and reject unsuccessful delivery", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.window = { location: { href: "https://promofy.ai/sbc-summit-2026/" } };
  globalThis.document = { title: "Promofy at SBC Summit 2026" };
  const values = {
    firstName: " Alex ", lastName: "Silva", email: "alex@example.com", company: "Example",
    jobTitle: "Head of CRM", interest: "Engagement", preferredHost: "Negin",
    day: "29 September", time: "Morning", message: "Discuss integration.\nBring technical details.",
  };
  const config = { portalId: "123456", formId: "12345678-1234-1234-1234-123456789abc" };
  let calls = 0;
  try {
    globalThis.fetch = async (url, options) => {
      calls++;
      assert.equal(url, `https://api.hsforms.com/submissions/v3/integration/submit/${config.portalId}/${config.formId}`);
      const body = JSON.parse(options.body);
      assert.deepEqual(Object.fromEntries(body.fields.map(f => [f.name, f.value])), {
        firstname: "Alex", lastname: "Silva", email: values.email, company: values.company,
        jobtitle: values.jobTitle, sbc_area_of_interest: values.interest,
        sbc_preferred_host: values.preferredHost, sbc_preferred_day: values.day,
        sbc_preferred_time: values.time, sbc_message: values.message,
        sbc_submission_source: "sbc-summit-2026-landing",
      });
      assert.equal(body.context.pageUri, window.location.href);
      assert.equal(body.context.pageName, document.title);
      assert.ok(Number(body.submittedAt) > 0);
      assert.ok(options.signal instanceof AbortSignal);
      return { ok: true };
    };
    await submitMeeting(values, config);
    assert.equal(calls, 1);
    await assert.rejects(submitMeeting(values, {}), /not configured/);
    await assert.rejects(submitMeeting(values, { portalId: "123" }), /incomplete/);
    assert.equal(calls, 1);
    for (const status of [400, 429, 500]) {
      globalThis.fetch = async () => ({ ok: false, status });
      await assert.rejects(submitMeeting(values, config), new RegExp(String(status)));
    }
    globalThis.fetch = async () => { throw new TypeError("Network failure"); };
    await assert.rejects(submitMeeting(values, config), /Network failure/);
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "https://example.com/form");
      assert.deepEqual(JSON.parse(options.body), { ...values, source: "sbc-summit-2026-landing" });
      return { ok: true };
    };
    await submitMeeting(values, { endpoint: "https://example.com/form" });
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.window;
    delete globalThis.document;
  }
});
