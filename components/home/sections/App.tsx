"use client";
import { motion } from "framer-motion";
import { Sparkles, Apple } from "lucide-react";
import type { SectionProps } from "@/components/home/section-types";

export default function App({ data }: SectionProps) {
  const { app } = data.settings;
  const [before, after = ""] = app.title.split("{highlight}");
  return (
    <section className="app-band">
      <span className="app-cloud c1" aria-hidden /><span className="app-cloud c2" aria-hidden />
      <div className="wrap app-inner">
        <div className="app-visual reveal rv-left">
          <span className="app-phone" aria-hidden>
            <img src={app.image || "/zaitoon.png"} alt="" />
            <b>ZaiToon</b>
            <small>കഥ • പാട്ട് • കാർട്ടൂൺ</small>
          </span>
          <img className="app-kid-l" src="/kid-left.png" alt="" aria-hidden />
        </div>
        <div className="app-copy reveal rv-zoom">
          <motion.span initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} className="app-eyebrow"><Sparkles size={13} /> {app.eyebrow}</motion.span>
          <h4 className="app-title">{before}<span>{app.highlight}</span>{after}</h4>
          <p className="app-sub">{app.body}</p>
          <div className="app-badges">
            <motion.a whileHover={{ y: -4 }} whileTap={{ scale: .96 }} className="store-badge" href={app.appStore} target="_blank" rel="noreferrer" aria-label="Download on the App Store">
              <Apple size={24} />
              <span><small>Download on the</small><b>App Store</b></span>
            </motion.a>
            <motion.a whileHover={{ y: -4 }} whileTap={{ scale: .96 }} className="store-badge" href={app.playStore} target="_blank" rel="noreferrer" aria-label="Get it on Google Play">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                <path d="M3.2 2.4 14.6 12 3.2 21.6Z" fill="#00c3ff" />
                <path d="M3.2 2.4 14.6 12l3.9-3.7Z" fill="#00e676" />
                <path d="M3.2 21.6 14.6 12l3.9 3.7Z" fill="#ff3d00" />
                <path d="M18.5 8.3 21.3 11a1.3 1.3 0 0 1 0 2l-2.8 2.7L14.6 12Z" fill="#ffc107" />
              </svg>
              <span><small>GET IT ON</small><b>Google Play</b></span>
            </motion.a>
          </div>
        </div>
        <div className="app-visual reveal rv-right">
          <img className="app-kid-r" src="/kid-right.png" alt="" aria-hidden />
        </div>
      </div>
      <span className="app-grass" aria-hidden />
    </section>
  );
}
