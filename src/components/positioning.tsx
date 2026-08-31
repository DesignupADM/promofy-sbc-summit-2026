import Reveal from "./reveal";

const ECOSYSTEM = ["Acquisition", "Participation", "Retention", "Loyalty", "Intelligence"];

export default function Positioning() {
  return (
    <section className="positioning section-pad" id="why-promofy" aria-labelledby="positioning-heading">
      <div className="section-shell">
        <div className="positioning-inner">
          <Reveal>
            <p className="eyebrow">One unified ecosystem</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 id="positioning-heading">
              One platform.
              <br />
              <span className="grad-text">Multiple growth levers.</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="positioning-copy">
              Promofy started around gamification. Today, it connects acquisition, activation,
              participation, retention and loyalty through one engagement ecosystem — designed for the
              most competitive industries.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="ecosystem-line" role="list" aria-label="The Promofy ecosystem">
              {ECOSYSTEM.map((node, i) => (
                <span key={node} className="eco-node-wrap">
                  <span className="eco-node" role="listitem">
                    <i aria-hidden="true" />
                    {node}
                  </span>
                  {i < ECOSYSTEM.length - 1 && (
                    <span className="eco-arrow" aria-hidden="true">
                      ⟶
                    </span>
                  )}
                </span>
              ))}
            </div>
            <p className="eco-note">One engine · Every stage of the player journey</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
