import { REVENUE_STAGES } from "@/lib/site";
import CountUp from "./count-up";
import Reveal from "./reveal";

export default function RevenueSystem() {
  return (
    <section className="revenue section-pad" aria-labelledby="revenue-heading">
      <div className="section-shell">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow">The Promofy revenue system</p>
            <h2 id="revenue-heading">
              Not another tool.
              <br />
              <span className="grad-text">A revenue system.</span>
            </h2>
            <p>
              We connect acquisition, retention &amp; loyalty into one continuous engagement loop —
              each stage feeding the next, every interaction compounding value.
            </p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="revenue-columns">
            {REVENUE_STAGES.map((stage) => (
              <div className="rev-card" key={stage.label}>
                <span className="rev-dot" aria-hidden="true" />
                <p className="rev-label">{stage.label}</p>
                <h3>{stage.title}</h3>
                <ul>
                  {stage.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="rev-metrics">
                  {stage.metrics.map((metric) => (
                    <div className="rev-metric" key={metric.note}>
                      <strong>
                        <CountUp value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
                      </strong>
                      <small>{metric.note}</small>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={2}>
          <p className="rev-footnote">
            One system. Three levers. Continuous compounding across the player lifecycle.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
