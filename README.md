# Promofy at SBC Summit 2026

A responsive, static-export Next.js landing page for Promofy's SBC Summit 2026 campaign.

## Routes

- `/sbc-summit-2026/` — canonical campaign page
- `/` — mirrors the campaign page for convenient local preview

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000/sbc-summit-2026/](http://localhost:3000/sbc-summit-2026/).

## Production build

```bash
npm run lint
npm run build
```

The deployable static site is generated in `out/`.

## Booking flow

The booking section (`#request-meeting`) is a two-step flow instead of a long form:

1. **Who to meet** — the visitor picks Irakli, Vakhtang, Negin, or "Not sure who to meet?", which routes to the Head of Sales as the default host.
2. **Your details** — first name, last name, and work email.
3. **Handoff** — the chosen host's HubSpot meeting link opens in a new tab with the visitor's details pre-filled as `firstname`, `lastname`, and `email` query parameters, plus a fallback button in case the new tab is blocked.

Each host's link comes from `EVENT_TEAM[].bookingHref` in `src/lib/site.ts` and can be overridden per environment:

```bash
NEXT_PUBLIC_IRAKLI_BOOKING_URL=https://your-private-booking-link
NEXT_PUBLIC_VAKHTANG_BOOKING_URL=https://your-private-booking-link
NEXT_PUBLIC_NEGIN_BOOKING_URL=https://your-private-booking-link
```

### Lead capture alongside the handoff

In parallel with opening the scheduler, the same details are submitted to HubSpot's [Forms API](https://developers.hubspot.com/docs/api-reference/legacy/marketing/forms/v3-legacy/submit-data-unauthenticated) so an abandoned booking still becomes a lead. Copy `.env.example` to `.env.local` and set the public IDs from your HubSpot form embed code:

```bash
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=your-portal-id
NEXT_PUBLIC_HUBSPOT_FORM_ID=your-form-guid
```

In HubSpot, create a dedicated SBC meeting form. Add the following **contact properties** to that form using these exact internal names. Create the `sbc_preferred_host` property first as single-line text.

| Website field | HubSpot internal property name |
| --- | --- |
| First name | `firstname` |
| Last name | `lastname` |
| Work email | `email` |
| Host the visitor picked | `sbc_preferred_host` |
| Campaign source (hidden) | `sbc_submission_source` |

Only the fields the visitor actually filled in are posted, so the Forms API never clears existing contact properties with empty values. The campaign source is `sbc-summit-2026-landing`; submission time, page URL, and page title are also included. The integration does not opt visitors into marketing subscriptions. If the destination form requires explicit consent, its consent controls and payload must be added to the website before activation.

Set these environment variables in the production build environment, rebuild, and deploy `out/`. Public variables are baked into the static build; changing them requires a rebuild. Never put private HubSpot API tokens in these variables. To regenerate the self-contained HTML with the same settings, run `node scripts/build-standalone.mjs` after building.

A failed or unconfigured submission never blocks the visitor: the HubSpot scheduler opens first and the submission runs in the background. Verify with a controlled submission after deployment — check the HubSpot form submission and the contact's properties, including `sbc_preferred_host`. Live delivery has not been verified until this check passes. HubSpot form settings must allow submissions through the Forms API.

If HubSpot is not configured, an alternative JSON endpoint can be used:

```bash
NEXT_PUBLIC_MEETING_FORM_ENDPOINT=https://your-crm-or-form-endpoint.example
```

The alternative endpoint receives a JSON `POST` with the submitted form fields. Configure CORS for the production domain and return any `2xx` response on success. HubSpot takes precedence when its IDs are set.

Run the unit test for the submission helper with:

```bash
node --test scripts/test-meeting.mjs
```

## SEO

The page includes canonical metadata, Open Graph and Twitter metadata, keyword coverage, an Event JSON-LD object, and an FAQPage JSON-LD object.
