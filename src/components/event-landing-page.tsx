import SiteHeader from "./site-header";
import EventHero from "./event-hero";
import FeatureBento from "./ui/feature-bento";
import LiveExperience from "./live-experience";
import Awards from "./awards";
import EventTeam from "./event-team";
import BookingSection from "./booking";
import Faq from "./faq";
import FinalCta from "./final-cta";
import SiteFooter from "./site-footer";

export function EventLandingPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <EventHero />
        <EventTeam />
        <FeatureBento />
        <LiveExperience />
        <Awards />
        <BookingSection />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
