# Promofy at SBC Summit 2026

A responsive, static-export Next.js landing page for Promofy's SBC Summit 2026 campaign.

## Routes

- `/sbc-summit-2026/` — canonical campaign page
- `/rsvp/` — event RSVP page (stand visit registration, calendar add, meeting handoff)
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

## RSVP page

The `/rsvp/` page collects stand-visit registrations and submits through the same integration style as the meeting form. Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=your-portal-id
NEXT_PUBLIC_HUBSPOT_RSVP_FORM_ID=your-rsvp-form-guid
```

Create a dedicated HubSpot RSVP form and add these **contact properties** with these exact internal names:

| RSVP field | HubSpot internal property name |
| --- | --- |
| First name | `firstname` |
| Last name | `lastname` |
| Work email | `email` |
| Company | `company` |
| Job title | `jobtitle` |
| Attending days | `sbc_rsvp_days` |
| RSVP status | `sbc_rsvp_status` |
| Campaign source (hidden) | `sbc_submission_source` |

Only first name, last name and email are required, matching the page. Days are sent as the selected day labels, status is always `Confirmed`, and the campaign source is `sbc-summit-2026-rsvp`. As with the meeting form, visitors are not opted into marketing subscriptions, and live delivery must be verified with a controlled submission after deployment.

An alternative JSON endpoint is also supported:

```bash
NEXT_PUBLIC_RSVP_FORM_ENDPOINT=https://your-crm-or-form-endpoint.example
```

The RSVP confirmation screen offers Google Calendar and `.ics` options (generated client-side, no backend), plus a handoff to the meeting booking flow.

## CSV collection (bundled Node server)

For teams that want RSVPs in a spreadsheet instead of a CRM, the repo ships a zero-dependency Node server (`server/rsvp-server.mjs`) that serves the static `out/` build and appends every RSVP as a row in `data/rsvps.csv`.

Build the site with the endpoint baked in, then start the server:

```bash
NEXT_PUBLIC_RSVP_FORM_ENDPOINT=/api/rsvp npm run build
npm run start:csv
```

The server listens on `PORT` (default `3000`, `HOST` default `0.0.0.0`). `data/rsvps.csv` is created on first start with the columns `timestamp, first_name, last_name, email, company, job_title, days, status, source` and appends are serialised so concurrent submissions never interleave. The `data/` directory is gitignored — attendee data stays on the server and should never be committed.

Server behaviour:

- `POST /api/rsvp` validates payload size, JSON shape, required fields and email format; CSV cells are quoted/escaped and formula injection is neutralised
- A hidden honeypot field drops bot submissions silently
- Simple per-IP rate limiting (20 submissions per minute)
- Everything else is served as static files with long-lived caching; `/rsvp/`, `/sbc-summit-2026/` and `/` all work

Notes:

- This replaces static hosting: deploy the app with `npm run start:csv` (Node 18+, e.g. a VPS, Render or Railway), not `npm run start`
- If you deploy to a plain static host instead, leave `NEXT_PUBLIC_RSVP_FORM_ENDPOINT` blank and configure HubSpot IDs — HubSpot takes precedence whenever they are set
- The endpoint receives the same JSON payload as the HubSpot fallback, so any JSON-compatible CRM endpoint can substitute for the CSV server

## Deploying on Coolify (Docker)

The repo ships a `Dockerfile` (and `.dockerignore`) so Coolify can build and run the site + CSV collector as one container.

1. In Coolify, create a new resource → select the repo → set **Build Pack** to `Dockerfile`
2. Expose port **3000** (the Dockerfile declares `EXPOSE 3000`; Coolify/Traefik handles HTTPS in front of it)
3. Add a **persistent storage** volume in the resource's *Storages* tab:
   - Mount path: `/app/data`
   - This keeps `rsvps.csv` across rebuilds, restarts and redeploys — without it every redeploy wipes the file
4. Leave the HubSpot variables unset so submissions go to `/api/rsvp` (the endpoint is baked into the image at build time via the Dockerfile ARG, default `/api/rsvp`)

Optional environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Port the Node server listens on |
| `HOST` | `0.0.0.0` | Bind address |

Verifying the deployment:

```bash
curl https://your-domain/rsvp/          # the page
curl -X POST https://your-domain/api/rsvp \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Test","lastName":"Test","email":"test@example.com"}'
```

Then check the CSV inside the container or volume (`/app/data/rsvps.csv`). Back up the volume (or `rsvps.csv`) alongside your other server backups — attendee data lives only there.

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
