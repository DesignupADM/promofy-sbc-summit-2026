import { ArrowRight, Plug, RefreshCw, Rocket, BarChart3, Check } from "lucide-react";
import { INTEGRATION_STEPS, CAPABILITIES } from "@/lib/site";
import BrandImg from "./brand-img";
import Reveal from "./reveal";

const CAP_ICONS: Record<string, typeof Plug> = {
  "API-first": Plug,
  "CRM connected": RefreshCw,
  "Platform agnostic": Rocket,
  "Real-time behavioural data": BarChart3,
};

export default function IntegrationFlow() {
  return (
    <section className="integrations section-pad" id="integrations" aria-labelledby="integrations-heading">
      <div className="section-shell">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow eyebrow--light">Enterprise ready</p>
            <h2 id="integrations-heading" style={{ color: "var(--pfy-light-text)" }}>
              Built to work
              <br />
              <span className="grad-text grad-text--violet">with your stack.</span>
            </h2>
            <p>
              Promofy operates as an engagement layer across the infrastructure operators already use —
              no heavy builds, no rip-and-replace, no friction.
            </p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="integration-flow">
            {INTEGRATION_STEPS.map((step, i) => (
              <div className="flow-card" key={step.title}>
                <BrandImg src={step.icon} alt="" height={56} loading="lazy" />
                <span className="flow-step">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
                {i < INTEGRATION_STEPS.length - 1 && (
                  <span className="flow-arrow" aria-hidden="true">
                    <ArrowRight />
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={2}>
          <ul className="integration-chips" aria-label="Platform capabilities">
            {CAPABILITIES.map((cap) => {
              const Icon = CAP_ICONS[cap] ?? Check;
              return (
                <li className="cap-chip" key={cap}>
                  <Icon aria-hidden="true" />
                  {cap}
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={3}>
          <div className="integration-callout">
            <div>
              <h3>
                Launch in weeks.
                <span className="grad-text">Not months.</span>
              </h3>
              <p>
                Promofy is designed for low-touch, enterprise-ready integration. Most partners complete
                integration and go live within 2–3 weeks, depending on scope — and fully branded
                campaigns can go live in under 15 minutes with the no-code builder.
              </p>
            </div>
            <div className="callout-actions">
              <a href="#request-meeting" className="btn btn--soft">
                Book an Online Demo
              </a>
              <span className="callout-note">See the integration setup before Lisbon.</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
