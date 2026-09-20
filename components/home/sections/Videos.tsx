"use client";
import { motion } from "framer-motion";
import { Plane, ArrowRight } from "lucide-react";
import type { SectionProps } from "@/components/home/section-types";

export default function Videos({ data, section }: SectionProps) {
  if (!data.videos.length) return null;
  const featuredIdx = Math.max(0, data.videos.findIndex((v) => v.featured));
  return (
    <div className="cream-band">
      <div className="wrap">
        <div className="media-stack">
          <div className="panel lav video-panel reveal">
            <Plane className="corner" size={28} style={{ right: 2, top: -2 }} />
            <div className="gallery-panel-head">
              <div>
                <h4><span style={{ background: "#f4558d", color: "#fff", borderRadius: "50%", width: 30, height: 30, display: "grid", placeItems: "center", fontSize: 14 }}>▶</span> {section.title}</h4>
                <p className="sub">{section.subtitle}</p>
              </div>
              <a href="/gallery?f=videos" className="mini">എല്ലാം കാണാം <ArrowRight size={13} /></a>
            </div>
            <div className="youtube-grid">
              {data.videos.map((video, i) => (
                <motion.article key={video._id} className={`youtube-card ${i === featuredIdx ? "featured" : ""}`} whileHover={{ y: -6 }}>
                  <div className="youtube-frame">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="youtube-caption"><b>{video.title}</b><small>{video.meta}</small></div>
                </motion.article>
              ))}
            </div>
            <p style={{ fontSize: 11, fontWeight: 800, color: "#0b6aa5", textAlign: "right", margin: "12px 0 0", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 5 }}>കാണൂ... ചിരിക്കൂ... വളരൂ... <Plane size={14} /></p>
          </div>
        </div>
      </div>
    </div>
  );
}
