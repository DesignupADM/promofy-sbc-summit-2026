import BrandImg from "./brand-img";

export default function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="summit-visual-link">
        <span className="summit-visual-node summit-visual-node--start">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 12h8M12 8v8" />
            <circle cx="12" cy="12" r="8" />
          </svg>
        </span>
        <span className="summit-visual-line"><i /></span>
        <span className="summit-visual-node summit-visual-node--end">S18</span>
      </div>

      <div className="summit-card">
        <BrandImg
          src="/assets/promofy/promofy-sbc-hero.webp"
          alt=""
          width={1536}
          height={1024}
          className="summit-card-art"
          loading="eager"
          fetchPriority="high"
        />
        <span className="summit-card-art-overlay" aria-hidden="true" />

        <div className="summit-card-top">
          <span>Promofy · SBC 2026</span>
          <strong><i /> Meeting slots open</strong>
        </div>

        <div className="summit-card-body">
          <div className="summit-card-date">
            <span>29 Sept</span>
            <i />
            <span>1 Oct 2026</span>
          </div>
          <p className="summit-card-place">Lisbon · Startup Hub S18</p>
          <h2>Map your next engagement move.</h2>

          <div className="summit-tags">
            <span>Strategy &amp; partnerships</span>
            <span>Product, AI &amp; integrations</span>
            <span>Commercial fit</span>
          </div>
        </div>

      </div>

    </div>
  );
}
