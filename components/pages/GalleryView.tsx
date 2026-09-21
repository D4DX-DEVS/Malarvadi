"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Play } from "lucide-react";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import Lightbox, { type LightboxItem } from "./Lightbox";
import type { GalleryItem, Poster, SiteSettings, Video } from "@/lib/types";

const FILTERS: [string, string][] = [
  ["all", "എല്ലാം"], ["photos", "ചിത്രങ്ങൾ"], ["videos", "വീഡിയോകൾ"], ["events", "പരിപാടികൾ"], ["posters", "പോസ്റ്ററുകൾ"],
];

export default function GalleryView({ settings, gallery, videos, posters, initialFilter }: {
  settings: SiteSettings; gallery: GalleryItem[]; videos: Video[]; posters: Poster[]; initialFilter: string;
}) {
  const p = settings.pages.gallery;
  const [f, setF] = useState(FILTERS.some(([v]) => v === initialFilter) ? initialFilter : "all");
  const [shot, setShot] = useState<number | null>(null);
  const [clip, setClip] = useState<number | null>(null);

  /** Photo strip for the current filter — posters also pull in the posters collection. */
  const photos = useMemo<LightboxItem[]>(() => {
    const fromGallery = gallery
      .filter((g) => f === "all" || g.category === f)
      .map((g) => ({ src: g.src, caption: g.caption }));
    if (f !== "posters") return fromGallery;
    const fromPosters = posters.filter((po) => !!po.image).map((po) => ({ src: po.image!, caption: po.title }));
    return [...fromGallery, ...fromPosters];
  }, [gallery, posters, f]);

  const clips = useMemo<LightboxItem[]>(() => videos.map((v) => ({ youtubeId: v.youtubeId, caption: v.title })), [videos]);
  const showPhotos = f !== "videos";
  const showVideos = f === "all" || f === "videos";

  return (
    <div className="page">
      <Header />
      <div className="wrap">
        <PageHero kicker={p.kicker} title={p.title} sub={p.sub} icon={<Camera size={56} strokeWidth={1.8} />} />
        <div className="filter-row">
          {FILTERS.map(([v, l]) => (
            <button key={v} onClick={() => setF(v)} className={`chip ${f === v ? "on" : ""}`}>{l}</button>
          ))}
        </div>

        {showPhotos && (
          photos.length > 0 ? (
            <div className="g-grid">
              {photos.map((item, i) => (
                <motion.img
                  key={`${item.src}-${i}`} src={item.src} alt={item.caption || "gallery"} loading="lazy"
                  initial={{ opacity: 0, scale: .94 }} whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (i % 4) * 0.06 }} style={{ cursor: "pointer" }} onClick={() => setShot(i)}
                />
              ))}
            </div>
          ) : (
            <div className="sub-card empty-card" style={{ marginBottom: 36 }}><h4>ചിത്രങ്ങൾ ഉടൻ ചേർക്കും</h4><p>പുതിയ ചിത്രങ്ങൾ വൈകാതെ ഇവിടെ കാണാം.</p></div>
          )
        )}

        {showVideos && (
          clips.length > 0 ? (
            <div className="sub-grid">
              {videos.map((v, i) => (
                <motion.button key={v._id} type="button" whileHover={{ y: -5 }} className="sub-card media-card" onClick={() => setClip(i)} aria-label={v.title}>
                  <div className="media-thumb">
                    <img src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`} alt={v.title} loading="lazy" />
                    <span className="play"><i><Play size={22} fill="currentColor" /></i></span>
                  </div>
                  <div className="media-body"><b>{v.title}</b><small>{v.meta}</small></div>
                </motion.button>
              ))}
            </div>
          ) : (
            f === "videos" && <div className="sub-card empty-card" style={{ marginBottom: 36 }}><h4>വീഡിയോകൾ ഉടൻ വരും</h4><p>പുതിയ വീഡിയോകൾ വൈകാതെ ഇവിടെ കാണാം.</p></div>
          )
        )}
        <div style={{ height: 14 }} />
      </div>
      <Lightbox items={photos} index={shot} onClose={() => setShot(null)} onIndex={setShot} />
      <Lightbox items={clips} index={clip} onClose={() => setClip(null)} onIndex={setClip} />
      <CTABand /><Footer />
    </div>
  );
}
