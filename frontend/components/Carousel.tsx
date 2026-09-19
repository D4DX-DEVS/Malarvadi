"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The horizontal strip the home page uses for its poster shelf, and for
 * anything else that arrives as a row of cards.
 *
 * It is a plain scroll-snap track with two round arrows over it rather than a
 * slide engine: the browser already does the scrolling, momentum and snapping,
 * which means the strip works with no JavaScript at all (you can still swipe
 * it), stays keyboard reachable, and costs one scroll listener instead of a
 * dependency.
 *
 * The arrows page by the visible width minus one card, so the card you were
 * looking at stays on screen as an anchor. By default each arrow hides itself
 * when the track is already at that end; with `persistent` it stays visible
 * and merely dims, which is how the reference draws the poster shelf.
 */
export function Carousel({
  children,
  label,
  prevLabel,
  nextLabel,
  /** Tailwind width classes applied to every item in the track. */
  itemClassName = "w-[15rem] sm:w-[17rem]",
  className = "",
  /** Extra classes on the scrolling track - padding, gap. */
  trackClassName = "gap-4 px-1 pb-2 pt-1",
  /** Arrow colour, so the strip can match the section it sits in. */
  tone = "bg-white text-berry",
  /** Where an item settles after a swipe. `center` gives the reference's
      one-big-poster-in-the-middle look. */
  snap = "start",
  /** Keep both arrows on screen at the ends of the track, dimmed. */
  persistent = false,
}: {
  children: React.ReactNode[];
  label: string;
  prevLabel: string;
  nextLabel: string;
  itemClassName?: string;
  className?: string;
  trackClassName?: string;
  tone?: string;
  snap?: "start" | "center";
  persistent?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    /* A pixel of slack: sub-pixel layout means scrollLeft rarely lands exactly
       on the maximum, and without it the right arrow never switches off. */
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  function page(direction: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step =
      snap === "center"
        ? first?.offsetWidth ?? el.clientWidth
        : first
          ? Math.max(first.offsetWidth, el.clientWidth - first.offsetWidth)
          : el.clientWidth;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  const arrow = `absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full shadow-playful ring-1 ring-cocoa/10 transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${tone}`;
  const hidden = persistent ? "opacity-40" : "pointer-events-none opacity-0";

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => page(-1)}
        aria-label={prevLabel}
        aria-disabled={atStart || undefined}
        className={`${arrow} -left-1 sm:-left-3 ${atStart ? hidden : "opacity-100"}`}
      >
        <Chevron className="h-4 w-4 rotate-180" />
      </button>

      <div
        ref={track}
        role="group"
        aria-label={label}
        tabIndex={0}
        className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${trackClassName}`}
      >
        {children.map((child, i) => (
          <div key={i} className={`shrink-0 ${snap === "center" ? "snap-center" : "snap-start"} ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => page(1)}
        aria-label={nextLabel}
        aria-disabled={atEnd || undefined}
        className={`${arrow} -right-1 sm:-right-3 ${atEnd ? hidden : "opacity-100"}`}
      >
        <Chevron className="h-4 w-4" />
      </button>
    </div>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
