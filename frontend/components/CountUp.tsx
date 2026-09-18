"use client";

import { useEffect, useRef } from "react";

/**
 * Counts a number up when it scrolls into view - the "Together We Grow" facts
 * literally growing as you reach them.
 *
 * It only animates figures where counting reads naturally: a total like
 * "50,000+" or a small count like "8". Milestone years ("1980", "2003") are
 * printed as-is, because watching a year tick up from zero reads as a glitch
 * rather than growth, and anything without digits ("Units") is printed too.
 *
 * The tween writes straight to the DOM node rather than through state. Four of
 * these run at once, and a setState per animation frame meant four React
 * re-renders every frame - enough to show up as long tasks on a throttled
 * phone. Mutating one text node costs nothing by comparison.
 *
 * Reduced-motion visitors, and anyone without IntersectionObserver, simply see
 * the final value.
 */
function parse(value: string): { prefix: string; target: number; suffix: string } | null {
  const m = value.match(/^(\D*)([\d,]+)(.*)$/);
  if (!m) return null;
  const digits = m[2].replace(/,/g, "");
  const target = Number(digits);
  if (!Number.isFinite(target)) return null;

  const decorated = m[2].includes(",") || m[3].trim().length > 0 || m[1].trim().length > 0;
  if (!decorated && digits.length === 4) return null; // a year, not a total
  if (!decorated && target > 999) return null;

  return { prefix: m[1], target, suffix: m[3] };
}

const DURATION = 1100;

export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parsed = parse(value);
    const settle = () => {
      el.textContent = value;
    };
    if (!parsed) return settle();
    if (!("IntersectionObserver" in window)) return settle();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return settle();

    el.textContent = `${parsed.prefix}0${parsed.suffix}`;

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          // Ease-out: sprints, then settles, like a sprout slowing as it opens.
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = `${parsed.prefix}${Math.round(parsed.target * eased).toLocaleString()}${parsed.suffix}`;
          if (t < 1) raf = requestAnimationFrame(tick);
          else settle();
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span className={className}>
      {/* Server-rendered with the real figure, so it is correct before (and
          without) JavaScript; the effect then rewinds it and counts up. */}
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
