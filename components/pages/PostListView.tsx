"use client";
import { motion } from "framer-motion";
import { ArrowRight, Megaphone, BookOpen } from "lucide-react";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import { longDate } from "./format";
import type { BlogPost, NewsItem } from "@/lib/types";

export type Post = NewsItem | BlogPost;

export default function PostListView({ kind, page, posts }: {
  kind: "news" | "blog";
  page: { kicker: string; title: string; sub: string };
  posts: Post[];
}) {
  const base = kind === "news" ? "/news" : "/blog";
  const readLabel = kind === "news" ? "കൂടുതൽ വായിക്കാം" : "വായിക്കാം";
  const icon = kind === "news" ? <Megaphone size={56} strokeWidth={1.8} /> : <BookOpen size={56} strokeWidth={1.8} />;
  return (
    <div className="page page-inner">
      <Header />
      <div className="wrap">
        <PageHero kicker={page.kicker} title={page.title} sub={page.sub} icon={icon} />
        {posts.length > 0 ? (
          <div className="blog-grid" style={{ marginBottom: 40 }}>
            {posts.map((post, i) => (
              <motion.a
                key={post._id} href={`${base}/${post.slug}`} className="blog-card card-link"
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 3) * 0.08 }} whileHover={{ y: -8 }}
              >
                {post.image && <img className="blog-photo" src={post.image} alt={post.title} loading="lazy" />}
                <div className="blog-tags">
                  {(post.tags || []).map((t) => <span key={t}>{t}</span>)}
                </div>
                <small style={{ display: "block", fontSize: 12.5, fontWeight: 800, color: "#6b7194", marginBottom: 6 }}>{longDate(post.date)}</small>
                <h4>{post.title}</h4>
                <p className="blog-text">{post.excerpt}</p>
                <span className="keiki-more" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{readLabel} <ArrowRight size={14} /></span>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="sub-card empty-card" style={{ marginBottom: 40 }}>
            <h4>{kind === "news" ? "വാർത്തകൾ ഉടൻ വരും" : "ബ്ലോഗ് പോസ്റ്റുകൾ ഉടൻ വരും"}</h4>
            <p>പുതിയ വിശേഷങ്ങൾ വൈകാതെ ഇവിടെ കാണാം.</p>
          </div>
        )}
      </div>
      <CTABand /><Footer />
    </div>
  );
}
