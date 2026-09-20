"use client";
import { Star, Sparkles } from "lucide-react";
import { Icon } from "@/components/icons";
import CountUp from "@/components/home/CountUp";
import type { SectionProps } from "@/components/home/section-types";

export default function Stats({ data }: SectionProps) {
  const stats = data.settings.stats ?? [];
  if (!stats.length) return null;
  return (
    <div className="wrap">
      <section className="stats reveal">
        <Star className="star" size={22} style={{ right: 18, top: -14 }} />
        <Sparkles className="star" size={16} style={{ left: 32, bottom: -12 }} />
        {stats.map((s) => (
          <div key={s.label} className={`stat ${s.tone}`}>
            <span className="ic"><Icon name={s.icon} size={24} /></span>
            <span><b><CountUp to={s.value} suffix={s.suffix} /></b><small>{s.label}</small></span>
          </div>
        ))}
      </section>
    </div>
  );
}
