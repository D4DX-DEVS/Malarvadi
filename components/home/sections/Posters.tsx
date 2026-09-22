"use client";
import { motion } from "framer-motion";
import { Image as ImageIcon, Pencil, Trophy, BookOpen } from "lucide-react";
import { Icon } from "@/components/icons";
import type { Poster } from "@/lib/types";
import type { SectionProps } from "@/components/home/section-types";

function PosterCard({ p, src }: { p: Poster; src?: string }) {
  // Poster artwork stands alone: the card is the image, nothing else.
  if (src) {
    return (
      <motion.div whileHover={{ y: -8 }} className="poster poster-photo">
        <img src={src} alt={p.title} loading="lazy" />
      </motion.div>
    );
  }
  if (p.tone === "light") {
    return (
      <motion.div whileHover={{ y: -8 }} className="poster" style={{ background: "#fff", padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 12, textAlign: "center" }}>
        <div style={{ background: "#fff6dc", borderRadius: 10, padding: "6px 12px", fontSize: 11, fontWeight: 800 }}>{p.kicker}</div>
        <Icon name={p.icon} size={56} color="#ef3f3f" />
        <b style={{ fontSize: 17, color: "#4e6415" }}>{p.title}</b>
        <small style={{ fontSize: 11.5, color: "#5d7c88", fontWeight: 700 }}>{p.note}</small>
      </motion.div>
    );
  }
  if (p.tone === "gradient") {
    return (
      <motion.div whileHover={{ y: -8 }} className="poster" style={{ background: "linear-gradient(180deg,#f5923c,#ef3f3f)", color: "#fff", padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 34, lineHeight: 1 }}>{p.kicker}</div>
        <Icon name={p.icon} size={36} />
        <b style={{ fontSize: 17 }}>{p.title}</b>
        <small style={{ fontSize: 11, opacity: .9 }}>{p.note}</small>
      </motion.div>
    );
  }
  return (
    <motion.div whileHover={{ y: -8 }} className="poster" style={{ background: "#0d3945", color: "#fff", padding: 20 }}>
      <div style={{ background: "#f7b41e", color: "#123a46", fontWeight: 800, borderRadius: 10, padding: "6px 10px", fontSize: 12 }}>{p.kicker}</div>
      <h4 style={{ fontSize: 22, lineHeight: 1.3, margin: "12px 0", color: "#fff" }}>{p.title} <Icon name={p.icon} size={19} style={{ verticalAlign: -3, display: "inline" }} /></h4>
      <p style={{ fontSize: 11, opacity: 0.8 }}>{p.note}</p>
      {p.cta && p.ctaHref && (
        <a href={p.ctaHref} style={{ marginTop: 12, background: "#ef3f3f", borderRadius: 999, textAlign: "center", fontWeight: 800, padding: 9, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#fff" }}>{p.cta} <Pencil size={14} /></a>
      )}
      <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 8 }}><Trophy size={30} /><BookOpen size={30} /></div>
    </motion.div>
  );
}

export default function Posters({ data, section }: SectionProps) {
  if (!data.posters.length) return null;
  // Posters are artwork first: fall back to the poster shots in the gallery so
  // the row still shows images before anyone uploads a dedicated poster.
  const shots = data.gallery.filter((g) => g.category === "posters").map((g) => g.src);
  return (
    <div className="cream-band">
      <div className="wrap">
        <div className="media-stack">
          <div className="poster-segment reveal rv-pop">
            <div className="section-head">
              <span style={{ color: "#fff", background: "#6d8a1e", borderRadius: "50%", width: 30, height: 30, display: "grid", placeItems: "center" }}><ImageIcon size={16} /></span>
              <h4>{section.title}</h4>
            </div>
            <div className="poster-grid">
              {data.posters.map((p, i) => (
                <PosterCard key={p._id} p={p} src={p.image || (shots.length ? shots[i % shots.length] : undefined)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
