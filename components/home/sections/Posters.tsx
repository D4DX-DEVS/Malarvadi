"use client";
import { motion } from "framer-motion";
import { Image as ImageIcon, ArrowRight, Pencil, Trophy, BookOpen } from "lucide-react";
import { Icon } from "@/components/icons";
import type { Poster } from "@/lib/types";
import type { SectionProps } from "@/components/home/section-types";

function PosterCard({ p }: { p: Poster }) {
  // An uploaded artwork replaces the styled card entirely.
  if (p.image) {
    return (
      <motion.div whileHover={{ y: -8 }} className="poster" style={{ position: "relative", background: "#101828" }}>
        <img src={p.image} alt={p.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "22px 16px 14px", background: "linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.72))", color: "#fff", fontWeight: 800, fontSize: 15, textAlign: "center" }}>{p.title}</span>
      </motion.div>
    );
  }
  if (p.tone === "light") {
    return (
      <motion.div whileHover={{ y: -8 }} className="poster" style={{ background: "#fff", padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 12, textAlign: "center" }}>
        <div style={{ background: "#ffe8a3", borderRadius: 10, padding: "6px 12px", fontSize: 11, fontWeight: 800 }}>{p.kicker}</div>
        <Icon name={p.icon} size={56} color="#f4558d" />
        <b style={{ fontSize: 17, color: "#0b4f3a" }}>{p.title}</b>
        <small style={{ fontSize: 11.5, color: "#6b7c86", fontWeight: 700 }}>{p.note}</small>
      </motion.div>
    );
  }
  if (p.tone === "gradient") {
    return (
      <motion.div whileHover={{ y: -8 }} className="poster" style={{ background: "linear-gradient(180deg,#ff9a3d,#f4558d)", color: "#fff", padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 34, lineHeight: 1 }}>{p.kicker}</div>
        <Icon name={p.icon} size={36} />
        <b style={{ fontSize: 17 }}>{p.title}</b>
        <small style={{ fontSize: 11, opacity: .9 }}>{p.note}</small>
      </motion.div>
    );
  }
  return (
    <motion.div whileHover={{ y: -8 }} className="poster" style={{ background: "#101828", color: "#fff", padding: 20 }}>
      <div style={{ background: "#ffd23f", color: "#111", fontWeight: 800, borderRadius: 10, padding: "6px 10px", fontSize: 12 }}>{p.kicker}</div>
      <h4 style={{ fontSize: 22, lineHeight: 1.3, margin: "12px 0", color: "#fff" }}>{p.title} <Icon name={p.icon} size={19} style={{ verticalAlign: -3, display: "inline" }} /></h4>
      <p style={{ fontSize: 11, opacity: 0.8 }}>{p.note}</p>
      {p.cta && p.ctaHref && (
        <a href={p.ctaHref} style={{ marginTop: 12, background: "#f4558d", borderRadius: 999, textAlign: "center", fontWeight: 800, padding: 9, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#fff" }}>{p.cta} <Pencil size={14} /></a>
      )}
      <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 8 }}><Trophy size={30} /><BookOpen size={30} /></div>
    </motion.div>
  );
}

export default function Posters({ data, section }: SectionProps) {
  if (!data.posters.length) return null;
  return (
    <div className="cream-band">
      <div className="wrap">
        <div className="media-stack">
          <div className="poster-segment reveal">
            <div className="section-head">
              <span style={{ color: "#fff", background: "#27a866", borderRadius: "50%", width: 30, height: 30, display: "grid", placeItems: "center" }}><ImageIcon size={16} /></span>
              <h4>{section.title}</h4>
              <a href="/gallery?f=posters" className="mini">എല്ലാം കാണാം <ArrowRight size={13} /></a>
            </div>
            <div className="poster-grid">
              {data.posters.map((p) => <PosterCard key={p._id} p={p} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
