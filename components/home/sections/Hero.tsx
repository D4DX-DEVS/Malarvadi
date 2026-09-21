"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Palette, BookOpen, TreePine, Cloud, Rainbow, Star } from "lucide-react";
import type { SectionProps } from "@/components/home/section-types";

// The three badge icons stay fixed; only the labels come from settings.hero.badges.
const BADGE_ICONS = [Palette, BookOpen, TreePine];

export default function Hero({ data }: SectionProps) {
  const { hero } = data.settings;
  const badges = hero.badges ?? [];
  const reduce = useReducedMotion();
  const B0 = BADGE_ICONS[0], B1 = BADGE_ICONS[1], B2 = BADGE_ICONS[2];
  return (
    <section className="hero hero-bleed">
      <div className="hero-frame">
        <div className="hero-blob">
          <div className="hero-art" aria-hidden="true">
            <motion.div
              className="hero-art-in"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.16 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={reduce ? { duration: 0.3 } : { duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {hero.image ? (
                <img className="hero-scene" src={hero.image} alt="" fetchPriority="high" decoding="async" />
              ) : (
                <img
                  className="hero-scene"
                  src="/hero-scene-full.jpg"
                  srcSet="/hero-scene-mobile.jpg 990w, /hero-scene-full.jpg 1983w"
                  sizes="100vw"
                  alt=""
                  fetchPriority="high"
                  decoding="async"
                />
              )}
            </motion.div>
          </div>
          <div className="hero-atmosphere" aria-hidden="true">
            <span className="hero-shape hero-shape-star"><Star size={30} fill="#f7b41e" /></span>
            <span className="hero-shape hero-shape-rainbow"><Rainbow size={46} /></span>
            <span className="hero-shape hero-shape-cloud"><Cloud size={36} /></span>
          </div>
          <motion.div
            className="hero-title-in"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 34 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0.3 } : { duration: 0.8, delay: 0.32, ease: "easeOut" }}
          >
            <div className="hero-title">
              <div className="over">{hero.over}</div>
              <img className="hero-logo" src="/logo-new.png" alt="മലർവാടി — ബാലസംഘം" width={557} height={154} />
              <div className="under">{hero.under}</div>
              <div className="hero-badges">
                {badges[0] && <span className="hero-badge"><B0 size={13} /> {badges[0]}</span>}
                {badges[1] && <span className="hero-badge" style={{ animationDelay: "-1.2s" }}><B1 size={13} /> {badges[1]}</span>}
                {badges[2] && <span className="hero-badge" style={{ animationDelay: "-2s" }}><B2 size={13} /> {badges[2]}</span>}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="hero-kids"
            aria-hidden="true"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 44 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0.3 } : { duration: 0.75, delay: 0.5, ease: "easeOut" }}
          >
            <img className="hero-kid hero-kid-left" src="/kid-left.png" alt="" />
            <img className="hero-kid hero-kid-right" src="/kid-right.png" alt="" />
          </motion.div>
        </div>
      </div>
      <div className="hero-dots"><i /><i /><i className="on" /><i /><i /></div>
    </section>
  );
}
