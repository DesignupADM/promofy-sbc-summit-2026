import { EVENT } from "@/lib/site";
import Reveal from "./reveal";

export default function FinalCta() {
  return (
    <section className="final" aria-labelledby="final-heading">
      <div className="section-shell">
        <div className="final-inner">
          <Reveal>
            <p className="final-tag">SBC Summit 2026 · Lisbon</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 id="final-heading">
              <span className="line">Lisbon.</span>
              <span className="line grad-text">We&apos;re on.</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p>Experience the Promofy engagement ecosystem live — scan, join, play, and see it happen at S18.</p>
            <p className="final-meta">{EVENT.shortDate} · {EVENT.stand}</p>
          </Reveal>
          <Reveal delay={3}>
            <div className="final-actions">
              <a href="#request-meeting" className="btn btn--primary">
                Request a meeting
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
