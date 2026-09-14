// Self-contained so the standalone HTML build can embed the same submission code.
export async function submitMeeting(values, config) {
  const portalId = (config.portalId || "").trim();
  const formId = (config.formId || "").trim();
  let endpoint = config.endpoint || "";
  let payload = { ...values, source: "sbc-summit-2026-landing" };

  if (portalId || formId) {
    if (!/^\d+$/.test(portalId) || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formId)) {
      throw new Error("HubSpot form configuration is incomplete or invalid.");
    }
    endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
    const mapping = {
      firstName: "firstname", lastName: "lastname", email: "email",
      company: "company", jobTitle: "jobtitle", interest: "sbc_area_of_interest",
      preferredHost: "sbc_preferred_host", day: "sbc_preferred_day",
      time: "sbc_preferred_time", message: "sbc_message", source: "sbc_submission_source",
    };
    payload = {
      // Only the fields the visitor actually filled in are sent, so the Forms API
      // never overwrites existing HubSpot properties with empty values.
      fields: Object.entries(mapping)
        .map(([key, name]) => ({ objectTypeId: "0-1", name, value: String(payload[key] || "").trim() }))
        .filter((field) => field.value !== ""),
      submittedAt: String(Date.now()),
      context: { pageUri: window.location.href, pageName: document.title },
    };
  }
  if (!endpoint) throw new Error("Meeting submissions are not configured.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Meeting submission failed (${response.status}).`);
  } finally {
    clearTimeout(timeout);
  }
}
