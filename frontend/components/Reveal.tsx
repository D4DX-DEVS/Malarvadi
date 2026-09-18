"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight scroll reveal (no dependencies). Animates content in once when
 * it enters the viewport. Honors prefers-reduced-motion (shows instantly)
 * and no-JS (noscript fallback keeps content visible).
 */
export function Reveal({
  children,
  className = "",
  delay = "0s",
  variant = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
  /** Direction/style of the reveal animation. */
  variant?: "up" | "left" | "right" | "pop" | "tilt" | "bounce";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -14% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant}${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: delay }}
    >
      {children}
      <noscript>
        <style>{".reveal{opacity:1 !important;transform:none !important}"}</style>
      </noscript>
    </div>
  );
}
