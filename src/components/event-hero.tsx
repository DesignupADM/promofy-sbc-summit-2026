import { ArrowRight } from "lucide-react";
import HeroVisual from "./hero-visual";
import Reveal from "./reveal";

export default function EventHero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-heading">
      <div className="section-shell">
        <div className="hero-grid">
          <div className="hero-split">
            <div className="hero-copy">
              <Reveal>
                <p className="hero-kicker">Startup Hub · S18 · Lisbon</p>
              </Reveal>
              <Reveal delay={1}>
                <h1 id="hero-heading">
                  Turn player moments
                  <span className="line">
                    into <span className="hero-gradient-text">measurable growth.</span>
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="hero-lead">
                  Meet Promofy at SBC Summit for a focused 30-minute conversation about acquisition,
                  retention and loyalty.
                </p>
              </Reveal>
              <Reveal delay={2}>
                <div className="hero-actions">
                  <a href="#request-meeting" className="hero-primary-cta">
                    Request a meeting
                    <ArrowRight aria-hidden="true" />
                  </a>
                  <a href="#meet-us" className="hero-team-link">
                    Meet the team
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
              <Reveal delay={3}>
                <p className="hero-microcopy">30 minutes · Practical recommendations · Clear next steps</p>
              </Reveal>
            </div>

            <Reveal delay={1} className="hero-visual-reveal">
              <HeroVisual />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
