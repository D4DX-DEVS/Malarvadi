"use client";
import { motion } from "framer-motion";
import { Megaphone, ArrowRight } from "lucide-react";
import type { SectionProps } from "@/components/home/section-types";

export default function News({ data, section }: SectionProps) {
  if (!data.news.length) return null;
  return (
    <section id="news" className="blog-band news-band reveal">
      <div className="wrap">
        <span className="news-kicker" aria-hidden><Megaphone size={18} /></span>
        <h4 className="blog-title">{section.title}</h4>
        <p className="blog-sub">{section.subtitle}</p>
        <div className="blog-grid">
          {data.news.map((item) => (
            <motion.article key={item._id} whileHover={{ y: -8 }} className="blog-card">
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
    </section>
  );
}
