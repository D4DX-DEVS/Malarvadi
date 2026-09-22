"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plane, ArrowRight, Play } from "lucide-react";
import type { SectionProps } from "@/components/home/section-types";
import Lightbox, { type LightboxItem } from "@/components/pages/Lightbox";
import { platformLabel, videoEmbedSrc, videoThumbnail } from "@/lib/video";

export default function Videos({ data, section }: SectionProps) {
  const [clip, setClip] = useState<number | null>(null);
  // Only videos we can actually embed reach the grid, so card index and
  // lightbox index stay in step.
  const playable = useMemo(
    () => data.videos.map((v) => ({ v, src: videoEmbedSrc(v) })).filter((x) => x.src),
    [data.videos],
  );
  const items = useMemo<LightboxItem[]>(
    () => playable.map(({ v, src }) => ({ embedSrc: src!, caption: v.title })),
    [playable],
  );
  if (!playable.length) return null;
  const featuredIdx = Math.max(0, playable.findIndex(({ v }) => v.featured));

  return (
    <div className="cream-band">
      <div className="wrap">
        <div className="media-stack">
          <div className="panel lav video-panel reveal rv-clip">
            <Plane className="corner" size={28} style={{ right: 2, top: -2 }} />
            <div className="gallery-panel-head">
              <div>
                <h4><span style={{ background: "#ef3f3f", color: "#fff", borderRadius: "50%", width: 30, height: 30, display: "grid", placeItems: "center", fontSize: 14 }}>▶</span> {section.title}</h4>
              </div>
              <a href="/gallery?f=videos" className="mini">എല്ലാം കാണാം <ArrowRight size={13} /></a>
            </div>
            <div className="youtube-grid">
              {playable.map(({ v }, i) => {
                const thumb = videoThumbnail(v);
                return (
                  <motion.button
                    type="button"
                    key={v._id}
                    className={`youtube-card ${i === featuredIdx ? "featured" : ""}`}
                    whileHover={{ y: -6 }}
                    onClick={() => setClip(i)}
                    aria-label={v.title}
                  >
                    <div className="youtube-frame">
                      {thumb
                        ? <img src={thumb} alt={v.title} loading="lazy" />
                        : <span className="media-thumb-fallback">{platformLabel(v)}</span>}
                      <span className="youtube-play"><Play size={22} fill="currentColor" /></span>
                    </div>
                    <div className="youtube-caption"><b>{v.title}</b><small>{v.meta}</small></div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Lightbox items={items} index={clip} onClose={() => setClip(null)} onIndex={setClip} />
    </div>
  );
}
