"use client";
import { motion } from "framer-motion";
import { Camera, Sparkles, Leaf, ArrowRight } from "lucide-react";
import type { SectionProps } from "@/components/home/section-types";

export default function Gallery({ data, section }: SectionProps) {
  const photos = data.gallery.slice(0, 8);
  if (!photos.length) return null;
  return (
    <div className="cream-band">
      <div className="wrap">
        <section id="gallery" className="gallery-stack">
          <div className="panel mint gallery-panel reveal rv-blur">
            <Camera className="corner" size={22} style={{ left: 12, top: 8 }} />
            <Sparkles className="corner" size={17} style={{ right: 16, top: 6 }} />
            <div className="gallery-panel-head">
              <div>
                <h4 style={{ paddingLeft: 32 }}>{section.title}</h4>
                <p className="sub" style={{ paddingLeft: 32 }}>{section.subtitle}</p>
              </div>
              <div className="gallery-actions">
                <a href="/gallery" className="mini">എല്ലാം കാണാം <ArrowRight size={13} /></a>
              </div>
            </div>
            <div className="photo-grid photo-grid-wide">
              {photos.map((g) => (
                <a key={g._id} href="/gallery">
                  <motion.img src={g.src} alt={g.caption || "gallery"} loading="lazy" whileHover={{ scale: 1.08, rotate: -1.5 }} />
                </a>
              ))}
            </div>
            <p style={{ fontSize: 11.5, fontWeight: 800, color: "#0d7f99", margin: "14px 0 0", display: "flex", alignItems: "center", gap: 5 }}><Camera size={14} /> ഓരോ ചിത്രവും ഒരു മധുര ഓർമ്മ...!</p>
            <Leaf className="corner" size={22} style={{ left: 14, bottom: 8 }} />
          </div>
        </section>
      </div>
    </div>
  );
}
