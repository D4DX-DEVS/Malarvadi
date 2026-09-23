"use client";
import { Star, Trophy, ArrowRight } from "lucide-react";
import { Icon } from "@/components/icons";
import type { SectionProps } from "@/components/home/section-types";

export default function Features({ data, section }: SectionProps) {
  const items = data.features;
  if (!items.length) return null;
  return (
    <section className="features-bg">
      <div className="wrap reveal rv-zoom">
        <p className="feat-kicker"><Star size={13} /> {section.subtitle}</p>
        <h4 className="sec-title">{section.title}</h4>
      </div>
      {/* Cards ride a continuous right-moving marquee, duplicated once for a seamless loop. */}
      <div className="blob-marquee reveal rv-rise" id="features">
        <div className="blob-track">
          {[0, 1].map((copy) =>
            items.map((f) => {
              const inner = (
                <>
                  <span className="blob-star"><Icon name={f.icon} size={46} /></span>
                  <span className="blob-copy">
                    <b className="blob-text">{f.title}</b>
                    {f.desc && <span className="blob-desc">{f.desc}</span>}
                    {f.slug && <span className="blob-more">കൂടുതൽ അറിയാം <ArrowRight size={13} /></span>}
                  </span>
                </>
              );
              // The second copy only exists to make the loop seamless, so keep it
              // out of the tab order and away from screen readers.
              return f.slug ? (
                <a key={`${copy}-${f._id}`} href={`/why/${f.slug}`} className={`blob-card ${f.tone}`} aria-hidden={copy === 1 || undefined} tabIndex={copy === 1 ? -1 : undefined}>
                  {inner}
                </a>
              ) : (
                <div key={`${copy}-${f._id}`} className={`blob-card ${f.tone}`} aria-hidden={copy === 1 || undefined}>{inner}</div>
              );
            })
          )}
        </div>
      </div>
      <div className="wrap">
        <div className="feat-actions">
          <a href="/programs" className="btn btn-green"><Trophy size={15} /> പരിപാടികൾ കാണാം</a>
        </div>
      </div>
    </section>
  );
}
