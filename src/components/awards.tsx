import Reveal from "./reveal";

export default function Awards() {
  return (
    <section className="awards" aria-labelledby="awards-heading">
      <div className="section-shell">
        <div className="awards-inner">
          <Reveal>
            <div className="awards-copy">
              <p className="eyebrow">Recognised by the industry</p>
              <h2 id="awards-heading">
                Award-winning <span className="grad-text">engagement.</span>
              </h2>
              <p>
                Independent industry recognition for the Promofy platform and the team behind it.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="awards-badges">
              <div className="award-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/promofy/Ice.png" alt="ICE award badge" width={79} height={44} loading="lazy" decoding="async" />
                <span>
                  <span className="award-year">2026</span>
                  <br />
                  <span className="award-name">Startup of the Year</span>
                </span>
              </div>
              <div className="award-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/promofy/Starties-Thrasher-Transparent-1.png"
                  alt="Starties award badge"
                  width={79}
                  height={44}
                  loading="lazy"
                  decoding="async"
                />
                <span>
                  <span className="award-year">2025</span>
                  <br />
                  <span className="award-name">Launch of The Year</span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
