"use client";
import { Fragment } from "react";
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

export default function HomePage({ data }: { data: HomeData }) {
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

    </div>
  );
}
