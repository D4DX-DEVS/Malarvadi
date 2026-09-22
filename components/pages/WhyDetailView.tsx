"use client";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Header, Footer, CTABand } from "@/components/site";
import { Icon } from "@/components/icons";
import RichBody from "./RichBody";
import type { Feature } from "@/lib/types";

/**
 * The card's description, laid out the way it was typed.
 *
 * The admin field is a plain textarea and the copy in it is written as a lead
 * line followed by "." bullets; collapsing that into one paragraph - which is
 * what a bare {text} does - runs the whole list together.
 */
function Lead({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (!bullets.length) return;
    out.push(<ul key={`u${out.length}`} className="why-list">{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>);
    bullets = [];
  };
  for (const raw of text.split(/\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const bullet = /^[.\-•*]\s+/.test(line);
    if (bullet) { bullets.push(line.replace(/^[.\-•*]\s+/, "")); continue; }
    flush();
    out.push(<p key={`p${out.length}`} className="why-lead">{line}</p>);
  }
  flush();
  return <>{out}</>;
}

/**
 * One reason from the "Why Malarvadi" strip, on a page of its own.
 *
 * The card's tone class comes along so the page wears the same colour the
 * visitor clicked on the home page.
 */
export default function WhyDetailView({ item, others }: { item: Feature; others: Feature[] }) {
  return (
    <div className="page page-inner">
      <Header />

      <section className={`why-hero ${item.tone}`}>
        <div className="why-deco" aria-hidden="true"><i className="wb b1" /><i className="wb b2" /><i className="wb b3" /></div>
        <div className="wrap why-hero-grid">
          <motion.div className="why-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
            <span className="why-badge"><Sparkles size={14} strokeWidth={2.2} /> എന്തുകൊണ്ട് മലർവാടി?</span>
            <h1 className="why-title">{item.title}</h1>
            {item.desc && <Lead text={item.desc} />}
          </motion.div>
          <motion.div className="why-visual" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55, delay: .1 }}>
            {item.image
              ? <span className="why-photo"><img src={item.image} alt="" aria-hidden loading="lazy" /></span>
              : <span className="why-icon"><Icon name={item.icon} size={76} strokeWidth={1.6} /></span>}
          </motion.div>
        </div>
      </section>

      <div className="wrap">
        {item.body && (
          <motion.article className="why-body-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}>
            <RichBody className="why-body" body={item.body} />
          </motion.article>
        )}

        <div className="article-actions" style={{ margin: "0 0 12px" }}>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: .96 }} href="/#features" className="btn btn-green"><ArrowLeft size={15} /> എല്ലാ കാരണങ്ങളും</motion.a>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: .96 }} href="/programs" className="btn btn-pink">പരിപാടികൾ കാണാം <ArrowRight size={15} /></motion.a>
        </div>

        {others.length > 0 && (
          <div className="more-strip">
            <div className="section-head"><h4>മറ്റ് കാരണങ്ങൾ</h4></div>
            <div className="prog-detail">
              {others.map((o, i) => (
                <motion.a
                  key={o._id}
                  href={`/why/${o.slug}`}
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.07 }} whileHover={{ y: -6 }}
                  className={`sub-card card-link why-more ${o.tone}`}
                >
                  <span className="big"><Icon name={o.icon} size={34} strokeWidth={1.7} /></span>
                  <h4 style={{ fontSize: 18 }}>{o.title}</h4>
                  {o.desc && <p style={{ fontSize: 14.5 }}>{o.desc}</p>}
                  <p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 800, color: "#1f5b4d", display: "flex", alignItems: "center", gap: 6 }}>കൂടുതൽ അറിയാം <ArrowRight size={13} /></p>
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
