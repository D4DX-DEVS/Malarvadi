"use client";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import RichBody from "./RichBody";
import type { MonthlyProgram } from "@/lib/types";

export default function MonthlyProgramDetailView({ item, others }: { item: MonthlyProgram; others: MonthlyProgram[] }) {
  return (
    <div className="page page-inner">
      <Header />
      <div className="wrap">
        <PageHero kicker="ഈ മാസത്തെ പരിപാടി" title={item.title} sub={`${item.month} ${item.year}`} icon={<CalendarDays size={56} strokeWidth={1.8} />} />
        <motion.article className="article article-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
          {item.image && <img className="article-hero" src={item.image} alt={item.title} />}
          <span className="article-date"><CalendarDays size={13} /> {item.month} {item.year}</span>
          <RichBody className="article-body" body={item.body || item.desc} />
        </motion.article>

        {others.length > 0 && (
          <div className="more-strip">
            <div className="section-head"><h4>മറ്റ് പരിപാടികൾ</h4></div>
            <div className="blog-grid">
              {others.map((o, i) => (
                <motion.a key={o._id} href={`/monthly-programs/${o.slug}`} className="blog-card card-link" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -8 }}>
                  {o.image && <img className="blog-photo" src={o.image} alt={o.title} loading="lazy" />}
                  <div className="blog-tags"><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><CalendarDays size={12} /> {o.month} {o.year}</span></div>
                  <h4>{o.title}</h4>
                  <p className="blog-text">{o.desc}</p>
                  <span className="keiki-more" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>കൂടുതൽ അറിയാം <ArrowRight size={14} /></span>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>
      <CTABand /><Footer />
    </div>
  );
}
