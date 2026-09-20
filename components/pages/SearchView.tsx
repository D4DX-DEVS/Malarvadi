"use client";
import { motion } from "framer-motion";
import { Search, ArrowRight, Megaphone, BookOpen, CalendarHeart } from "lucide-react";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import { Icon } from "@/components/icons";
import { longDate } from "./format";
import type { Post } from "./PostListView";
import type { Program } from "@/lib/types";

export interface SearchResults { news: Post[]; blog: Post[]; programs: Program[] }

function PostRow({ base, post, label }: { base: string; post: Post; label: string }) {
  return (
    <motion.a href={`${base}/${post.slug}`} className="blog-card card-link" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6 }}>
      <div className="blog-tags">{(post.tags || []).map((t) => <span key={t}>{t}</span>)}</div>
      <small style={{ display: "block", fontSize: 11.5, fontWeight: 800, color: "#6b7194", marginBottom: 6 }}>{longDate(post.date)}</small>
      <h4 style={{ fontSize: 19 }}>{post.title}</h4>
      <p className="blog-text">{post.excerpt}</p>
      <span className="keiki-more" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{label} <ArrowRight size={14} /></span>
    </motion.a>
  );
}

export default function SearchView({ q, results }: { q: string; results: SearchResults }) {
  const total = results.news.length + results.blog.length + results.programs.length;
  return (
    <div className="page">
      <Header />
      <div className="wrap">
        <PageHero kicker="തിരയുക • Search" title={q ? `"${q}"` : "എന്ത് തിരയണം?"} sub="വാർത്തകൾ, ബ്ലോഗ്, പരിപാടികൾ — എല്ലാം ഒരിടത്ത് തിരയാം." icon={<Search size={56} strokeWidth={1.8} />} />
        <div className="form-card" style={{ marginBottom: 26 }}>
          <form className="search-form" action="/search" method="get" style={{ margin: 0 }}>
            <input name="q" defaultValue={q} placeholder="എന്ത് തിരയണം?" aria-label="Search" />
            <button className="btn btn-green" type="submit"><Search size={15} /> തിരയൂ</button>
          </form>
        </div>

        {q && <p className="search-count">{total} ഫലങ്ങൾ കണ്ടെത്തി</p>}

        {q && total === 0 && (
          <div className="sub-card empty-card" style={{ marginBottom: 40 }}>
            <h4>ഒന്നും കണ്ടെത്തിയില്ല</h4>
            <p>മറ്റൊരു വാക്ക് ഉപയോഗിച്ച് വീണ്ടും തിരയൂ.</p>
          </div>
        )}

        {results.programs.length > 0 && (
          <section style={{ marginBottom: 12 }}>
            <div className="section-head"><h4><CalendarHeart size={18} /> പരിപാടികൾ</h4></div>
            <div className="prog-detail">
              {results.programs.map((p, i) => (
                <motion.a key={p._id} href={`/programs/${p.slug}`} className="sub-card card-link" style={{ background: p.color }} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.06 }} whileHover={{ y: -6 }}>
                  <span className="big"><Icon name={p.icon} size={34} strokeWidth={1.7} /></span>
                  <h4 style={{ fontSize: 18 }}>{p.title}</h4>
                  <p style={{ fontSize: 12.5 }}>{p.desc}</p>
                  <span className="meta-pill">{p.meta}</span>
                </motion.a>
              ))}
            </div>
          </section>
        )}

        {results.news.length > 0 && (
          <section>
            <div className="section-head"><h4><Megaphone size={18} /> വാർത്തകൾ</h4></div>
            <div className="result-list">
              {results.news.map((n) => <PostRow key={n._id} base="/news" post={n} label="കൂടുതൽ വായിക്കാം" />)}
            </div>
          </section>
        )}

        {results.blog.length > 0 && (
          <section>
            <div className="section-head"><h4><BookOpen size={18} /> ബ്ലോഗ്</h4></div>
            <div className="result-list">
              {results.blog.map((b) => <PostRow key={b._id} base="/blog" post={b} label="വായിക്കാം" />)}
            </div>
          </section>
        )}
      </div>
      <CTABand /><Footer />
    </div>
  );
}
