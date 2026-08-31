import BrandImg from "./brand-img";

const FOOTER_COLS = [
  {
    title: "Product",
    links: [
      { label: "Gamification Suite", href: "https://promofy.ai/gamification-suite/" },
      { label: "Sport F2P Suite", href: "https://promofy.ai/free-to-play/" },
      { label: "Engagement Hub", href: "https://promofy.ai/engagement-hub/" },
      { label: "Jackpot", href: "https://promofy.ai/jackpot/" },
      { label: "Spark", href: "https://promofy.ai/spark/" },
      { label: "AI Suite", href: "https://promofy.ai/ai-suite/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Promofy", href: "https://promofy.ai/about-promofy/" },
      { label: "Blog", href: "https://promofy.ai/blog/" },
      { label: "Partners Club", href: "https://club.promofy.ai" },
      { label: "Request a meeting", href: "#request-meeting" },
    ],
  },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/promofyai/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/promofyinc",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-8.25h2.77l.41-3.22H13.5V7.47c0-.93.26-1.57 1.6-1.57h1.7V3.05c-.3-.04-1.3-.13-2.48-.13-2.45 0-4.13 1.5-4.13 4.24v2.37H7.42v3.22h2.77V21h3.31z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/promofy.ai",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@Promofy_ai",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.42-4.81zM10 15.2V8.8L15.5 12 10 15.2z" />
      </svg>
    ),
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <BrandImg
              src="/assets/promofy/promofy-logo.svg"
              alt="Promofy"
              width={117}
              height={34}
              loading="eager"
              decoding="async"
              fallbackText="Promofy"
            />
            <p>
              The AI-driven gamification &amp; loyalty suite for iGaming and sport. Turn player activity
              into revenue engines.
            </p>
            <div className="footer-social">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Promofy on ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <nav className="footer-col" key={col.title} aria-label={`${col.title} links`}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© 2026 Promofy. All rights reserved.</p>
          <div className="footer-legal">
            <a href="https://promofy.ai/terms-and-conditions/" target="_blank" rel="noopener noreferrer">
              Terms
            </a>
            <a href="https://promofy.ai/privacy-policy/" target="_blank" rel="noopener noreferrer">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
