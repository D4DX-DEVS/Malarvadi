"use client";
import { motion } from "framer-motion";
import { Palette, CalendarDays, ArrowRight } from "lucide-react";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import { Icon } from "@/components/icons";
import { shortDate } from "./format";
import type { EventItem, Program, SiteSettings } from "@/lib/types";

export default function ProgramsView({ settings, programs, events }: { settings: SiteSettings; programs: Program[]; events: EventItem[] }) {
  const p = settings.pages.programs;
  return (
    <div className="page">
      <Header />
      <div className="wrap">
        <PageHero kicker={p.kicker} title={p.title} sub={p.sub} icon={<Palette size={56} strokeWidth={1.8} />} />
        {programs.length > 0 ? (
          <div className="prog-detail">
            {programs.map((item, i) => (
              <motion.a
                key={item._id}
                href={`/programs/${item.slug}`}
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 3) * 0.08 }} whileHover={{ y: -6, rotate: -0.5 }}
                className="sub-card card-link" style={{ background: item.color }}
              >
                <span className="big"><Icon name={item.icon} size={46} strokeWidth={1.7} /></span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
                <span className="meta-pill">{item.meta}</span>
                <p style={{ margin: "10px 0 0", fontSize: 12.5, fontWeight: 800, color: "#1f5b4d", display: "flex", alignItems: "center", gap: 6 }}>
                  കൂടുതൽ അറിയാം <ArrowRight size={14} />
                </p>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="sub-card empty-card"><h4>പരിപാടികൾ ഉടൻ ചേർക്കും</h4><p>പുതിയ പരിപാടികൾ വൈകാതെ ഇവിടെ കാണാം.</p></div>
        )}

        <div className="sub-card" style={{ background: "#0a3d2e", color: "#d8efe3", borderColor: "#0a3d2e" }}>
          <h4 style={{ color: "#ffd23f", display: "flex", alignItems: "center", gap: 7 }}><CalendarDays size={20} /> ഈ മാസത്തെ കലണ്ടർ</h4>
          {events.length > 0 ? (
            <ul style={{ listStyle: "none", margin: "6px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {events.map((ev) => (
                <li key={ev._id} style={{ color: "#bfe3cf", fontSize: 13.5, lineHeight: 1.6 }}>
                  <b style={{ color: "#ffd23f" }}>{shortDate(ev.date)}</b> — {ev.title}
                  {ev.note ? <small style={{ display: "block", color: "#94c8ad" }}>{ev.note}</small> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#bfe3cf" }}>ഈ മാസത്തെ പരിപാടികൾ ഉടൻ പ്രഖ്യാപിക്കും. പങ്കെടുക്കാൻ മെന്ററെ ബന്ധപ്പെടൂ.</p>
          )}
        </div>
        <div style={{ height: 16 }} />
      </div>
      <CTABand /><Footer />
    </div>
  );
}
