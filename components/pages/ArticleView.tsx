"use client";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Megaphone, BookOpen } from "lucide-react";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import RichBody from "./RichBody";
import type { Post } from "./PostListView";

export default function ArticleView({ kind, post, others }: { kind: "news" | "blog"; post: Post; others: Post[] }) {
  const base = kind === "news" ? "/news" : "/blog";
  const kicker = kind === "news" ? "വാർത്ത • News" : "ബ്ലോഗ് • Blog";
  const readLabel = kind === "news" ? "കൂടുതൽ വായിക്കാം" : "വായിക്കാം";
  const backLabel = kind === "news" ? "എല്ലാ വാർത്തകളും" : "എല്ലാ പോസ്റ്റുകളും";
  const moreLabel = kind === "news" ? "മറ്റ് വാർത്തകൾ" : "മറ്റ് പോസ്റ്റുകൾ";
  const icon = kind === "news" ? <Megaphone size={56} strokeWidth={1.8} /> : <BookOpen size={56} strokeWidth={1.8} />;
  return (
    <div className="page page-inner">
      <Header />
      <div className="wrap">
        <PageHero kicker={kicker} title={post.title} sub="" icon={icon} />
        <article className="article article-full">
          <div className="article-card">
            {post.image && (
              <div className="article-hero-frame">
                <motion.img className="article-hero" src={post.image} alt={post.title} initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .5 }} />
              </div>
            )}
            <RichBody className="article-body" body={post.body || post.excerpt} />
            <div className="article-actions">
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: .96 }} href={base} className="btn btn-green"><ArrowLeft size={15} /> {backLabel}</motion.a>
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: .96 }} href="/contact" className="btn btn-pink">ബന്ധപ്പെടാം <ArrowRight size={15} /></motion.a>
            </div>
          </div>
        </article>

        {others.length > 0 && (
          <div className="more-strip">
            <div className="section-head"><h4>{moreLabel}</h4></div>
            <div className="blog-grid">
              {others.map((o, i) => (
                <motion.a key={o._id} href={`${base}/${o.slug}`} className="blog-card card-link" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -8 }}>
                  {o.image && <img className="blog-photo" src={o.image} alt={o.title} loading="lazy" />}
                  {kind === "blog" && (
                    <div className="blog-tags">{(o.tags || []).map((t) => <span key={t}>{t}</span>)}</div>
                  )}
                  <h4>{o.title}</h4>
                  <p className="blog-text">{o.excerpt}</p>
                  <span className="keiki-more" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{readLabel} <ArrowRight size={14} /></span>
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
