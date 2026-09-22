"use client";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Lightbulb, Send, Star, Sprout } from "lucide-react";
import { Header, Footer, CTABand } from "@/components/site";
import { Icon } from "@/components/icons";
import RichBody from "./RichBody";
import type { Program } from "@/lib/types";

/**
 * Two-tone programme title: first word in green, the rest in orange.
 * A single-word Malayalam title stays one colour - splitting a word mid-cluster
 * would break its combining marks.
 */
function ProgramTitle({ title }: { title: string }) {
  // The badge above already reads MALARVADI, so drop a leading brand word from
  // the title rather than printing it twice - but only when what is left still
  // reads as a name on its own. "മലർവാടി മാസിക" would otherwise become a bare
  // "മാസിക" ("magazine"), so it keeps the brand word and colours it instead.
  const full = title.trim();
  const stripped = full.replace(/^(malarvadi|മലർവാടി)\s+/i, "");
  const clean = stripped !== full && stripped.split(/\s+/).length >= 2 ? stripped : full;
  const words = clean.split(/\s+/);
  const head = words[0];
  const tail = words.slice(1).join(" ");
  return (
    <h1 className="prog-title">
      <span className="t-head">{head}</span>
      {tail && <> <span className="t-tail">{tail}</span></>}
      <svg className="prog-underline" viewBox="0 0 260 14" preserveAspectRatio="none" aria-hidden focusable="false">
        <path d="M3 9.5C60 3.5 150 2.5 257 7.5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </h1>
  );
}

export default function ProgramDetailView({ program, others }: { program: Program; others: Program[] }) {
  const tagline = program.tagline || program.desc;
  return (
    <div className="page page-inner">
      <Header />

      <section className="prog-hero">
        {/* Decorative only - doodles, blobs and leaves that frame the artwork. */}
        <div className="prog-deco" aria-hidden="true">
          <i className="blob b1" /><i className="blob b2" /><i className="blob b3" />
          <span className="doodle d-bulb"><Lightbulb size={30} strokeWidth={2} /></span>
          <span className="doodle d-plane"><Send size={26} strokeWidth={2} /></span>
          <span className="doodle d-star"><Star size={22} strokeWidth={2} /></span>
          <svg className="doodle d-arc" viewBox="0 0 160 60" fill="none" aria-hidden focusable="false">
            <path d="M2 56C26 14 74 2 158 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="7 9" />
          </svg>
          <span className="prog-leaves l-left" /><span className="prog-leaves l-right" />
        </div>

        <div className="wrap prog-hero-grid">
          <motion.div className="prog-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
            <span className="prog-badge"><Sprout size={15} strokeWidth={2.2} /> MALARVADI</span>
            <ProgramTitle title={program.title} />
            {tagline && <p className="prog-tagline">{tagline}</p>}
            <RichBody className="prog-body" body={program.body} />
            {program.meta && (
              <span className="prog-meta-pill">
                <i><Icon name={program.icon} size={15} /></i> {program.meta}
              </span>
            )}
          </motion.div>

          <motion.div className="prog-visual" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .1 }}>
            <span className={`prog-stage${program.photo ? "" : " no-photo"}`}>
              {program.slogan && <span className="prog-script s-top">{program.slogan}</span>}
              {program.image && (
                <span className="prog-logo-card">
                  <img src={program.image} alt={`${program.title} logo`} />
                </span>
              )}
              {program.photo && (
                <span className="prog-photo">
                  <img src={program.photo} alt="" aria-hidden loading="lazy" />
                </span>
              )}
              {program.slogan2 && <span className="prog-script s-bottom">{program.slogan2}</span>}
            </span>
          </motion.div>
        </div>
      </section>

      <div className="wrap">
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
                  {o.image
                    ? <span className="more-logo"><img src={o.image} alt="" aria-hidden loading="lazy" /></span>
                    : <span className="big"><Icon name={o.icon} size={34} strokeWidth={1.7} /></span>}
                  <h4 style={{ fontSize: 18 }}>{o.title}</h4>
                  {o.tagline && <p style={{ fontSize: 14 }}>{o.tagline}</p>}
                  <p style={{ margin: "8px 0 0", fontSize: 13.5, fontWeight: 800, color: "#1f5b4d", display: "flex", alignItems: "center", gap: 6 }}>കൂടുതൽ അറിയാം <ArrowRight size={13} /></p>
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
