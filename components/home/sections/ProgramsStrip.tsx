"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Baby, UserRound, Sprout, Heart, ArrowRight } from "lucide-react";
import { Icon } from "@/components/icons";
import { fadeUp, type SectionProps } from "@/components/home/section-types";

const CARD_CLASS = ["pc-yellow", "pc-blue", "pc-pink"];
const TITLE_STYLE: React.CSSProperties[] = [
  { color: "#111" },
  { color: "#e8590c", textShadow: "0 2px 0 #fff", letterSpacing: .5 },
  { color: "#5c2e00", textShadow: "0 2px 0 #ffd43b, 0 4px 0 #fff" },
];
const PILL_BORDER = ["#f0d9a9", "#bfe3ff", "#ffc7d8"];
const FOCUS_SCALE = [1.03, 1.045, 1.03];

export default function ProgramsStrip({ data }: SectionProps) {
  const programs = data.programs.slice(0, 3);
  const [progIdx, setProgIdx] = useState(1);
  if (!programs.length) return null;
  const n = programs.length;
  return (
    <div className="wrap">
      <section className="strip reveal">
        <div style={{ position: "relative" }}>
          <span className="side-kid" style={{ left: -62 }}><Baby size={50} /><small><Sprout size={18} /></small></span>
          <span className="side-kid" style={{ right: -60, animationDelay: "-1.4s" }}><UserRound size={50} /><small><Heart size={18} /></small></span>
          <div className="strip-row">
            {programs.map((p, i) => (
              <motion.a
                key={p._id}
                href={`/programs/${p.slug}`}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={i}
                viewport={{ once: true }}
                className={`prog-card ${CARD_CLASS[i % 3]}`}
                onMouseEnter={() => setProgIdx(i)}
                style={{ opacity: progIdx === i ? 1 : 0.94, scale: progIdx === i ? FOCUS_SCALE[i % 3] : 1 }}
              >
                <motion.span animate={{ y: [0, -7, 0], rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3.4 }} style={{ display: "block" }}>
                  <Icon name={p.icon} size={42} />
                </motion.span>
                <h4 style={TITLE_STYLE[i % 3]}>{p.title}</h4>
                <p>{p.tagline}</p>
                <span style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, background: "#fff", borderRadius: 999, padding: "4px 12px", border: `1px solid ${PILL_BORDER[i % 3]}` }}>
                  {p.meta} <ArrowRight size={13} />
                </span>
              </motion.a>
            ))}
          </div>
          <span className="arrow l" onClick={() => setProgIdx((progIdx + n - 1) % n)}><ChevronLeft size={16} /></span>
          <span className="arrow r" onClick={() => setProgIdx((progIdx + 1) % n)}><ChevronRight size={16} /></span>
        </div>
      </section>
    </div>
  );
}
