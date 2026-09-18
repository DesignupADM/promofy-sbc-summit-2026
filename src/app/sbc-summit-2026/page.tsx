import { EventLandingPage } from "@/components/event-landing-page";
import { eventJsonLd, organizationJsonLd } from "@/lib/site";

export default function SbcSummitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <EventLandingPage />
    </>
  );
}

