"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CalendarDays, Check, ChevronLeft, MapPin, Ticket } from "lucide-react";
import {
  BOOKING_FALLBACK_ID,
  BOOKING_HOSTS,
  EVENT,
  MEETING_FORM_ENDPOINT,
  bookingHostById,
  meetingBookingUrl,
} from "@/lib/site";
import Reveal from "./reveal";
import { submitMeeting } from "@/lib/submit-meeting.mjs";

const meetingConfig = {
  portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ?? "",
  formId: process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID ?? "",
  endpoint: MEETING_FORM_ENDPOINT,
};

type Step = "host" | "details" | "handoff";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  email: "",
};

const routerHost = bookingHostById(BOOKING_FALLBACK_ID);

const HOST_OPTIONS = [
  ...BOOKING_HOSTS.map((member) => ({
    optionId: member.id,
    host: member,
    label: member.name,
    role: member.role,
    focus: member.focus,
  })),
  {
    optionId: "router",
    host: routerHost,
    label: "Not sure who to meet?",
    role: `We'll start you with ${routerHost.name}, ${routerHost.role}`,
    focus: "She routes every first conversation to the right person and the right demo.",
  },
];

export default function BookingSection() {
  const [step, setStep] = useState<Step>("host");
  const [hostId, setHostId] = useState("");
  const [hostError, setHostError] = useState("");
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [handoffUrl, setHandoffUrl] = useState("");

  const selectedOption = HOST_OPTIONS.find((option) => option.optionId === hostId);
  const host = selectedOption?.host ?? routerHost;
  const hostFirstName = host.name.split(" ")[0];

  const set = (key: keyof FormState) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const focusField = (id: string) => {
    requestAnimationFrame(() => document.getElementById(id)?.focus());
  };

  const goToDetails = () => {
    if (!selectedOption) {
      setHostError("Please choose who you'd like to meet.");
      focusField(`host-${HOST_OPTIONS[0].optionId}`);
      return;
    }
    setHostError("");
    setStep("details");
    focusField(values.firstName ? "email" : "firstName");
  };

  const backToHosts = () => {
    setStep("host");
    focusField(hostId ? `host-${hostId}` : "booking-step-host");
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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const firstInvalid = validate();
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    const bookingUrl = meetingBookingUrl(host.bookingHref, values);

    window.open(bookingUrl, "_blank", "noopener,noreferrer");

    setHandoffUrl(bookingUrl);
    setStep("handoff");

    // Lead capture runs alongside the scheduler handoff: the visitor always keeps
    // moving to HubSpot, even when the CRM submission is unconfigured or fails.
    void submitMeeting(
      {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        preferredHost: host.name,
      },
      meetingConfig,
    ).catch(() => undefined);
  };

  const restart = () => {
    setValues(EMPTY);
    setErrors({});
    setHandoffUrl("");
    setStep("host");
    focusField(hostId ? `host-${hostId}` : "booking-step-host");
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
                Pick who you want to meet, add your name and email, and you&apos;ll land straight on
                their HubSpot calendar with your details already filled in. Thirty seconds, one
                confirmed slot at S18 — or an online demo before the show.
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
              <ol className="booking-progress">
                <li className={step === "host" ? "is-current" : "is-done"}>
                  <span aria-hidden="true">{step === "host" ? "1" : <Check />}</span>
                  Who to meet
                </li>
                <li className={step === "details" ? "is-current" : step === "handoff" ? "is-done" : ""}>
                  <span aria-hidden="true">{step === "handoff" ? <Check /> : "2"}</span>
                  Your details
                </li>
              </ol>

              <div className="booking-panel" id="booking-step-host" tabIndex={-1} hidden={step !== "host"}>
                <h3>Who would you like to meet?</h3>
                <p className="form-intro">
                  Choose the conversation closest to your priority — you&apos;ll see their live
                  availability next.
                </p>

                <fieldset className="booking-hosts" aria-describedby={hostError ? "host-error" : undefined}>
                  <legend className="sr-only">Choose who you would like to meet</legend>
                  {HOST_OPTIONS.map((option) => (
                    <label key={option.optionId} className="booking-host">
                      <input
                        type="radio"
                        name="host"
                        id={`host-${option.optionId}`}
                        className="booking-host-input"
                        value={option.optionId}
                        data-booking-url={option.host.bookingHref}
                        data-host-first={option.host.name.split(" ")[0]}
                        data-host-name={option.host.name}
                        data-host-role={option.host.role}
                        data-host-initials={option.host.initials}
                        data-host-avatar={option.host.id}
                        checked={hostId === option.optionId}
                        onChange={() => {
                          setHostId(option.optionId);
                          setHostError("");
                        }}
                      />
                      <span className={`booking-avatar booking-avatar--${option.host.id}`} aria-hidden="true">
                        {option.host.initials}
                      </span>
                      <span className="booking-host-copy">
                        <strong>{option.label}</strong>
                        <small>{option.role}</small>
                        <em>{option.focus}</em>
                      </span>
                      <span className="booking-host-mark" aria-hidden="true">
                        <Check />
                      </span>
                    </label>
                  ))}
                </fieldset>

                {hostError && (
                  <span className="field-error" id="host-error" role="alert">
                    {hostError}
                  </span>
                )}

                <button type="button" className="btn btn--primary form-submit" onClick={goToDetails}>
                  Continue
                </button>

                <p className="form-micro">
                  No forms to fill in beyond your name and email — you pick the slot on the next
                  screen.
                </p>
              </div>

              <div className="booking-panel" id="booking-step-details" tabIndex={-1} hidden={step !== "details"}>
                <h3>Your details</h3>
                <p className="form-intro">
                  We&apos;ll carry these straight into the calendar so you only type them once.
                </p>

                <div className="booking-target">
                  <span
                    className={`booking-avatar booking-avatar--${host.id}`}
                    id="booking-target-avatar"
                    aria-hidden="true"
                  >
                    {host.initials}
                  </span>
                  <span className="booking-target-copy">
                    <small>Meeting with</small>
                    <strong id="booking-target-name">{host.name}</strong>
                    <em id="booking-target-role">{host.role}</em>
                  </span>
                  <button type="button" className="booking-target-change" onClick={backToHosts}>
                    Change
                  </button>
                </div>

                <form
                  className="booking-form"
                  data-meeting-config={JSON.stringify(meetingConfig)}
                  onSubmit={onSubmit}
                  noValidate
                >
                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="firstName">
                        First name <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        autoComplete="given-name"
                        placeholder="Alex"
                        required
                        {...fieldProps("firstName")}
                      />
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
                      <input
                        type="text"
                        autoComplete="family-name"
                        placeholder="Silva"
                        required
                        {...fieldProps("lastName")}
                      />
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

                  <button type="submit" className="btn btn--primary form-submit">
                    <span id="booking-submit-label">Open {hostFirstName}&apos;s calendar</span>
                    <ArrowUpRight aria-hidden="true" />
                  </button>

                  <button type="button" className="booking-back" onClick={backToHosts}>
                    <ChevronLeft aria-hidden="true" />
                    Back to the team
                  </button>
                </form>
              </div>

              <div className="booking-panel" id="booking-step-handoff" tabIndex={-1} hidden={step !== "handoff"}>
                <div className="booking-handoff">
                  <span className="booking-handoff-icon" aria-hidden="true">
                    <Check />
                  </span>
                  <h3>Pick your slot</h3>
                  <p role="status">
                    <span id="booking-handoff-name">{hostFirstName}</span>
                    &apos;s HubSpot calendar opens in a new tab with your name and email already filled
                    in. Choose the time that suits you and the meeting is confirmed instantly. If the
                    tab did not open, use the button below.
                  </p>

                  <a
                    className="btn btn--primary form-submit"
                    id="booking-handoff-link"
                    href={handoffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span id="booking-handoff-label">Open {hostFirstName}&apos;s calendar</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>

                  <button type="button" className="booking-back" onClick={restart}>
                    <ChevronLeft aria-hidden="true" />
                    Book with someone else
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
