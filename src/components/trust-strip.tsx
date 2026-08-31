import { PARTNER_LOGOS, TRUST_PROOF } from "@/lib/site";
import BrandImg from "./brand-img";
import CountUp from "./count-up";
import Reveal from "./reveal";

function LogoSet() {
  return (
    <>
      {PARTNER_LOGOS.map((logo) => (
        <span
          key={logo.alt}
          className={`logo-chip${logo.tall ? " logo-chip--tall" : ""}${logo.square ? " logo-chip--square" : ""}`}
        >
          <BrandImg
            src={logo.src}
            alt={logo.alt}
            height={logo.tall || logo.square ? 38 : 28}
            fallbackText={logo.alt}
            loading="eager"
          />
        </span>
      ))}
    </>
  );
}

function LogoMarquee() {
  return (
    <div className="marquee" aria-label="Operators and partners">
      <div className="marquee-track">
        <LogoSet />
        <LogoSet />
      </div>
    </div>
  );
}

export default function TrustStrip() {
  return (
    <section className="trust" aria-label="Trusted by operators and partners worldwide">
      <div className="section-shell">
        <Reveal>
          <h2 className="trust-title">Trusted by operators &amp; partners worldwide</h2>
          <p className="trust-sub">The engagement layer behind acquisition, retention and loyalty.</p>
        </Reveal>
        <Reveal delay={1}>
          <LogoMarquee />
        </Reveal>
        <Reveal delay={2}>
          <div className="trust-proof">
            {TRUST_PROOF.map((item, i) => (
              <div className="proof-item" key={item.label}>
                <strong>
                  {i === 0 || i === 3 || i === 4 ? (
                    item.value
                  ) : (
                    <CountUp value={Number(item.value)} suffix={item.suffix ?? ""} />
                  )}
                </strong>
                <span>{item.label}</span>
                <small>{item.note}</small>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
