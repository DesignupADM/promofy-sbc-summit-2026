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

The form works in preview mode without an endpoint. To send real requests, copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_MEETING_FORM_ENDPOINT=https://your-crm-or-form-endpoint.example
```

The endpoint receives a JSON `POST` with the submitted form fields. Configure CORS for the production domain and return any `2xx` response on success.

The event-team cards also support person-specific scheduling URLs:

```bash
NEXT_PUBLIC_IRAKLI_BOOKING_URL=https://your-private-booking-link
NEXT_PUBLIC_VAKHTANG_BOOKING_URL=https://your-private-booking-link
NEXT_PUBLIC_NEGIN_BOOKING_URL=https://your-private-booking-link
```

Vakhtang and Negin fall back to their verified public Calendly pages. Irakli falls back to the on-page event request form until his event-specific link is provided.

## SEO

The page includes canonical metadata, Open Graph and Twitter metadata, keyword coverage, an Event JSON-LD object, and an FAQPage JSON-LD object.
