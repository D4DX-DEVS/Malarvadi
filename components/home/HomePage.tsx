"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Heart, Star } from "lucide-react";
import { Header, Footer, CTABand, Ticker } from "@/components/site";
import JoinPopup from "@/components/home/JoinPopup";
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
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function HomePage({ data }: { data: HomeData }) {
  useReveal();
  return (
    <div className="page">
      <div className="bg-doodles" aria-hidden>
        <Leaf size={26} style={{ left: "2.5%", top: "22%", animation: "floaty 5s ease-in-out infinite" }} />
        <Leaf size={22} style={{ right: "3.5%", top: "30%", animation: "floaty 6s ease-in-out infinite" }} />
        <Heart size={48} style={{ right: "5%", top: "47%", animation: "floaty 6.5s ease-in-out infinite", opacity: .35 }} />
        <Heart size={14} style={{ right: "4.5%", top: "52%", animation: "twinkle 2.5s ease-in-out infinite" }} />
        <Star size={20} style={{ left: "1.5%", top: "62%", animation: "twinkle 3s ease-in-out infinite" }} />
      </div>

      <Header />
      <Ticker />

      {data.sections.map((section) => {
        if (section.enabled === false) return null;
        const C = SECTIONS[section.key];
        if (!C) return null;
        return <C key={section._id} data={data} section={section} />;
      })}

      <CTABand />

      <Footer />

      <JoinPopup />

      <motion.a href="#" className="to-top" onClick={(e)=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});}} whileHover={{ scale: 1.12, rotate: -8 }} style={{ position: "fixed", right: 16, bottom: 16, zIndex: 60, width: 48, height: 48, borderRadius: "50%", background: "#f4558d", color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 14px 28px rgba(244,85,141,.4)", fontWeight:800, border:"3px solid #fff" }}>↑</motion.a>
    </div>
  );
}
