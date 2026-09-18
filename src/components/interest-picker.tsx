"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { EVENT_TEAM } from "@/lib/site";
import BookingLink from "./booking-link";

const priorities = ["Acquisition", "Casino Gamification", "Sports F2P", "Retention", "Jackpots", "AI", "Platform Integration", "Partnership"];
const businesses = ["Operator", "Platform", "Game Studio", "Sports / Media", "CRM / Technology", "Investor / Partner"];

export default function InterestPicker() {
  const [interest, setInterest] = useState("");
  const [role, setRole] = useState("");
  const [show, setShow] = useState(false);
  const host = EVENT_TEAM[
    interest === "Partnership" || role === "Investor / Partner" ? 0
      : interest === "AI" || interest === "Platform Integration" ? 1 : 2
  ];

  return (
    <section className="s-interest" id="request-meeting" aria-labelledby="meeting-heading">
      <div className="s-shell s-planner-layout">
        <div className="s-planner-intro">
          <p className="s-eyebrow">LET’S TALK GROWTH</p>
          <h2 id="meeting-heading">Your priority.<br />The right person.</h2>
          <p>Tell us a little about your business. We’ll help you find the right conversation in Lisbon.</p>
        </div>
        <div>
          <fieldset>
            <legend><span>01</span> What do you want to turn ON?</legend>
            <div className="s-chips">
              {priorities.map((priority) => (
                <button key={priority} type="button" aria-pressed={interest === priority}
                  onClick={() => { setInterest(priority); setShow(false); }}>
                  {priority}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend><span>02</span> What describes your business?</legend>
            <div className="s-chips">
              {businesses.map((business) => (
                <button key={business} type="button" aria-pressed={role === business}
                  onClick={() => { setRole(business); setShow(false); }}>
                  {business}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="s-picker-row">
            <p>Choose a time that works for you in the next step.</p>
            <button type="button" className="s-button" aria-expanded={show}
              aria-controls="meeting-recommendation" onClick={() => setShow(true)}>
              Find My Meeting <ArrowRight size={17} />
            </button>
          </div>
          <div id="meeting-recommendation" aria-live="polite">
            {show && (
              <div className="s-recommendation">
                <div><strong>Meet {host.name.split(" ")[0]}</strong><p>{host.focus}</p></div>
                <BookingLink href={host.bookingHref}
                  placement={`planner_${host.id}_${interest.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_") || "general"}`}
                  className="s-button">
                  Open Meeting Calendar <ArrowRight size={17} />
                </BookingLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
