import { MonitorPlay, CalendarCheck2 } from "lucide-react";
import Reveal from "./reveal";

export default function StepTwo() {
  return (
    <section className="step-two section-pad" aria-labelledby="step-two-heading">
      <div className="section-shell">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow eyebrow--light">Make Lisbon step two</p>
            <h2 id="step-two-heading" style={{ color: "var(--pfy-light-text)" }}>
              Make Lisbon
              <br />
              <span className="grad-text grad-text--violet">step two.</span>
            </h2>
            <p>
              The best conference meeting doesn&apos;t need to be the first conversation. See Promofy
              before SBC — then use Lisbon for the deeper commercial or technical discussion.
            </p>
          </div>
        </Reveal>

        <div className="option-grid">
          <Reveal delay={1} className="option-reveal">
            <div className="option-card option-now">
              <span className="option-tag">Online · Before SBC</span>
              <h3>See Promofy now.</h3>
              <p>
                Book an online demo. Show us the engagement challenge, and review the relevant product
                and integration setup — so your SBC conversation starts a step ahead.
              </p>
              <a href="#request-meeting" className="btn btn--ghost-dark">
                <MonitorPlay aria-hidden="true" size={17} />
                Book an Online Demo
              </a>
            </div>
          </Reveal>
          <Reveal delay={2} className="option-reveal">
            <div className="option-card option-lisbon">
              <span className="option-tag">Startup Hub · S18</span>
              <h3>See Promofy in Lisbon.</h3>
              <p>
                Meet Promofy at SBC Summit. Experience the engagement ecosystem live at S18, then take
                the product, integration and commercial conversation as deep as it needs to go.
              </p>
              <a href="#request-meeting" className="btn btn--soft">
                <CalendarCheck2 aria-hidden="true" size={17} />
                Book a Lisbon Meeting
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
