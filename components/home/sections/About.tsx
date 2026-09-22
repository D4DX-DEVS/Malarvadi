"use client";
import { motion } from "framer-motion";
import { Leaf, Sparkles, Star, Flower2, ArrowRight, Palette, BookOpen, Sprout } from "lucide-react";
import type { SectionProps } from "@/components/home/section-types";

const CHIP_ICONS = [Palette, BookOpen, Sprout];
const CHIP_STYLE: React.CSSProperties[] = [
  { background: "#f1f8dd", border: "1px solid #dcebb8" },
  { background: "#e4f7fc", border: "1px solid #bfe6f5" },
  { background: "#fff6dc", border: "1px solid #ffe3a1" },
];

export default function About({ data }: SectionProps) {
  const { about } = data.settings;
  const chips = (about.chips ?? []).slice(0, 3);
  return (
    <div className="wrap">
      <section className="about">
        <div className="about-photo-wrap reveal rv-left">
          <div className="about-blob" />
          <motion.div whileHover={{ rotate: 0, scale: 1.015 }} className="about-photo">
            <img src={about.image} alt="Children playing and reading together" />
          </motion.div>
          <span className="about-sticker"><Flower2 size={28} /><Flower2 size={28} /></span>
          <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: .3, type: "spring", stiffness: 200 }} style={{ position: "absolute", left: -10, top: 12, background: "#fff", border: "2px solid #ffe3a1", borderRadius: 999, padding: "6px 12px", fontSize: 11, fontWeight: 800, boxShadow: "0 8px 18px rgba(0,0,0,.1)", zIndex: 2, display: "inline-flex", alignItems: "center", gap: 5 }}><Star size={13} fill="#f7b41e" color="#a87400" /> {about.badge}</motion.span>
        </div>
        <div className="about-text reveal rv-right">
          {about.kicker && <div className="kick"><Leaf size={14} /> {about.kicker} <Sparkles size={12} /></div>}
          <h4>{about.title.split("\n").map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</h4>
          <p>{about.body}</p>
          {chips.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {chips.map((c, i) => {
                const C = CHIP_ICONS[i];
                return (
                  <span key={c} style={{ fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 5, ...CHIP_STYLE[i] }}>
                    <C size={13} /> {c}
                  </span>
                );
              })}
            </div>
          )}
          <a href="/about" className="btn btn-green">കൂടുതൽ അറിയാം <ArrowRight size={15} /></a>
        </div>
      </section>
    </div>
  );
}
