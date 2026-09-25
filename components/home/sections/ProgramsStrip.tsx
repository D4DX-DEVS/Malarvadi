"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sprout, Heart, ArrowRight } from "lucide-react";
import { fadeUp, type SectionProps } from "@/components/home/section-types";

const CARD_CLASS = ["pc-yellow", "pc-blue", "pc-pink", "pc-mint", "pc-lavender"];
const AUTO_SPEED = 28; // px/second of continuous drift — slow and linear
const GAP = 18; // matches .program-rail's CSS `gap`
const JUMP_MS = 450; // arrow-click transition duration

export default function ProgramsStrip({ data }: SectionProps) {
  const programs = data.programs;
  const [progIdx, setProgIdx] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0); // current translateX magnitude, in px (transform is -x)
  const hoverRef = useRef(false);
  const jumpingRef = useRef(false);
  const reduced = useReducedMotion() === true;
  const n = programs.length;

  // Manual step (arrow click): a short CSS-transitioned jump. jumpingRef
  // pauses the rAF drift for the duration so the two never fight over
  // `transform`; once the transition ends we drop the transition (so the
  // next rAF frame writes transform directly again) and, if the jump moved
  // us into the duplicated second copy, silently subtract one set-width —
  // the duplicate lines up pixel-for-pixel, so that correction is invisible.
  const moveRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".program-logo-card");
    const step = card ? card.offsetWidth + GAP : rail.clientWidth * 0.86;
    const setWidth = rail.scrollWidth / 2;
    jumpingRef.current = true;
    xRef.current = Math.max(0, xRef.current + direction * step);
    rail.style.transition = `transform ${JUMP_MS}ms cubic-bezier(.2,.7,.2,1)`;
    rail.style.transform = `translateX(${-xRef.current}px)`;
    setProgIdx((current) => (current + direction + n) % n);
    window.setTimeout(() => {
      if (setWidth > 0 && xRef.current >= setWidth) xRef.current -= setWidth;
      rail.style.transition = "none";
      rail.style.transform = `translateX(${-xRef.current}px)`;
      jumpingRef.current = false;
    }, JUMP_MS + 20);
  };

  // Circular loop: a continuously increasing translateX (not native scroll,
  // so there is nothing for the browser to scrollbar or snap-fight with),
  // driven by rAF so it's frame-rate independent and perfectly linear.
  // Hovering pauses it in place (grayscale on the hovered logo itself is
  // handled by `.program-logo-card:hover` in globals.css) and it resumes
  // from that exact x on mouse-leave — nothing ever resets xRef except the
  // seamless duplicate-copy wrap. The rail below renders the program list
  // twice back-to-back so that wrap is invisible. Skipped entirely under
  // prefers-reduced-motion, leaving the rail static (arrows still work).
  useEffect(() => {
    if (n < 2 || reduced) return;
    let raf = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      if (last === null) last = now;
      const dt = now - last;
      last = now;
      const rail = railRef.current;
      if (rail && !hoverRef.current && !jumpingRef.current) {
        const setWidth = rail.scrollWidth / 2;
        if (setWidth > 0) {
          let next = xRef.current + (AUTO_SPEED * dt) / 1000;
          if (next >= setWidth) next -= setWidth;
          xRef.current = next;
          rail.style.transform = `translateX(${-next}px)`;
          const card = rail.querySelector<HTMLElement>(".program-logo-card");
          if (card) {
            const idx = Math.round(next / (card.offsetWidth + GAP)) % n;
            setProgIdx((p) => (p === idx ? p : idx));
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n, reduced]);

  if (!programs.length) return null;

  return (
    <div className="wrap">
      <section className="strip reveal">
        <div
          className="program-scene"
          onMouseEnter={() => { hoverRef.current = true; }}
          onMouseLeave={() => { hoverRef.current = false; }}
        >
          <span className="program-deco program-deco-left" aria-hidden="true"><img src="/kid-left.png" alt="" /></span>
          <span className="program-deco program-deco-right" aria-hidden="true"><img src="/kid-right.png" alt="" /></span>
          <span className="program-spark spark-left" aria-hidden="true"><Sprout size={23} /></span>
          <span className="program-spark spark-right" aria-hidden="true"><Heart size={21} /></span>
          <div className="program-rail-shell">
            <div className="program-rail" ref={railRef}>
              {[...programs, ...programs].map((p, i) => (
                <motion.a
                  key={`${p._id}-${i}`}
                  href={`/programs/${p.slug}`}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ amount: .35 }}
                  custom={i % n}
                  className={`program-logo-card ${CARD_CLASS[i % CARD_CLASS.length]}`}
                  onMouseEnter={() => setProgIdx(i % n)}
                  aria-label={p.tagline ? `${p.title} — ${p.tagline}` : p.title}
                  aria-hidden={i >= n || undefined}
                  tabIndex={i >= n ? -1 : undefined}
                >
                  <span className="program-logo-frame">
                    {p.image ? (
                      <img src={p.image} alt={`${p.title} logo`} loading={i < 3 ? "eager" : "lazy"} />
                    ) : (
                      <span className="program-logo-fallback">{p.title}</span>
                    )}
                  </span>
                  <span className="program-card-meta">
                    <strong>{p.title}</strong>
                    {p.meta && <small>{p.meta}</small>}
                    <span className="program-card-link">കാണാം <ArrowRight size={13} /></span>
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
          <button className="arrow l" type="button" aria-label="Previous programs" onClick={() => moveRail(-1)}><ChevronLeft size={16} /></button>
          <button className="arrow r" type="button" aria-label="Next programs" onClick={() => moveRail(1)}><ChevronRight size={16} /></button>
          {n > 1 && <div className="program-dots" aria-hidden="true">{programs.map((p, i) => <i key={p._id} className={i === progIdx ? "on" : ""} />)}</div>}
        </div>
      </section>
    </div>
  );
}
