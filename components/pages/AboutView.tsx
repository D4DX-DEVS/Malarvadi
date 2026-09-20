"use client";
import { motion } from "framer-motion";
import { TreePine, Flower2 } from "lucide-react";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import { Icon } from "@/components/icons";
import type { Mentor, SiteSettings, TimelineItem } from "@/lib/types";

/** Renders "…{highlight}…" with the highlighted phrase inside a <span>. */
function MentorsTitle({ title, highlight }: { title: string; highlight: string }) {
  const [before, after = ""] = title.split("{highlight}");
  return (
    <h4 className="mentors-title">{before}<span>{highlight}</span>{after}</h4>
  );
}

export default function AboutView({ settings, timeline, mentors }: { settings: SiteSettings; timeline: TimelineItem[]; mentors: Mentor[] }) {
  const p = settings.pages.about;
  return (
    <div className="page">
      <Header />
      <div className="wrap">
        <PageHero kicker={p.kicker} title={p.title} sub={p.sub} icon={<TreePine size={56} strokeWidth={1.8} />} />
        <div className="sub-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="sub-card">
            <h4><Flower2 size={20} /> ഞങ്ങളുടെ കഥ</h4>
            {p.story.map((para, i) => <p key={i}>{para}</p>)}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="sub-card" style={{ overflow: "hidden", padding: 0 }}>
            {p.image && <img src={p.image} alt={p.title} loading="lazy" style={{ height: 240, width: "100%", objectFit: "cover" }} />}
            <div style={{ padding: 14 }}>
              <b>{p.sundayNote}</b>
              <p style={{ margin: "4px 0 0", fontSize: 12 }}>{p.sundayLine}</p>
            </div>
          </motion.div>
        </div>
        {timeline.length > 0 && (
          <div className="timeline">
            {timeline.map((t, i) => (
              <motion.div key={t._id} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="t-item">
                <span className="dot" style={{ background: "#eafff1" }}><Icon name={t.icon} size={20} /></span>
                <span><b style={{ fontSize: 14 }}>{`${t.year} — ${t.title}`}</b><br /><small style={{ color: "#666" }}>{t.desc}</small></span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {mentors.length > 0 && (
        <section className="mentors-band">
          <svg className="mentor-defs" aria-hidden focusable="false">
            <defs>
              <clipPath id="mScallop" clipPathUnits="objectBoundingBox">
                <path d="M 0.95 0.5 A 0.14 0.14 0 0 1 0.8897 0.725 A 0.14 0.14 0 0 1 0.725 0.8897 A 0.14 0.14 0 0 1 0.5 0.95 A 0.14 0.14 0 0 1 0.275 0.8897 A 0.14 0.14 0 0 1 0.1103 0.725 A 0.14 0.14 0 0 1 0.05 0.5 A 0.14 0.14 0 0 1 0.1103 0.275 A 0.14 0.14 0 0 1 0.275 0.1103 A 0.14 0.14 0 0 1 0.5 0.05 A 0.14 0.14 0 0 1 0.725 0.1103 A 0.14 0.14 0 0 1 0.8897 0.275 A 0.14 0.14 0 0 1 0.95 0.5 Z" />
              </clipPath>
              <clipPath id="mStar" clipPathUnits="objectBoundingBox">
                <path d="M 0.5 0 L 0.6014 0.1546 L 0.7703 0.0794 L 0.7721 0.2643 L 0.9548 0.2923 L 0.8563 0.4488 L 0.9949 0.5712 L 0.8275 0.6495 L 0.8779 0.8274 L 0.6946 0.8029 L 0.6409 0.9797 L 0.5 0.86 L 0.3591 0.9797 L 0.3054 0.8029 L 0.1221 0.8274 L 0.1725 0.6495 L 0.0051 0.5712 L 0.1437 0.4488 L 0.0452 0.2923 L 0.2279 0.2643 L 0.2297 0.0794 L 0.3986 0.1546 Z" />
              </clipPath>
            </defs>
          </svg>
          <div className="wrap">
            <p className="mentors-eyebrow">ഞങ്ങളുടെ മെന്റർമാർ</p>
            <MentorsTitle title={p.mentorsTitle} highlight={p.mentorsHighlight} />
            <p className="mentors-sub">{p.mentorsSub}</p>
            <div className="mentors-grid">
              {mentors.map((m, i) => (
                <motion.div key={m._id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09, duration: .55 }} whileHover={{ y: -8 }} className="mentor-card">
                  <span className={`mentor-shape ${m.shape} ${m.tone}`} style={{ animationDelay: `${-i * 1.2}s` }}>
                    <img src={m.photo} alt={m.name} loading="lazy" />
                  </span>
                  <b>{m.name}</b>
                  <small>{m.role}</small>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      <CTABand /><Footer />
    </div>
  );
}
