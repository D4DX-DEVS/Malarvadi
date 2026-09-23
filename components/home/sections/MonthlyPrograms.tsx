"use client";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Leaf, Sparkles, Star } from "lucide-react";
import type { SectionProps } from "@/components/home/section-types";

/** Highlights the last word of the title, e.g. "ഏറ്റവും പുതിയ <em>പരിപാടി</em>". */
function TitleWords({ title }: { title: string }) {
  const words = title.trim().split(/\s+/);
  const last = words.pop();
  const rest = words.join(" ");
  return (
    <>
      {rest && `${rest} `}
      {last && <span className="monthly-hl">{last}</span>}
    </>
  );
}

export default function MonthlyPrograms({ data, section }: SectionProps) {
  const item = data.monthlyPrograms[0];
  if (!item) return null;
  return (
    <section id="monthly-programs" className="monthly-band">
      <div className="wrap">
        <div className="monthly-panel">
          <span className="monthly-hill" aria-hidden />
          <Leaf className="monthly-deco d1" size={22} aria-hidden />
          <Star className="monthly-deco d2" size={18} aria-hidden />
          <Leaf className="monthly-deco d3" size={20} aria-hidden />
          <Star className="monthly-deco d4" size={16} aria-hidden />

          <div className="monthly-latest-grid">
            <div className="monthly-latest-copy reveal rv-left">
              <h4 className="monthly-title">
                <Sparkles className="monthly-spark" size={20} aria-hidden />
                <TitleWords title={section.title} />
              </h4>
              <p className="blog-sub" style={{ textAlign: "left", margin: "10px 0 22px" }}>{section.subtitle}</p>
              <a href="/monthly-programs" className="btn btn-green">എല്ലാ പരിപാടികളും കാണാം <ArrowRight size={15} /></a>
            </div>
            <div className="monthly-card-wrap">
              <motion.article
                initial={{ opacity: 0, y: 24, rotate: -6 }}
                whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: .7, ease: "easeOut" }}
                whileHover={{ y: -8, rotate: 0 }}
                className="blog-card monthly-latest-card"
              >
                <span className="pinned-pin" aria-hidden />
                <img className="blog-photo" src={item.image} alt={item.title} loading="lazy" />
                <div className="blog-tags"><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><CalendarDays size={12} /> {item.month} {item.year}</span></div>
                <h4>{item.title}</h4>
                <p className="blog-text clamp-2">{item.desc}</p>
                {item.slug && <a className="btn btn-pink" href={`/monthly-programs/${item.slug}`}>കൂടുതൽ അറിയാം <ArrowRight size={14} /></a>}
              </motion.article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
