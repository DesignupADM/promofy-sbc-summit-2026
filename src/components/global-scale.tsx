import { Layers, Globe2, Languages, Coins, Zap, Braces } from "lucide-react";
import { GLOBAL_FEATURES } from "@/lib/site";
import Reveal from "./reveal";

const ICONS: Record<string, typeof Globe2> = {
  layers: Layers,
  globe: Globe2,
  languages: Languages,
  coins: Coins,
  zap: Zap,
  braces: Braces,
};

export default function GlobalScale() {
  return (
    <section className="global section-pad" aria-labelledby="global-heading">
      <div className="section-shell">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow eyebrow--light">Built for global operations</p>
            <h2 id="global-heading" style={{ color: "var(--pfy-light-text)" }}>
              Global <span className="grad-text grad-text--violet">by design.</span>
            </h2>
            <p>
              Built to scale across brands, regions and markets without adding unnecessary complexity —
              one engagement layer, everywhere you operate.
            </p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="global-grid">
            {GLOBAL_FEATURES.map((feature) => {
              const Icon = ICONS[feature.icon] ?? Globe2;
              return (
                <div className="global-card" key={feature.title}>
                  <span className="card-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={2}>
          <p className="global-note">
            <b>30+</b> languages supported, with AI-powered translation built in.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
