"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, Check, Download, MapPin, Trophy, Users, Zap } from "lucide-react";
import BrandImg from "./brand-img";
import { EVENT, SHOWCASE, RSVP_FAQ_ITEMS, RSVP_FORM_ENDPOINT } from "@/lib/site";
import { submitRsvp } from "@/lib/submit-rsvp.mjs";
import "./summit.css";
import "./rsvp.css";

const assets = "/assets/promofy/";

const rsvpConfig = {
  portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ?? "",
  formId: process.env.NEXT_PUBLIC_HUBSPOT_RSVP_FORM_ID ?? "",
  endpoint: RSVP_FORM_ENDPOINT,
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { firstName: "", lastName: "", email: "", company: "", jobTitle: "" };

const CALENDAR_TEXT = "Promofy Showcase at SBC Summit 2026";
const CALENDAR_LOCATION = `${EVENT.venue} (FIL) — Main Stage`;
const CALENDAR_DETAILS =
  "Promofy brings something interesting to SBC — the Promofy Showcase on the Main Stage. Live demos of Spark, Gamification, Sports F2P, AI and Jackpots.";

function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: CALENDAR_TEXT,
    dates: "20261001T130000/20261001T130000",
    ctz: "Europe/Lisbon",
    details: CALENDAR_DETAILS,
    location: CALENDAR_LOCATION,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function icsPayload() {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Promofy//SBC Summit 2026//EN",
    "BEGIN:VEVENT",
    "UID:promofy-showcase-sbc-2026@promofy.ai",
    "DTSTAMP:20261001T000000Z",
    "DTSTART;TZID=Europe/Lisbon:20261001T130000",
    "DTEND;TZID=Europe/Lisbon:20261001T130000",
    `SUMMARY:${CALENDAR_TEXT}`,
    `LOCATION:${CALENDAR_LOCATION}`,
    `DESCRIPTION:${CALENDAR_DETAILS}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcs() {
  const blob = new Blob([icsPayload()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "promofy-sbc-summit-2026.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

const expectItems = [
  { Icon: Zap, title: "The Main Stage moment", copy: "1 October, 13:00 — Promofy brings something interesting to SBC. Follow the player journey from first tap to lasting loyalty." },
  { Icon: Users, title: "Meet the team", copy: "Irakli, Vakhtang and Negin will be at the Startup Hub, S18, across all three days." },
  { Icon: Trophy, title: "Live demos", copy: "See Spark, Gamification, Sports F2P, AI and Jackpots running live — bring your hardest use case." },
  { Icon: CalendarDays, title: "1-to-1 meetings", copy: "Want a private conversation? Book a slot with the team before the show." },
];

function RsvpForm({ onDone }: { onDone: (firstName: string) => void }) {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  const set = (key: keyof FormState) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = (): keyof FormState | null => {
    const next: FieldErrors = {};
    if (!values.firstName.trim()) next.firstName = "Please enter your first name.";
    if (!values.lastName.trim()) next.lastName = "Please enter your last name.";
    if (!values.email.trim()) next.email = "Please enter your work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "Please enter a valid email address.";
    setErrors(next);
    return (Object.keys(next)[0] as keyof FormState | undefined) ?? null;
  };

  const focusField = (id: string) => {
    requestAnimationFrame(() => document.getElementById(`rsvp-${id}`)?.focus());
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const firstInvalid = validate();
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }
    setSubmitting(true);
    setFailed(false);
    try {
      await submitRsvp(
        {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          jobTitle: values.jobTitle.trim(),
          days: SHOWCASE.label,
          website,
        },
        rsvpConfig,
      );
      onDone(values.firstName.trim());
    } catch {
      setFailed(true);
      setSubmitting(false);
    }
  };

  const fieldProps = (key: keyof FormState) => ({
    value: values[key],
    onChange: set(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `rsvp-${key}-error` : undefined,
    id: `rsvp-${key}`,
  });

  return (
    <form className="s-rsvp-form" onSubmit={onSubmit} noValidate>
      {/* Honeypot: invisible to real visitors; bots that fill it are dropped server-side. */}
      <div className="s-rsvp-hp" aria-hidden="true">
        <label htmlFor="rsvp-website">Website</label>
        <input
          type="text"
          id="rsvp-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className="s-rsvp-row">
        <div className="s-rsvp-field">
          <label htmlFor="rsvp-firstName">First name <span aria-hidden="true">*</span></label>
          <input type="text" autoComplete="given-name" placeholder="Alex" required {...fieldProps("firstName")} />
          {errors.firstName && <span className="s-rsvp-field-error" id="rsvp-firstName-error" role="alert">{errors.firstName}</span>}
        </div>
        <div className="s-rsvp-field">
          <label htmlFor="rsvp-lastName">Last name <span aria-hidden="true">*</span></label>
          <input type="text" autoComplete="family-name" placeholder="Silva" required {...fieldProps("lastName")} />
          {errors.lastName && <span className="s-rsvp-field-error" id="rsvp-lastName-error" role="alert">{errors.lastName}</span>}
        </div>
      </div>
      <div className="s-rsvp-field">
        <label htmlFor="rsvp-email">Work email <span aria-hidden="true">*</span></label>
        <input type="email" autoComplete="email" placeholder="alex@youroperator.com" required {...fieldProps("email")} />
        {errors.email && <span className="s-rsvp-field-error" id="rsvp-email-error" role="alert">{errors.email}</span>}
      </div>
      <div className="s-rsvp-row">
        <div className="s-rsvp-field">
          <label htmlFor="rsvp-company">Company</label>
          <input type="text" autoComplete="organization" placeholder="Your company" {...fieldProps("company")} />
        </div>
        <div className="s-rsvp-field">
          <label htmlFor="rsvp-jobTitle">Job title</label>
          <input type="text" autoComplete="organization-title" placeholder="Head of CRM" {...fieldProps("jobTitle")} />
        </div>
      </div>
      <div className="s-rsvp-date">
        <CalendarDays size={28} aria-hidden="true" />
        <div>
          <strong>1 October 2026</strong>
          <span>{SHOWCASE.time} · {SHOWCASE.stage}</span>
        </div>
      </div>
      {failed && (
        <p className="s-rsvp-error" role="alert">
          Something went wrong and your RSVP was not sent. Please try again — your details are still here.
        </p>
      )}
      <button type="submit" className="s-button s-rsvp-submit" disabled={submitting}>
        {submitting ? "Confirming…" : "Confirm My RSVP"} {!submitting && <ArrowRight size={17} />}
      </button>
      <p className="s-rsvp-micro">
        One confirmation email, one reminder before the show — nothing else.
      </p>
    </form>
  );
}

function RsvpSuccess({ firstName, onEdit }: { firstName: string; onEdit: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div className="s-rsvp-success" ref={ref} tabIndex={-1} role="status" aria-live="polite">
      <span className="s-rsvp-success-icon" aria-hidden="true"><Check /></span>
      <h3>You&apos;re on the list{firstName ? `, ${firstName}` : ""}.</h3>
      <p>
        Thanks for your RSVP. We&apos;ll send a confirmation and a reminder before the showcase.
        Add it to your calendar so you don&apos;t miss the Main Stage moment.
      </p>
      <div className="s-rsvp-success-actions">
        <a className="s-button" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">
          <CalendarDays size={17} /> Add to Google Calendar
        </a>
        <button type="button" className="s-button s-outline" onClick={downloadIcs}>
          <Download size={17} /> Download .ics
        </button>
      </div>
      <div className="s-rsvp-success-note">
        <MapPin size={16} aria-hidden="true" />
        <span><strong>{SHOWCASE.name} · {SHOWCASE.stage}</strong> — {SHOWCASE.date}, {SHOWCASE.time}.<br />
        Team at the Startup Hub, S18. Don&apos;t forget to arrange your SBC Summit 2026 pass for venue entry.</span>
      </div>
      <div className="s-rsvp-success-links">
        <a className="s-text-link" href="/sbc-summit-2026/#request-meeting">
          Book a 1-to-1 meeting <ArrowRight size={17} />
        </a>
        <button type="button" className="s-rsvp-edit" onClick={onEdit}>Edit my RSVP</button>
      </div>
    </div>
  );
}

export function RsvpPage() {
  const [done, setDone] = useState(false);
  const [firstName, setFirstName] = useState("");

  const handleDone = (name: string) => {
    setFirstName(name);
    setDone(true);
  };

  return (
    <div className="summit-page rsvp-page">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="s-header">
        <div className="s-shell">
          <a href="/sbc-summit-2026/" aria-label="Promofy — SBC Summit 2026 event page">
            <BrandImg src={assets + "promofy-logo.svg"} alt="Promofy" width={142} height={40} loading="eager" />
          </a>
          <nav aria-label="Main navigation">
            <a href="/sbc-summit-2026/#showcase">Showcase <ArrowRight size={13} /></a>
            <a href="/sbc-summit-2026/">Event Page</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a className="s-button" href="/sbc-summit-2026/#request-meeting">Book a Meeting<ArrowRight size={17} /></a>
        </div>
      </header>
      <main id="main">
        <section className="s-hero s-rsvp-hero" id="top">
          <BrandImg
            className="rsvp-cityscape"
            src={assets + "SBC Lisbon Campaign (5).png"}
            alt="Lisbon waterfront at sunset, with the suspension bridge and a glowing yellow tram."
            width={1200}
            height={480}
            loading="eager"
            fetchPriority="high"
          />
          <div className="s-shell s-rsvp-hero-grid">
            <div className="s-rsvp-copy">
              <p className="s-eyebrow">PROMOFY SHOWCASE · SBC SUMMIT 2026 · MAIN STAGE</p>
              <h1>See you<br />in <em>Lisbon.</em></h1>
              <h2>Promofy is bringing something interesting to SBC.</h2>
              <p>
                The Promofy Showcase takes the Main Stage on 1 October at 13:00 — a live run
                through Spark, Gamification, Sports F2P, AI and Jackpots. RSVP for your seat,
                and meet the team at the Startup Hub, stand S18.
              </p>
              <div className="s-location">
                <span><MapPin size={17} /> Startup Hub · S18</span>
              </div>
              <div className="s-rsvp-hero-date">
                <CalendarDays size={24} aria-hidden="true" />
                <span>1 October · <em>13:00</em> · Main Stage</span>
              </div>
            </div>
            <div className="s-rsvp-card" id="rsvp" aria-label="RSVP form">
              {done ? (
                <RsvpSuccess firstName={firstName} onEdit={() => setDone(false)} />
              ) : (
                <>
                  <div className="s-rsvp-card-head">
                    <p className="rsvp-card-kicker">PROMOFY SHOWCASE · MAIN STAGE</p>
                    <h3>You&apos;re invited.</h3>
                    <p>Save your seat for the Main Stage moment.</p>
                  </div>
                  <RsvpForm onDone={handleDone} />
                  <p className="rsvp-pass-note">An SBC Summit pass is required for venue entry.</p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="s-light s-rsvp-expect" id="expect">
          <div className="s-shell">
            <div className="s-section-heading">
              <div>
                <p className="s-eyebrow">WHAT TO EXPECT AT SBC</p>
                <h2>One stage. One moment.<br />Everything Promofy.</h2>
              </div>
              <p>Join the Promofy Showcase on the Main Stage — 1 October at 13:00 — and stop by S18 across all three days for demos and conversations.</p>
            </div>
            <div className="s-rsvp-expect-grid">
              {expectItems.map(({ Icon, title, copy }) => (
                <article key={title}>
                  <Icon aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="s-rsvp-faq" id="faq">
          <div className="s-shell s-rsvp-faq-grid">
            <div>
              <p className="s-eyebrow">GOOD TO KNOW</p>
              <h2>Questions,<br />answered.</h2>
              <p>Everything you need before Lisbon. Anything missing? The quickest answer is a conversation — book a meeting and ask us directly.</p>
              <a className="s-button s-outline" href="/sbc-summit-2026/#request-meeting">Book a Meeting <ArrowRight size={17} /></a>
            </div>
            <div className="s-rsvp-faq-list">
              {RSVP_FAQ_ITEMS.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}<span aria-hidden="true">+</span></summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="s-footer">
        <div className="s-shell">
          <BrandImg src={assets + "promofy-logo.svg"} alt="Promofy" width={116} />
          <span>Turn player moments into more.</span>
          <nav aria-label="Footer">
            <a href="https://promofy.ai/">Platform</a>
            <a href="/sbc-summit-2026/#meet-us">Team</a>
            <a href="/sbc-summit-2026/#request-meeting">Contact</a>
            <a href="https://www.linkedin.com/company/promofyai/" aria-label="Promofy on LinkedIn"><span className="s-linkedin" aria-hidden="true">in</span></a>
          </nav>
          <small>© 2026 Promofy</small>
        </div>
      </footer>
    </div>
  );
}
