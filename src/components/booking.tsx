"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays, MapPin, Ticket, ChevronDown } from "lucide-react";
import {
  AREAS_OF_INTEREST,
  PREFERRED_DAYS,
  PREFERRED_TIMES,
  MEETING_FORM_ENDPOINT,
  EVENT,
  EVENT_TEAM,
} from "@/lib/site";
import Reveal from "./reveal";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  interest: string;
  preferredHost: string;
  day: string;
  time: string;
  message: string;
};

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  jobTitle: "",
  interest: "",
  preferredHost: "",
  day: "",
  time: "",
  message: "",
};

export default function BookingSection() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const set = (key: keyof FormState) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = (): keyof FormState | null => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!values.firstName.trim()) next.firstName = "Please enter your first name.";
    if (!values.lastName.trim()) next.lastName = "Please enter your last name.";
    if (!values.email.trim()) next.email = "Please enter your work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!values.interest) next.interest = "Please choose your area of interest.";
    if (!values.day) next.day = "Please choose a preferred day.";
    setErrors(next);
    return (Object.keys(next)[0] as keyof FormState | undefined) ?? null;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const firstInvalid = validate();
    if (firstInvalid) {
      setStatus("idle");
      requestAnimationFrame(() => document.getElementById(firstInvalid)?.focus());
      return;
    }
    setStatus("sending");
    try {
      if (MEETING_FORM_ENDPOINT) {
        const res = await fetch(MEETING_FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, source: "sbc-summit-2026-landing" }),
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      setStatus("success");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const fieldProps = (key: keyof FormState) => ({
    value: values[key],
    onChange: set(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
    id: key,
  });

  return (
    <section className="booking section-pad" id="request-meeting" aria-labelledby="booking-heading">
      <div className="section-shell">
        <div className="booking-grid">
          <Reveal>
            <div className="booking-copy">
              <p className="eyebrow">Meet Promofy</p>
              <h2 id="booking-heading">
                Let&apos;s meet <span className="grad-text">in Lisbon.</span>
              </h2>
              <p>
                Tell us a little about what you&apos;re building — and pick a slot at S18, or an online
                demo before the show. The Promofy team will confirm by email.
              </p>

              <div className="event-card">
                <div className="event-row">
                  <span className="er-icon">
                    <Ticket aria-hidden="true" />
                  </span>
                  <span>
                    <b>Event</b>
                    {EVENT.eventName}
                  </span>
                </div>
                <div className="event-row">
                  <span className="er-icon">
                    <CalendarDays aria-hidden="true" />
                  </span>
                  <span>
                    <b>Dates</b>
                    {EVENT.dateRange}
                  </span>
                </div>
                <div className="event-row">
                  <span className="er-icon">
                    <MapPin aria-hidden="true" />
                  </span>
                  <span>
                    <b>Where</b>
                    {EVENT.venue}, {EVENT.city}
                  </span>
                </div>
                <div className="event-row">
                  <span className="er-icon">
                    <Ticket aria-hidden="true" />
                  </span>
                  <span>
                    <b>Stand</b>
                    {EVENT.stand}
                  </span>
                </div>
              </div>

              <ul className="booking-points">
                <li>Experience the engagement ecosystem live at S18.</li>
                <li>Review the product and integration setup that fits your stack.</li>
                <li>Take the commercial or technical conversation as deep as it needs to go.</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="form-card">
              <h3>Request a meeting at SBC</h3>
              <p className="form-intro">
                Thirty seconds now saves your Lisbon week. Fields marked with{" "}
                <span style={{ color: "var(--pfy-coral)" }}>*</span> are required.
              </p>

              {status === "success" ? (
                <div className="form-status" role="status">
                  <p className="ok">
                    Thanks — your SBC meeting request is in. The Promofy team will confirm your slot by
                    email shortly.
                  </p>
                </div>
              ) : (
                <form className="booking-form" onSubmit={onSubmit} noValidate>
                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="firstName">
                        First name <span className="req">*</span>
                      </label>
                      <input type="text" autoComplete="given-name" placeholder="Alex" required {...fieldProps("firstName")} />
                      {errors.firstName && (
                        <span className="field-error" id="firstName-error" role="alert">
                          {errors.firstName}
                        </span>
                      )}
                    </div>
                    <div className="field">
                      <label htmlFor="lastName">
                        Last name <span className="req">*</span>
                      </label>
                      <input type="text" autoComplete="family-name" placeholder="Silva" required {...fieldProps("lastName")} />
                      {errors.lastName && (
                        <span className="field-error" id="lastName-error" role="alert">
                          {errors.lastName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="email">
                      Work email <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="alex@youroperator.com"
                      required
                      {...fieldProps("email")}
                    />
                    {errors.email && (
                      <span className="field-error" id="email-error" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="company">Company</label>
                      <input type="text" autoComplete="organization" placeholder="Your operator" {...fieldProps("company")} />
                    </div>
                    <div className="field">
                      <label htmlFor="jobTitle">Job title</label>
                      <input type="text" autoComplete="organization-title" placeholder="Head of CRM" {...fieldProps("jobTitle")} />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="interest">
                      Area of interest <span className="req">*</span>
                    </label>
                    <div className="select-wrap">
                      <select required {...fieldProps("interest")}>
                        <option value="">Choose what to talk about…</option>
                        {AREAS_OF_INTEREST.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden="true" />
                    </div>
                    {errors.interest && (
                      <span className="field-error" id="interest-error" role="alert">
                        {errors.interest}
                      </span>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="preferredHost">Who would you like to meet?</label>
                    <div className="select-wrap">
                      <select {...fieldProps("preferredHost")}>
                        <option value="">Let Promofy choose the best person…</option>
                        {EVENT_TEAM.map((member) => (
                          <option key={member.id} value={member.name}>
                            {member.name} — {member.role}
                          </option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden="true" />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="day">
                        Preferred day <span className="req">*</span>
                      </label>
                      <div className="select-wrap">
                        <select required {...fieldProps("day")}>
                          <option value="">Choose a day…</option>
                          {PREFERRED_DAYS.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                        <ChevronDown aria-hidden="true" />
                      </div>
                      {errors.day && (
                        <span className="field-error" id="day-error" role="alert">
                          {errors.day}
                        </span>
                      )}
                    </div>
                    <div className="field">
                      <label htmlFor="time">Preferred time</label>
                      <div className="select-wrap">
                        <select {...fieldProps("time")}>
                          <option value="">Choose a time…</option>
                          {PREFERRED_TIMES.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <ChevronDown aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      placeholder="Anything specific you'd like to cover? (optional)"
                      rows={4}
                      {...fieldProps("message")}
                    />
                  </div>

                  <button type="submit" className="btn btn--primary form-submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send meeting request"}
                  </button>

                  <div className="form-status" aria-live="polite">
                    {status === "error" && (
                      <span className="err">
                        Your request was not sent. Try again, or use a team member&apos;s direct booking
                        link above.
                      </span>
                    )}
                  </div>
                  <p className="form-micro">
                    Submitting shares your details with the Promofy team so we can confirm your meeting.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
