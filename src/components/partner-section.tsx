import { ArrowUpRight } from "lucide-react";
import Reveal from "./reveal";

export default function PartnerSection() {
  return (
    <section className="partners section-pad" aria-labelledby="partners-heading">
      <div className="section-shell">
        <div className="partners-grid">
          <Reveal>
            <div className="partners-copy">
              <p className="eyebrow">For consultants &amp; ecosystem partners</p>
              <h2 id="partners-heading">
                Your expertise.
                <br />
                <span className="grad-text">Powered by Promofy.</span>
              </h2>
              <p>
                CRM professional, MarTech consultant, agency or systems integrator? Build with Promofy
                through referrals, certification, services and co-selling opportunities.
              </p>
              <div className="partner-chips">
                <span>Referrals</span>
                <span>Certification</span>
                <span>Services</span>
                <span>Co-selling</span>
              </div>
              <div className="partners-actions">
                <a
                  href="https://club.promofy.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost"
                >
                  Explore the Partners Club
                  <ArrowUpRight aria-hidden="true" size={17} />
                </a>
                <small>Join the Promofy Partners Club and grow with the engagement ecosystem.</small>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="partner-tier" aria-hidden="true">
              <div className="tier-card">
                <b>01</b>
                <span>Referral Partner</span>
                <small>Introduce qualified opportunities.</small>
              </div>
              <div className="tier-card">
                <b>02</b>
                <span>Certified Partner</span>
                <small>Build verified Promofy expertise.</small>
              </div>
              <div className="tier-card">
                <b>03</b>
                <span>Co-Sell Partner</span>
                <small>Win customers together.</small>
              </div>
              <div className="tier-card">
                <b>04</b>
                <span>Strategic Partner</span>
                <small>Long-term mutual growth.</small>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
