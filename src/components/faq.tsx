"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/site";
import Reveal from "./reveal";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="faq section-pad" aria-labelledby="faq-heading">
      <div className="section-shell">
        <div className="faq-grid">
          <Reveal>
            <div className="faq-title">
              <p className="eyebrow eyebrow--light">Good to know</p>
              <h2 id="faq-heading" style={{ color: "var(--pfy-light-text)" }}>
                Questions, <span className="grad-text grad-text--violet">answered.</span>
              </h2>
              <p>
                Everything you need before Lisbon — and if anything is missing, the quickest answer is a
                conversation.
              </p>
              <a
                className="product-link"
                href="https://promofy.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                More about Promofy
                <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="faq-list">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openIndex === index;
                const panelId = `faq-panel-${index}`;
                const triggerId = `faq-trigger-${index}`;

                return (
                <div className={`faq-item${isOpen ? " is-open" : ""}`} key={item.q}>
                  <button
                    type="button"
                    className="faq-trigger"
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    {item.q}
                    <span className="faq-plus" aria-hidden="true">
                      +
                    </span>
                  </button>
                  <div
                    className="faq-answer"
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    hidden={!isOpen}
                  >
                    <p>{item.a}</p>
                  </div>
                </div>
              )})}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
