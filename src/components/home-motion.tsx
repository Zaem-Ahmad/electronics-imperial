"use client";
import { useEffect, useRef, useState } from "react";

export function HomeMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const root = ref.current;
    if (!root || !window.IntersectionObserver) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = root.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08 },
    );
    const configure = () => {
      observer.disconnect();
      if (media.matches) delete root.dataset.motion;
      else {
        root.dataset.motion = "ready";
        elements.forEach((element) => observer.observe(element));
      }
    };
    configure();
    media.addEventListener("change", configure);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", configure);
    };
  }, []);
  return (
    <div className="home-experience" data-paused={paused} ref={ref}>
      {children}
      <button
        className="motion-toggle"
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? "Resume animations" : "Pause animations"}
        <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
      </button>
    </div>
  );
}
