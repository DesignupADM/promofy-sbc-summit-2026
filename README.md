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

## Meeting form

The existing website form submits directly to HubSpot's [Forms API](https://developers.hubspot.com/docs/api-reference/legacy/marketing/forms/v3-legacy/submit-data-unauthenticated). Copy `.env.example` to `.env.local` and set the public IDs from your HubSpot form embed code:

```bash
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=your-portal-id
NEXT_PUBLIC_HUBSPOT_FORM_ID=your-form-guid
```

In HubSpot, create a dedicated SBC meeting form. Add the following **contact properties** to that form using these exact internal names. Create the `sbc_` properties first; use single-line text except for the multiline message. Text properties preserve the website's option labels without dropdown internal-value mismatches.

| Website field | HubSpot internal property name |
| --- | --- |
| First name | `firstname` |
| Last name | `lastname` |
| Work email | `email` |
| Company | `company` |
| Job title | `jobtitle` |
| Area of interest | `sbc_area_of_interest` |
| Preferred host | `sbc_preferred_host` |
| Preferred day | `sbc_preferred_day` |
| Preferred time | `sbc_preferred_time` |
| Message | `sbc_message` |
| Campaign source (hidden) | `sbc_submission_source` |

Only first name, last name, email, area of interest, and preferred day should be required, matching the website. The campaign source is `sbc-summit-2026-landing`. Submission time, page URL, and page title are also included. The integration does not opt visitors into marketing subscriptions. If the destination form requires explicit consent, its consent controls and payload must be added to the website before activation.

Set these environment variables in the production build environment, rebuild, and deploy `out/`. Public variables are baked into the static build; changing them requires a rebuild. Never put private HubSpot API tokens in these variables. To regenerate the self-contained HTML with the same settings, run `node scripts/build-standalone.mjs` after building.

Verify with a controlled submission after deployment: check the HubSpot form submission and the contact's properties for every field, including the message and meeting preferences. Live delivery has not been verified until this check passes. HubSpot form settings must allow submissions through the Forms API.

If HubSpot is not configured, an alternative JSON endpoint can be used:

```bash
NEXT_PUBLIC_MEETING_FORM_ENDPOINT=https://your-crm-or-form-endpoint.example
```

The alternative endpoint receives a JSON `POST` with the submitted form fields. Configure CORS for the production domain and return any `2xx` response on success. HubSpot takes precedence when its IDs are set. Missing configuration, rejected submissions, network failures, and timeouts show an error and retain the entered details; there is no simulated success mode.

The event-team cards also support person-specific scheduling URLs:

```bash
NEXT_PUBLIC_IRAKLI_BOOKING_URL=https://your-private-booking-link
NEXT_PUBLIC_VAKHTANG_BOOKING_URL=https://your-private-booking-link
NEXT_PUBLIC_NEGIN_BOOKING_URL=https://your-private-booking-link
```

Vakhtang and Negin fall back to their verified public Calendly pages. Irakli falls back to the on-page event request form until his event-specific link is provided.

## SEO

The page includes canonical metadata, Open Graph and Twitter metadata, keyword coverage, an Event JSON-LD object, and an FAQPage JSON-LD object.
