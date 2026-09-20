"use client";
import { motion } from "framer-motion";
import { Leaf, Sprout, Palette, BookOpen, TreePine } from "lucide-react";
import { Sun, TreeHouse, Kite, Butterfly, Flower, Kid } from "@/components/home/HeroArt";
import type { SectionProps } from "@/components/home/section-types";

// The three badge icons stay fixed; only the labels come from settings.hero.badges.
const BADGE_ICONS = [Palette, BookOpen, TreePine];

export default function Hero({ data }: SectionProps) {
  const { hero } = data.settings;
  const badges = hero.badges ?? [];
  const B0 = BADGE_ICONS[0], B1 = BADGE_ICONS[1], B2 = BADGE_ICONS[2];
  return (
    <div className="wrap">
      <section className="hero">
        <div className="hero-frame">
          <span className="vine" style={{ left: -30, top: 150 }}><Leaf size={22} /><br /><Sprout size={18} /></span>
          <span className="vine" style={{ right: -26, top: 190, animationDelay: "-1.5s" }}><Leaf size={22} /><br /><Sprout size={18} /></span>
          <motion.div initial={{ scale: 0.965, opacity: 0, y: 18 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: "easeOut" }} className="hero-blob">
            <Sun />
            <span className="cloud c1" /><span className="cloud c2" /><span className="cloud c3" />
            <Kite left="13%" top="10%" c1="#22b8cf" c2="#ffd43b" delay="0s" />
            <Kite left="28%" top="7%" c1="#69db7c" c2="#ffffff" delay="-1.4s" s={0.72} />
            <Kite left="48%" top="14%" c1="#ff7a2f" c2="#2f9df0" delay="-2.2s" s={0.6} />
            <Butterfly color="#ff9f1c" left="15%" top="34%" delay="-1s" />
            <Butterfly color="#8b5cf6" left="42%" top="13%" delay="-2.4s" scale={0.9} />
            <Butterfly color="#2f9df0" left="57%" top="26%" delay="-.6s" scale={0.8} />
            <Butterfly color="#f4558d" left="66%" top="38%" delay="-3s" scale={0.75} />
            <span className="bird" style={{ left: "38%", top: "20%", animationDelay: "-2s" }}>﹏</span>
            <span className="bird" style={{ left: "44%", top: "23%", animationDelay: "-4s", fontSize: 12 }}>﹏</span>
            <div className="hero-badges" style={{ left: 22, bottom: 108 }}>
              {badges[0] && <span className="hero-badge"><B0 size={13} /> {badges[0]}</span>}
              {badges[1] && <span className="hero-badge" style={{ animationDelay: "-1.2s" }}><B1 size={13} /> {badges[1]}</span>}
            </div>
            <div className="hero-badges" style={{ right: 210, top: 26 }}>
              {badges[2] && <span className="hero-badge" style={{ animationDelay: "-2s" }}><B2 size={13} /> {badges[2]}</span>}
            </div>
            <TreeHouse />
            <div className="hero-title">
              <div className="over">{hero.over}</div>
              <img className="hero-logo" src="/logo-new.png" alt="മലർവാടി — ബാലസംഘം" width={557} height={154} />
              <div className="under">{hero.under}</div>
            </div>
            <div className="hero-kids">
              <Kid variant={0} />
              <Kid variant={1} />
              <Kid variant={2} />
              <Kid variant={3} />
            </div>
            <div className="grass" />
            <div className="flower-row">
              <Flower delay="0s" size={28} /><Flower delay="-.8s" size={20} /><Flower delay="-1.6s" size={30} /><Flower delay="-.4s" size={22} /><Flower delay="-2s" size={26} /><Flower delay="-1s" size={20} /><Flower delay="-2.4s" size={24} /><Flower delay="-.6s" size={22} /><Flower delay="-1.8s" size={26} /><Flower delay="-2.8s" size={20} />
            </div>
          </motion.div>
        </div>
        <div className="hero-dots"><i /><i /><i className="on" /><i /><i /></div>
      </section>
    </div>
  );
}
