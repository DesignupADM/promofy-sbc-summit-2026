"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, EVENT } from "@/lib/site";
import BrandImg from "./brand-img";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="header-inner">
        <a href="#top" className="brand" aria-label="Promofy — SBC Summit 2026, back to top">
          <BrandImg
            src="/assets/promofy/promofy-logo.svg"
            alt="Promofy"
            width={117}
            height={34}
            loading="eager"
            decoding="sync"
            fallbackText="Promofy"
          />
          <span className="brand-event">SBC&nbsp;Summit&nbsp;2026</span>
        </a>

        <nav className="desktop-nav-wrap" aria-label="Main navigation">
          <ul className="desktop-nav">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <a href="#request-meeting" className="btn btn--primary btn--sm header-meeting-cta" aria-label="Request a meeting">
            <span className="header-cta-label">Request a meeting</span>
            <span className="header-cta-label header-cta-label--short" aria-hidden="true">Meet us</span>
          </a>
          <button
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        className={`mobile-nav${menuOpen ? " open" : ""}`}
        aria-label="Mobile navigation"
        hidden={!menuOpen}
      >
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
        <a href="#request-meeting" className="btn btn--primary btn--sm" onClick={() => setMenuOpen(false)}>
          Request a meeting — {EVENT.shortDate}
        </a>
      </nav>
    </header>
  );
}
