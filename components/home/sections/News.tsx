"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { SectionProps } from "@/components/home/section-types";

/** Cards drift in from alternating sides, staggered, as the row scrolls into view. */
const cardIn = {
  hidden: (i: number) => {
    const dir = i % 2 === 0 ? -1 : 1;
    return { opacity: 0, x: dir * 90, y: 24, rotate: dir * 1.5 };
  },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: .75, delay: i * .12, ease: "easeOut" },
  }),
};

export default function News({ data, section }: SectionProps) {
  if (!data.news.length) return null;
  return (
    <section id="news" className="blog-band news-band">
      <div className="wrap">
        <div className="news-cloud">
          <div className="news-cloud-panel">
            <div className="reveal rv-rise">
              <h4 className="blog-title">{section.title}</h4>
              <p className="blog-sub">{section.subtitle}</p>
            </div>
            <div className="blog-grid">
              {data.news.map((item, i) => (
                <motion.article
                  key={item._id}
                  custom={i}
                  variants={cardIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ amount: 0.2, margin: "0px 0px -70px 0px" }}
                  whileHover={{ y: -8 }}
                  className="blog-card"
                >
                  <img className="blog-photo" src={item.image} alt={item.title} loading="lazy" />
                  <div className="blog-tags">{item.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  <h4>{item.title}</h4>
                  <p className="blog-text">{item.excerpt}</p>
                  <a className="keiki-more" href={`/news/${item.slug}`}>കൂടുതൽ വായിക്കാം <ArrowRight size={14} /></a>
                </motion.article>
              ))}
            </div>
            <div className="news-cta"><a href="/news" className="btn btn-green">എല്ലാ വാർത്തകളും കാണാം <ArrowRight size={15} /></a></div>
          </div>
        </div>
      </div>
    </section>
  );
}
