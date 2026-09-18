"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { Balloon, Cloud, Kite, Sprout, Star, Sun } from "./Decor";

/** Shortest time the curtain stays, so it never flickers past unseen. */
const MIN_HOLD = 950;
/** Longest it waits for the page to finish, so a slow asset cannot trap it. */
const MAX_HOLD = 2400;
/** Matches the curtain-up keyframe in globals.css. */
const LIFT_MS = 600;

/**
 * Welcome curtain: the logo hops on a cream sky while a sun turns, a kite
 * sways and a balloon drifts, then the whole panel lifts away.
 *
 * It is rendered during SSR on purpose, so it covers the very first paint
 * rather than flashing in after the page has already drawn.
 *
 * It plays on every full page load. It used to be stored against
 * `sessionStorage` and shown once per visit, which meant that after the first
 * page nobody ever saw it again. Client-side navigation between pages does not
 * remount this component, so moving around the site stays instant either way -
 * only a real load or refresh brings the curtain back.
 *
 * Timing follows the page rather than a fixed clock: it lifts once the window
 * has loaded, never sooner than MIN_HOLD and never later than MAX_HOLD.
 *
 * Reduced-motion visitors skip it entirely, and a <noscript> rule hides it for
 * no-JS visitors, who never run the effect that would dismiss it.
 */
export function SiteLoader({ label }: { label: string }) {
  const [phase, setPhase] = useState<"holding" | "lifting" | "done">("holding");
  const scheduled = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }

    const start = performance.now();
    const timers: number[] = [];

    /* Whichever of "page finished" and "cap reached" comes first wins, and
       only the first one is allowed to schedule the exit. */
    function scheduleLift() {
      if (scheduled.current) return;
      scheduled.current = true;
      const remaining = Math.max(0, MIN_HOLD - (performance.now() - start));
      timers.push(window.setTimeout(() => setPhase("lifting"), remaining));
      timers.push(window.setTimeout(() => setPhase("done"), remaining + LIFT_MS));
    }

    if (document.readyState === "complete") {
      scheduleLift();
    } else {
      window.addEventListener("load", scheduleLift, { once: true });
      timers.push(window.setTimeout(scheduleLift, MAX_HOLD));
    }

    return () => {
      window.removeEventListener("load", scheduleLift);
      timers.forEach(window.clearTimeout);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      id="site-loader"
      role="status"
      aria-label={label}
      aria-live="polite"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-cream ${
        phase === "lifting" ? "pointer-events-none is-lifting" : ""
      }`}
    >
      <noscript>
        <style>{"#site-loader{display:none !important}"}</style>
      </noscript>

      {/* The same sky the site opens onto, so the curtain lifts on a scene the
          reader is about to meet rather than on a blank screen. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky/25 via-cream/0 to-cream/0" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Sun face className="absolute right-[12%] top-[12%] h-20 w-20 animate-float-slow text-marigold sm:h-32 sm:w-32" />
        <Cloud className="absolute left-[6%] top-[16%] h-10 w-24 animate-drift text-white sm:h-14 sm:w-36" />
        <span className="absolute right-[22%] top-[32%] hidden animate-drift sm:block" style={{ animationDelay: "1.5s" }}>
          <Cloud className="h-9 w-24 text-white/90" />
        </span>
        <Kite className="absolute left-[17%] top-[26%] hidden h-24 w-14 animate-sway text-blossom/80 sm:block" />
        <Balloon className="absolute bottom-[14%] right-[15%] h-16 w-11 animate-float text-coral/80 sm:h-24 sm:w-16" />
        <Sprout className="absolute bottom-[10%] left-[14%] h-14 w-14 animate-sway-slow text-leaf/75 sm:h-20 sm:w-20" />
        <Star className="absolute left-[28%] top-[64%] h-6 w-6 animate-twinkle text-marigold/80" />
        <span className="absolute right-[32%] top-[24%] animate-twinkle" style={{ animationDelay: "0.8s" }}>
          <Star className="h-5 w-5 text-blossom/80" />
        </span>
      </div>

      {/* The logo hops on the spot inside a soft pulsing halo. */}
      <div className="relative animate-drop-in">
        <span aria-hidden="true" className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-leaf/25" />
        <span className="inline-flex animate-bounce-soft rounded-3xl bg-white px-6 py-4 shadow-playful">
          <Logo className="h-11 sm:h-12" />
        </span>
      </div>

      <div className="mt-8 flex items-center gap-2.5" aria-hidden="true">
        <span className="h-3.5 w-3.5 animate-bounce-soft rounded-full bg-leaf" />
        <span className="h-3.5 w-3.5 animate-bounce-soft rounded-full bg-marigold" style={{ animationDelay: "0.15s" }} />
        <span className="h-3.5 w-3.5 animate-bounce-soft rounded-full bg-berry" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}
