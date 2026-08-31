import { ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { EVENT, EVENT_TEAM } from "@/lib/site";
import Reveal from "./reveal";

export default function MeetingPlanner() {
  return (
    <section className="meeting-planner-section" id="booking-experience" aria-labelledby="planner-heading">
      <div className="section-shell">
        <Reveal>
          <div className="meeting-planner-shell">
            <div className="meeting-planner-intro">
              <p className="meeting-planner-eyebrow">Book your SBC meeting</p>
              <h2 id="planner-heading">Choose the right conversation.</h2>
              <p>
                Select the person closest to your priority, or send one request and let us route it.
              </p>

              <div className="meeting-planner-meta">
                <span><CalendarDays aria-hidden="true" /> {EVENT.shortDate}</span>
                <span><Clock3 aria-hidden="true" /> 30 minutes</span>
                <span><MapPin aria-hidden="true" /> {EVENT.stand}</span>
              </div>
            </div>

            <div className="meeting-planner-options">
              {EVENT_TEAM.map((member) => {
                const external = member.bookingHref.startsWith("http");
                return (
                  <a
                    key={member.id}
                    href={member.bookingHref}
                    className="meeting-planner-option"
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span className={`planner-avatar planner-avatar--${member.id}`}>{member.initials}</span>
                    <span className="planner-person">
                      <strong>{member.name}</strong>
                      <small>{member.role}</small>
                    </span>
                    <span className="planner-focus">{member.focus}</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                );
              })}
              <a href="#request-meeting" className="meeting-planner-fallback">
                Not sure who to meet? Send one request <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
