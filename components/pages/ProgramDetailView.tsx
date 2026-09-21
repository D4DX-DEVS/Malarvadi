"use client";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import { Icon } from "@/components/icons";
import { paragraphs } from "./format";
import type { Program } from "@/lib/types";

export default function ProgramDetailView({ program, others }: { program: Program; others: Program[] }) {
  const body = paragraphs(program.body || program.desc);
  return (
    <div className="page">
      <Header />
      <div className="wrap">
        <PageHero kicker="പരിപാടി • Program" title={program.title} sub={program.tagline} icon={<Icon name={program.icon} size={56} strokeWidth={1.8} />} />
        <div className="sub-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sub-card">
            <h4><Sparkles size={20} /> {program.title}</h4>
            {body.length ? body.map((para, i) => <p key={i}>{para}</p>) : <p>{program.desc}</p>}
            <span className="meta-pill" style={{ background: "#fff7dd" }}>{program.meta}</span>
          </motion.div>
          {program.image ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="sub-card" style={{ overflow: "hidden", padding: 0 }}>
              <img src={program.image} alt={program.title} style={{ height: 300, width: "100%", objectFit: "cover" }} />
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="sub-card" style={{ background: program.color, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
              <span className="big"><Icon name={program.icon} size={64} strokeWidth={1.6} /></span>
              <p>{program.desc}</p>
            </motion.div>
          )}
        </div>

        <div className="article-actions" style={{ margin: "0 0 12px" }}>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: .96 }} href="/programs" className="btn btn-green"><ArrowLeft size={15} /> എല്ലാ പരിപാടികളും</motion.a>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: .96 }} href="/contact" className="btn btn-pink">പങ്കെടുക്കാൻ ബന്ധപ്പെടൂ <ArrowRight size={15} /></motion.a>
        </div>

        {others.length > 0 && (
          <div className="more-strip">
            <div className="section-head"><h4>മറ്റ് പരിപാടികൾ</h4></div>
            <div className="prog-detail">
              {others.map((o, i) => (
                <motion.a key={o._id} href={`/programs/${o.slug}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -6 }} className="sub-card card-link" style={{ background: o.color }}>
                  <span className="big"><Icon name={o.icon} size={34} strokeWidth={1.7} /></span>
                  <h4 style={{ fontSize: 17 }}>{o.title}</h4>
                  <p style={{ fontSize: 12.5 }}>{o.tagline}</p>
                  <p style={{ margin: "8px 0 0", fontSize: 12, fontWeight: 800, color: "#1f5b4d", display: "flex", alignItems: "center", gap: 6 }}>കൂടുതൽ അറിയാം <ArrowRight size={13} /></p>
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
