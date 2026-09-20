"use client";
import { Star, Trophy, ArrowRight } from "lucide-react";
import { Icon } from "@/components/icons";
import type { SectionProps } from "@/components/home/section-types";

export default function Features({ data, section }: SectionProps) {
  const items = data.features;
  if (!items.length) return null;
  return (
    <section className="features-bg">
      <div className="wrap">
        <p className="feat-kicker"><Star size={13} /> {section.subtitle}</p>
        <h4 className="sec-title">{section.title}</h4>
      </div>
      {/* Cards ride a continuous right-moving marquee, duplicated once for a seamless loop. */}
      <div className="blob-marquee">
        <div className="blob-track">
          {[0, 1].map((copy) =>
            items.map((f) => (
              <div key={`${copy}-${f._id}`} className={`blob-card ${f.tone}`} aria-hidden={copy === 1}>
                <span className="blob-star"><Icon name={f.icon} size={46} /></span>
                <b className="blob-text">{f.title}</b>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="wrap">
        <div className="feat-actions">
          <a href="/programs" className="btn btn-green"><Trophy size={15} /> പരിപാടികൾ കാണാം</a>
          <a href="/gallery" className="btn" style={{ background: "#fff", border: "1.5px solid #ffe0b8" }}>ഗാലറി <ArrowRight size={15} /></a>
        </div>
      </div>
    </section>
  );
}
