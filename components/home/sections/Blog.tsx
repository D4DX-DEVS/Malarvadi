"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { SectionProps } from "@/components/home/section-types";

export default function Blog({ data, section }: SectionProps) {
  if (!data.blog.length) return null;
  return (
    <section className="blog-band">
      <div className="wrap reveal rv-flip">
        <h4 className="blog-title">{section.title}</h4>
        <p className="blog-sub">{section.subtitle}</p>
        <div className="blog-grid">
          {data.blog.map((post) => (
            <motion.article key={post._id} whileHover={{ y: -8 }} className="blog-card">
              <img className="blog-photo" src={post.image} alt={post.title} loading="lazy" />
              <div className="blog-tags">{post.tags.map((t) => <span key={t}>{t}</span>)}</div>
              <h4>{post.title}</h4>
              <a className="keiki-more" href={`/blog/${post.slug}`}>വായിക്കാം <ArrowRight size={14} /></a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
