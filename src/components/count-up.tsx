"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

export default function CountUp({ value, prefix = "", suffix = "", duration = 1400, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(prefix + "0" + suffix);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = () => {
      if (started.current) return;
      started.current = true;
      if (reduced) {
        setDisplay(prefix + String(value) + suffix);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(prefix + String(Math.round(value * eased)) + suffix);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const cleanup: (() => void)[] = [];
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              run();
              observer.disconnect();
              cleanup.forEach((fn) => fn());
            }
          });
        },
        { threshold: 0.15 },
      );
      observer.observe(el);
      cleanup.push(() => observer.disconnect());
    } else {
      run();
    }

    // Fallback for very fast scrolls where IntersectionObserver can miss
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 1.2 && r.bottom > 0;
    };
    const onScroll = () => {
      if (inView()) run();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    if (inView()) run();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cleanup.forEach((fn) => fn());
    };
  }, [value, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className} aria-label={prefix + String(value) + suffix}>
      {display}
    </span>
  );
}
