import type { Metadata } from "next";
import { RsvpPage } from "@/components/rsvp-page";
import { rsvpEventJsonLd, rsvpFaqJsonLd, organizationJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://promofy.ai"),
  title: "RSVP — Promofy at SBC Summit 2026 | Startup Hub S18, Lisbon",
  description:
    "RSVP to meet Promofy at SBC Summit 2026 in Lisbon, 29 September–1 October. Live demos of Spark, Gamification, Sports F2P, AI and Jackpots at the Startup Hub, stand S18.",
  keywords: [
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
    title: "RSVP — See Promofy Live at SBC Summit 2026",
    description:
      "You're invited. RSVP for the Promofy stand at SBC Summit 2026 in Lisbon — Startup Hub, S18, 29 September–1 October.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RSVP — Promofy at SBC Summit 2026",
    description: "RSVP for stand S18 and see the engagement ecosystem live in Lisbon.",
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
