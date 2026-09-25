import type { Metadata } from "next";
import { RsvpPage } from "@/components/rsvp-page";
import { rsvpEventJsonLd, rsvpFaqJsonLd, organizationJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://promofy.ai"),
  title: "RSVP — Promofy Showcase at SBC Summit 2026 | Main Stage, 1 Oct 13:00",
  description:
    "RSVP for the Promofy Showcase at SBC Summit 2026 — Main Stage, 1 October, 13:00. Promofy brings live demos of Spark, Gamification, Sports F2P, AI and Jackpots, plus the team at the Startup Hub, S18.",
  keywords: [
    "Promofy Showcase SBC Summit 2026",
    "Promofy SBC Summit 2026 RSVP",
    "SBC Summit Lisbon 2026 RSVP",
    "Promofy event registration",
    "Promofy stand S18",
    "SBC Summit Startup Hub",
    "iGaming gamification event",
    "meet Promofy Lisbon",
  ],
  alternates: { canonical: "/rsvp/" },
  openGraph: {
    type: "website",
    url: "/rsvp/",
    siteName: "Promofy",
    title: "RSVP — Promofy Showcase at SBC Summit 2026",
    description:
      "You're invited. RSVP for the Promofy Showcase on the Main Stage — SBC Summit 2026, 1 October at 13:00. Plus live demos at the Startup Hub, S18.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RSVP — Promofy Showcase at SBC Summit 2026",
    description: "Promofy is bringing something interesting to SBC. Main Stage, 1 October, 13:00.",
  },
  robots: { index: true, follow: true },
};

export default function RsvpPageRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rsvpEventJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rsvpFaqJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "SBC Summit 2026",
                item: "https://promofy.ai/sbc-summit-2026/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "RSVP",
                item: "https://promofy.ai/rsvp/",
              },
            ],
          }),
        }}
      />
      <RsvpPage />
    </>
  );
}
