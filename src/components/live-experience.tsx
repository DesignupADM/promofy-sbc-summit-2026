import { ArrowRight } from "lucide-react";
import { LIVE_STEPS, EVENT } from "@/lib/site";
import BrandImg from "./brand-img";
import Reveal from "./reveal";

function LivePhoneScene() {
  return (
    <figure className="live-visual-card">
      <div className="live-visual-media">
        <BrandImg
          src="/assets/promofy/promofy-live-experience-v2.jpg"
          alt="A Promofy player interaction flowing from a mobile prediction to live results and a confirmed reward."
          width={1122}
          height={1402}
          className="live-visual-image"
          loading="lazy"
        />
        <span className="live-visual-status" aria-hidden="true">
          <i /> Live at SBC <b>S18</b>
        </span>
      </div>

      <figcaption className="live-visual-flow">
        <span><b>01</b> Player input</span>
        <i aria-hidden="true" />
        <span><b>02</b> Live result</span>
        <i aria-hidden="true" />
        <span><b>03</b> Response captured</span>
      </figcaption>
    </figure>
  );
}

export default function LiveExperience() {
  return (
    <section className="live section-pad" id="live-experience" aria-labelledby="live-heading">
      <div className="section-shell">
        <div className="live-grid">
          <Reveal>
            <div className="live-copy">
              <p className="eyebrow">Promofy Product Experience</p>
              <h2 id="live-heading">
                Don&apos;t just watch it.
                <br />
                <span className="grad-text">Play it.</span>
              </h2>
              <p>
                We&apos;re an engagement technology company. So our SBC experience should not be another
                presentation where the audience simply watches — walk up to S18, scan, and play along.
              </p>
              <div className="live-cta">
                <a href="#request-meeting" className="btn btn--ghost">
                  Request a meeting
                  <ArrowRight aria-hidden="true" />
                </a>
                <p>{EVENT.stand} · {EVENT.dateRange} · {EVENT.city}</p>
              </div>

              <ol className="live-steps" aria-label="How the live experience works">
                {LIVE_STEPS.map((step) => (
                  <li className="step-cell" key={step.n}>
                    <b>{step.n}</b>
                    <span>
                      <strong>{step.title}</strong>
                      <small>{step.note}</small>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="live-visual">
              <LivePhoneScene />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
