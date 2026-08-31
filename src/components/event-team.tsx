import { ArrowUpRight, CalendarDays } from "lucide-react";
import { EVENT, EVENT_TEAM } from "@/lib/site";
import Reveal from "./reveal";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

export default function EventTeam() {
  return (
    <section className="event-team section-pad" id="meet-us" aria-labelledby="event-team-heading">
      <div className="section-shell">
        <Reveal>
          <div className="event-team-intro">
            <div className="section-head">
              <p className="eyebrow eyebrow--light">The people behind the platform</p>
              <h2 id="event-team-heading">
                Meet the team.
                <br />
                <span className="grad-text grad-text--violet">Built for your growth agenda.</span>
              </h2>
            </div>
            <p className="event-team-lead">
              Meet Promofy&apos;s leadership and commercial team in Lisbon. Book directly with a team
              member, or send one meeting request and we&apos;ll connect you with the right person.
            </p>
          </div>
        </Reveal>

        <div className="event-team-grid">
          {EVENT_TEAM.map((member, index) => {
            const bookingIsExternal = member.bookingHref.startsWith("http");

            return (
              <Reveal key={member.id} delay={(index + 1) as 1 | 2 | 3}>
                <article className={`team-card team-card--${member.id}`}>
                  <div className="team-card-top" aria-hidden="true">
                    <span className="team-monogram">{member.initials}</span>
                    <span className="team-availability">
                      <i /> At S18
                    </span>
                  </div>

                  <div className="team-card-body">
                    <p className="team-role">{member.role}</p>
                    <h3>{member.name}</h3>
                    <p className="team-focus">{member.focus}</p>

                    <div className="team-actions">
                      <a
                        className="team-link"
                        href={member.linkedinHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                      >
                        <LinkedInIcon />
                        LinkedIn
                        <ArrowUpRight className="team-link-arrow" aria-hidden="true" />
                      </a>
                      <a
                        className="team-link team-link--booking"
                        href={member.bookingHref}
                        {...(bookingIsExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        aria-label={`${member.bookingLabel} with ${member.name} for ${EVENT.eventName}`}
                      >
                        <CalendarDays aria-hidden="true" />
                        {member.bookingLabel}
                        <ArrowUpRight className="team-link-arrow" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={3}>
          <div className="event-team-foot">
            <span>
              <i aria-hidden="true" /> {EVENT.shortDate} · {EVENT.stand}
            </span>
            <a href="#request-meeting">
              Not sure who to meet? Request a meeting
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
