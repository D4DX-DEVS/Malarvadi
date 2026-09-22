"use client";
import { motion } from "framer-motion";
import { Palette, ArrowRight } from "lucide-react";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import type { Program, SiteSettings } from "@/lib/types";

/**
 * Every programme, each on a card of its own colour.
 *
 * The card leads with the programme's own logo rather than a generic icon, so
 * the page reads the way the home rail does. A programme with no logo yet falls
 * back to its name set large, never to a stock icon.
 */
export default function ProgramsView({ settings, programs }: { settings: SiteSettings; programs: Program[] }) {
  const p = settings.pages.programs;
  return (
    <div className="page page-inner">
      <Header />
      <div className="wrap">
        <PageHero kicker={p.kicker} title={p.title} sub={p.sub} icon={<Palette size={56} strokeWidth={1.8} />} />
        {programs.length > 0 ? (
          <div className="pg-grid">
            {programs.map((item, i) => (
              <motion.a
                key={item._id}
                href={`/programs/${item.slug}`}
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 3) * 0.08 }} whileHover={{ y: -6 }}
                className="pg-card" style={{ background: item.color }}
              >
                <span className="pg-logo">
                  {item.image
                    ? <img src={item.image} alt={`${item.title} logo`} loading="lazy" />
                    : <b className="pg-logo-fallback">{item.title}</b>}
                </span>
                <h4 className="pg-title">{item.title}</h4>
                {item.desc && <p className="pg-desc">{item.desc}</p>}
                {item.meta && <span className="meta-pill">{item.meta}</span>}
                <span className="pg-more">കൂടുതൽ അറിയാം <ArrowRight size={14} /></span>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="sub-card empty-card"><h4>പരിപാടികൾ ഉടൻ ചേർക്കും</h4><p>പുതിയ പരിപാടികൾ വൈകാതെ ഇവിടെ കാണാം.</p></div>
        )}
        <div style={{ height: 16 }} />
      </div>
      <CTABand /><Footer />
    </div>
  );
}
