"use client";
import { Fragment, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Heart, Star } from "lucide-react";
import { Header, Footer, CTABand, Ticker } from "@/components/site";
import JoinPopup from "@/components/home/JoinPopup";
import CharacterGuide from "@/components/home/CharacterGuide";
import type { SectionProps } from "@/components/home/section-types";
import type { HomeData, HomeSectionKey } from "@/lib/types";

import Hero from "@/components/home/sections/Hero";
import ProgramsStrip from "@/components/home/sections/ProgramsStrip";
import About from "@/components/home/sections/About";
import Stats from "@/components/home/sections/Stats";
import News from "@/components/home/sections/News";
import Videos from "@/components/home/sections/Videos";
import Posters from "@/components/home/sections/Posters";
import Gallery from "@/components/home/sections/Gallery";
import Features from "@/components/home/sections/Features";
import AppSection from "@/components/home/sections/App";
import Blog from "@/components/home/sections/Blog";
import Join from "@/components/home/sections/Join";

/** key → component. Order/visibility comes from data.sections (admin-editable). */
const SECTIONS: Record<HomeSectionKey, React.ComponentType<SectionProps>> = {
  hero: Hero,
  programs: ProgramsStrip,
  about: About,
  stats: Stats,
  news: News,
  videos: Videos,
  posters: Posters,
  gallery: Gallery,
  features: Features,
  app: AppSection,
  blog: Blog,
  join: Join,
};

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    // Toggle (not add) so a segment re-plays its intro every time it
    // scrolls back in. The negative bottom margin delays the trigger
    // until the segment is properly on screen, and lets tall segments
    // stay revealed until they have fully scrolled away.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("in", e.isIntersecting)),
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function HomePage({ data }: { data: HomeData }) {
  useReveal();
  // The hero covers the first viewport only while it is the first thing on the
  // page: then the nav floats over it and the ticker moves below it. If an
  // admin reorders or disables the hero, everything stays in normal flow.
  const firstIndex = data.sections.findIndex((s) => s.enabled !== false && SECTIONS[s.key]);
  const heroLeads = firstIndex !== -1 && data.sections[firstIndex].key === "hero";
  return (
    <div className="page">
      <div className="bg-doodles" aria-hidden>
        <Leaf size={26} style={{ left: "2.5%", top: "22%", animation: "floaty 5s ease-in-out infinite" }} />
        <Leaf size={22} style={{ right: "3.5%", top: "30%", animation: "floaty 6s ease-in-out infinite" }} />
        <Heart size={48} style={{ right: "5%", top: "47%", animation: "floaty 6.5s ease-in-out infinite", opacity: .35 }} />
        <Heart size={14} style={{ right: "4.5%", top: "52%", animation: "twinkle 2.5s ease-in-out infinite" }} />
        <Star size={20} style={{ left: "1.5%", top: "62%", animation: "twinkle 3s ease-in-out infinite" }} />
      </div>

      <Header overlay={heroLeads} />
      <CharacterGuide />

      {data.sections.map((section, i) => {
        if (section.enabled === false) return null;
        const C = SECTIONS[section.key];
        if (!C) return null;
        return (
          <Fragment key={section._id}>
            <C data={data} section={section} />
            {i === firstIndex && <Ticker />}
          </Fragment>
        );
      })}

      {firstIndex === -1 && <Ticker />}

      <CTABand />

      <Footer />

      <JoinPopup />

      <motion.a href="#" className="to-top" onClick={(e)=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});}} whileHover={{ scale: 1.12, rotate: -8 }} style={{ position: "fixed", right: 16, bottom: 16, zIndex: 60, width: 48, height: 48, borderRadius: "50%", background: "#ef3f3f", color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 14px 28px rgba(239,63,63,.4)", fontWeight:800, border:"3px solid #fff" }}>↑</motion.a>
    </div>
  );
}
