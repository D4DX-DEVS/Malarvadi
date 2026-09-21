"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sprout, Heart, ArrowRight } from "lucide-react";
import { fadeUp, type SectionProps } from "@/components/home/section-types";

const CARD_CLASS = ["pc-yellow", "pc-blue", "pc-pink", "pc-mint", "pc-lavender"];

export default function ProgramsStrip({ data }: SectionProps) {
  const programs = data.programs;
  const [progIdx, setProgIdx] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  if (!programs.length) return null;
  const n = programs.length;

  const moveRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".program-logo-card");
    const distance = card ? card.offsetWidth + 18 : rail.clientWidth * 0.86;
    rail.scrollBy({ left: direction * distance, behavior: "smooth" });
    setProgIdx((current) => (current + direction + n) % n);
  };

  return (
    <div className="wrap">
      <section className="strip reveal">
        <div className="program-scene">
          <span className="program-deco program-deco-left" aria-hidden="true"><img src="/kid-left.png" alt="" /></span>
          <span className="program-deco program-deco-right" aria-hidden="true"><img src="/kid-right.png" alt="" /></span>
          <span className="program-spark spark-left" aria-hidden="true"><Sprout size={23} /></span>
          <span className="program-spark spark-right" aria-hidden="true"><Heart size={21} /></span>
          <div className="program-rail-shell">
            <div className="program-rail" ref={railRef} onScroll={(event) => {
              const rail = event.currentTarget;
              const card = rail.querySelector<HTMLElement>(".program-logo-card");
              if (!card) return;
              setProgIdx(Math.round(rail.scrollLeft / (card.offsetWidth + 18)) % n);
            }}>
              {programs.map((p, i) => (
                <motion.a
                  key={p._id}
                  href={`/programs/${p.slug}`}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ amount: .35 }}
                  custom={i}
                  className={`program-logo-card ${CARD_CLASS[i % CARD_CLASS.length]}`}
                  onMouseEnter={() => setProgIdx(i)}
                  aria-label={`${p.title} — ${p.tagline}`}
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
                    <small>{p.meta}</small>
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
