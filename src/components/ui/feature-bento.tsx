import { ArrowUpRight, Braces, Gauge, Languages, Layers3 } from "lucide-react";
import BrandImg from "../brand-img";
import Reveal from "../reveal";

export default function FeatureBento() {
  return (
    <section className="feature-bento" id="why-promofy" aria-labelledby="feature-bento-heading">
      <div className="section-shell">
        <Reveal>
          <div className="feature-bento-grid">
            <article className="bento-card bento-card--lead">
              <BrandImg
                src="/assets/promofy/promofy-signal-system.webp"
                alt=""
                className="bento-lead-media"
                loading="lazy"
              />
              <span className="bento-lead-overlay" aria-hidden="true" />
              <div className="bento-lead-content">
                <p className="bento-pill">
                  <i aria-hidden="true" />
                  Player signal → live action
                </p>
                <h2 id="feature-bento-heading">
                  Turn the moment
                  <br />
                  <span>into momentum.</span>
                </h2>
                <p>
                  Promofy turns live player behaviour into playable, rewardable experiences across
                  acquisition, retention and loyalty.
                </p>
                <div className="bento-signal-map" role="img" aria-label="Player signal becomes an experience and then an outcome">
                  <span><i /> Signal</span>
                  <b aria-hidden="true" />
                  <span><i /> Experience</span>
                  <b aria-hidden="true" />
                  <span><i /> Outcome</span>
                </div>
              </div>
            </article>

            <article className="bento-card bento-card--experiences">
              <span className="bento-icon" aria-hidden="true">
                <Layers3 />
              </span>
              <div>
                <span className="bento-card-label">Acquire</span>
                <h3>Start with play</h3>
                <p>Spark and F2P experiences turn passive traffic into active participation.</p>
              </div>
            </article>

            <article className="bento-card bento-card--stack">
              <span className="bento-icon" aria-hidden="true">
                <Braces />
              </span>
              <div>
                <span className="bento-card-label">Integrate</span>
                <h3>Fits your stack</h3>
                <p>API-first and CRM-connected, with real-time behavioural data flowing both ways.</p>
              </div>
            </article>

            <a className="bento-card bento-card--cta" href="#request-meeting">
              <span className="bento-cta-top">
                Meet us at S18
                <i aria-hidden="true">
                  <ArrowUpRight />
                </i>
              </span>
              <span className="bento-cta-title">
                Bring your
                <br />
                growth challenge.
              </span>
              <span className="bento-cta-copy">Request a focused 30-minute session in Lisbon.</span>
            </a>

            <article className="bento-card bento-card--languages">
              <span className="bento-icon" aria-hidden="true">
                <Languages />
              </span>
              <div>
                <span className="bento-card-label">Retain</span>
                <h3>Keep value moving</h3>
                <p>Missions, rewards and loyalty journeys respond to what players do next.</p>
              </div>
            </article>

            <article className="bento-card bento-card--realtime">
              <span className="bento-icon" aria-hidden="true">
                <Gauge />
              </span>
              <div>
                <span className="bento-card-label">Scale</span>
                <h3>Built for operations</h3>
                <p>Multi-brand, multi-market and 30+ languages from one engagement layer.</p>
              </div>
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
