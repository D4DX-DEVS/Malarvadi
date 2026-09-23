"use client";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import type { MonthlyProgram } from "@/lib/types";

export default function MonthlyProgramsListView({ items }: { items: MonthlyProgram[] }) {
  return (
    <div className="page page-inner">
      <Header />
      <div className="wrap">
        <PageHero kicker="മാസംതോറും • Monthly Programs" title="എല്ലാ മാസത്തെ പരിപാടികളും" sub="ഓരോ മാസത്തെയും പ്രത്യേക പരിപാടികളും അനുഭവങ്ങളും ഒരിടത്ത്." icon={<CalendarDays size={56} strokeWidth={1.8} />} />
        {items.length > 0 ? (
          <div className="blog-grid" style={{ marginBottom: 40 }}>
            {items.map((item, i) => (
              <motion.a
                key={item._id} href={`/monthly-programs/${item.slug}`} className="blog-card card-link"
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 3) * 0.08 }} whileHover={{ y: -8 }}
              >
                {item.image && <img className="blog-photo" src={item.image} alt={item.title} loading="lazy" />}
                <div className="blog-tags"><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><CalendarDays size={12} /> {item.month} {item.year}</span></div>
                <h4>{item.title}</h4>
                <p className="blog-text">{item.desc}</p>
                <span className="keiki-more" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>കൂടുതൽ അറിയാം <ArrowRight size={14} /></span>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="sub-card empty-card" style={{ marginBottom: 40 }}>
            <h4>പരിപാടികൾ ഉടൻ വരും</h4>
            <p>ഈ മാസത്തെ പരിപാടികൾ വൈകാതെ ഇവിടെ കാണാം.</p>
          </div>
        )}
      </div>
      <CTABand /><Footer />
    </div>
  );
}
