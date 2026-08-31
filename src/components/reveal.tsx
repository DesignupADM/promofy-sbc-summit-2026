"use client";

import { useEffect, type ReactNode, type CSSProperties } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: 1 | 2 | 3;
  as?: "div" | "li" | "span" | "section" | "article";
  style?: CSSProperties;
};

let booted = false;

function bootRevealSystem() {
  if (booted || typeof window === "undefined") return;
  booted = true;

  document.documentElement.classList.add("js");

  const els = () => Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
  const reveal = (el: HTMLElement, observer?: IntersectionObserver) => {
    if (!el.classList.contains("is-in")) el.classList.add("is-in");
    observer?.unobserve(el);
  };

  if (!("IntersectionObserver" in window)) {
    els().forEach((el) => reveal(el));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement, observer);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
  );

  // Observe all current elements; the scroll fallback picks up any stragglers.
  els().forEach((el) => observer.observe(el));

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      let remaining = 0;
      els().forEach((el) => {
        if (el.classList.contains("is-in")) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.96 && r.bottom > 0) {
          reveal(el, observer);
        } else {
          remaining++;
        }
      });
      if (remaining === 0) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        observer.disconnect();
      }
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

export default function Reveal({ children, className = "", delay, as: Tag = "div", style }: RevealProps) {
  useEffect(() => {
    bootRevealSystem();
  }, []);

  return (
    <Tag className={`reveal ${className}`.trim()} data-delay={delay} style={style}>
      {children}
    </Tag>
  );
}
