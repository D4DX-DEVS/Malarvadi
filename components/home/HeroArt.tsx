"use client";
// Decorative hero artwork — moved verbatim out of the old app/page.tsx.
import { motion } from "framer-motion";
import { Sun as SunIcon, Flower2 } from "lucide-react";

export function Sun() {
  return (
    <div className="sun" aria-hidden>
      <svg className="sun-rays" viewBox="0 0 100 100">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const x1 = 50 + Math.cos(a) * 30, y1 = 50 + Math.sin(a) * 30;
          const x2 = 50 + Math.cos(a) * 44, y2 = 50 + Math.sin(a) * 44;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFB400" strokeWidth="5" strokeLinecap="round" />;
        })}
      </svg>
      <span className="sun-face"><SunIcon size={38} strokeWidth={2.2} fill="#ffd43b" /></span>
    </div>
  );
}

export function TreeHouse() {
  return (
    <div className="tree" aria-hidden>
      <svg viewBox="0 0 240 250" width="100%" height="100%">
        <ellipse cx="118" cy="196" rx="62" ry="12" fill="rgba(30,70,30,.18)" />
        <path d="M104 200 Q106 150 98 118 Q120 112 138 120 Q132 155 136 200 Z" fill="#8a5a2b" />
        <path d="M108 195 Q110 150 104 122" stroke="#6f451f" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".6" />
        <ellipse cx="118" cy="72" rx="102" ry="62" fill="#2f9e44" />
        <ellipse cx="62" cy="98" rx="50" ry="38" fill="#37b24d" />
        <ellipse cx="176" cy="98" rx="54" ry="39" fill="#2b8a3e" />
        <ellipse cx="118" cy="44" rx="66" ry="36" fill="#40c057" />
        <ellipse cx="82" cy="58" rx="22" ry="16" fill="#69db7c" opacity=".9" />
        <ellipse cx="158" cy="52" rx="24" ry="17" fill="#69db7c" opacity=".85" />
        <circle cx="56" cy="62" r="8" fill="#ff8787" /><circle cx="182" cy="56" r="9" fill="#ffa8a8" /><circle cx="126" cy="28" r="7" fill="#ff8787" /><circle cx="96" cy="86" r="6" fill="#ffd43b" /><circle cx="152" cy="88" r="6" fill="#ffd43b" />
        <g>
          <rect x="128" y="88" width="62" height="48" rx="8" fill="#d9a441" stroke="#6e4218" strokeWidth="3.5" />
          <rect x="128" y="88" width="62" height="48" rx="8" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".4" />
          <polygon points="121,90 159,56 197,90" fill="#e8590c" stroke="#8c2f0e" strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="121,90 159,56 159,90" fill="#ff7a2f" opacity=".9" />
          <rect x="150" y="108" width="18" height="28" rx="4" fill="#5c3510" stroke="#3d2308" strokeWidth="2" />
          <circle cx="163" cy="122" r="2.2" fill="#ffd43b" />
          <rect x="134" y="98" width="14" height="14" rx="3" fill="#fff3bf" stroke="#6e4218" strokeWidth="2" />
          <line x1="141" y1="98" x2="141" y2="112" stroke="#6e4218" strokeWidth="1.5" />
        </g>
        <line x1="162" y1="136" x2="148" y2="208" stroke="#6e4218" strokeWidth="5" strokeLinecap="round" />
        <line x1="178" y1="136" x2="192" y2="208" stroke="#6e4218" strokeWidth="5" strokeLinecap="round" />
        {[148,160,172,184,196].map((y,i)=>(<line key={y} x1={156-(i*1.2)} y1={y} x2={184-(i*1.2)} y2={y} stroke="#c99a55" strokeWidth="4" strokeLinecap="round" />))}
        <g>
          <path d="M42 134 Q118 120 196 134" stroke="#6e4218" strokeWidth="2.5" fill="none" />
          {["#ff4d7e","#ffd23f","#14b8a6","#8b5cf6","#ff7a2f","#2f9df0"].map((c,i)=>(
            <g key={c} style={{ transformOrigin: `${52+i*24}px 132px`, animation: "waveFlag 2.8s ease-in-out infinite", animationDelay: `${-i*0.35}s` }}>
              <polygon points={`${52+i*24},132 ${62+i*24},132 ${57+i*24},145`} fill={c} stroke="#fff" strokeWidth="1" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export function Kite({ left, top, c1, c2, delay, s = 1 }: { left: string; top: string; c1: string; c2: string; delay: string; s?: number }) {
  return (
    <div className="kite" style={{ left, top, animationDelay: delay, scale: s }}>
      <svg width={56} height={70} viewBox="0 0 54 66">
        <path d="M27 46 Q22 56 18 58 Q24 58 27 52 Q30 58 36 58 Q32 56 27 46" fill="#f4558d" />
        <polygon points="27,2 52,24 27,46 2,24" fill={c1} stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="27,2 52,24 27,24" fill={c2} opacity=".88" />
        <polygon points="27,2 2,24 27,24" fill="#fff" opacity=".28" />
        <line x1="27" y1="2" x2="27" y2="46" stroke="#fff" strokeWidth="1.4" opacity=".8" />
        <line x1="2" y1="24" x2="52" y2="24" stroke="#fff" strokeWidth="1.4" opacity=".8" />
      </svg>
      <span className="tail">
        <span className="bow" style={{ top: 12, background: c1 }} />
        <span className="bow" style={{ top: 30, background: c2 }} />
        <span className="bow" style={{ top: 48, background: "#fff" }} />
      </span>
    </div>
  );
}

export function Butterfly({ color = "#a78bfa", left, top, delay, scale = 1 }: { color?: string; left: string; top: string; delay: string; scale?: number }) {
  return (
    <span className="bfly" style={{ left, top, animationDelay: delay, scale }}>
      <svg width="26" height="22" viewBox="0 0 26 22">
        <g style={{ transformOrigin: "13px 11px", animation: "flapL 0.5s ease-in-out infinite" }}>
          <ellipse cx="8" cy="8" rx="7" ry="6" fill={color} stroke="#fff" strokeWidth="1.2" />
          <ellipse cx="8" cy="16" rx="5" ry="4" fill={color} opacity=".8" stroke="#fff" strokeWidth="1" />
        </g>
        <g style={{ transformOrigin: "13px 11px", animation: "flapR 0.5s ease-in-out infinite" }}>
          <ellipse cx="18" cy="8" rx="7" ry="6" fill={color} stroke="#fff" strokeWidth="1.2" opacity=".92" />
          <ellipse cx="18" cy="16" rx="5" ry="4" fill={color} opacity=".8" stroke="#fff" strokeWidth="1" />
        </g>
        <rect x="12" y="4" width="2.4" height="14" rx="1.2" fill="#3b2f2f" />
      </svg>
    </span>
  );
}

export function Flower({ delay = "0s", size = 26 }: { delay?: string; size?: number }) {
  return <span className="fl" style={{ width: size, height: size, animationDelay: delay }}><Flower2 size={size} strokeWidth={1.8} /></span>;
}

export function Kid({ variant = 0 }: { variant?: number }) {
  const skins = ["#9a5d45", "#b87858", "#c48766", "#f0b08c"];
  const hairs = ["#221410", "#2d1a12", "#3d2418", "#342018"];
  const shirts = ["#ff5d4d", "#7bc043", "#1fa7a2", "#f26a9b"];
  const pants = ["#2b4a7a", "#ff8a00", "#5b3a9e", "#0b7a72"];
  const skin = skins[variant % 4], hair = hairs[variant % 4], shirt = shirts[variant % 4], pant = pants[variant % 4];
  const isGirl = variant % 2 === 1;
  return (
    <motion.div className="kid-avatar" animate={{ y: [0, -8, 0], rotate: variant % 2 ? [2.5,-1.5,2.5] : [-2.5,1.5,-2.5] }} transition={{ repeat: Infinity, duration: 3.2 + variant * 0.25, ease: "easeInOut" }}>
      <svg viewBox="0 0 96 128" role="img" aria-label="Happy child cheering">
        <ellipse cx="48" cy="121" rx="28" ry="5.5" fill="rgba(21,54,79,.18)" />
        <path d="M34 104 L32 118 L42 118 L44 105 Z" fill={skin} />
        <path d="M62 104 L64 118 L54 118 L52 105 Z" fill={skin} />
        <ellipse cx="37" cy="119" rx="7" ry="3.5" fill="#fff" stroke="#d9dee2" strokeWidth="1" />
        <ellipse cx="59" cy="119" rx="7" ry="3.5" fill="#fff" stroke="#d9dee2" strokeWidth="1" />
        <path d="M34 92 L36 108 L60 108 L62 92 Z" fill={pant} />
        <path d="M28 76 Q48 67 68 76 L64 96 Q48 101 32 96 Z" fill={shirt} />
        <path d="M30 78 Q48 71 66 78" stroke="#fff" strokeWidth="1.6" fill="none" opacity=".55" />
        <path d="M26 80 Q10 88 12 102" fill="none" stroke={skin} strokeWidth="9" strokeLinecap="round" />
        <circle cx="11" cy="99" r="5.5" fill={skin} />
        <path d="M22 78 L8 68" stroke={skin} strokeWidth="9" strokeLinecap="round" />
        <circle cx="7" cy="66" r="5.5" fill={skin} />
        <path d="M70 80 Q86 88 84 102" fill="none" stroke={skin} strokeWidth="9" strokeLinecap="round" />
        <circle cx="85" cy="99" r="5.5" fill={skin} />
        <path d="M74 78 L88 68" stroke={skin} strokeWidth="9" strokeLinecap="round" />
        <circle cx="89" cy="66" r="5.5" fill={skin} />
        <circle cx="48" cy="50" r="25.5" fill={skin} />
        <circle cx="39" cy="54" r="4" fill="#ff9aa8" opacity=".55" />
        <circle cx="57" cy="54" r="4" fill="#ff9aa8" opacity=".55" />
        {isGirl ? (
          <g>
            <path d="M22 50 Q20 16 48 14 Q76 16 74 50 Q68 30 56 30 L40 30 Q30 30 22 50Z" fill={hair} />
            <circle cx="20" cy="62" r="9" fill={hair} />
            <circle cx="76" cy="62" r="9" fill={hair} />
            <circle cx="20" cy="53" r="4.5" fill="#f4558d" />
            <circle cx="76" cy="53" r="4.5" fill="#f4558d" />
            <path d="M36 32 Q48 38 60 32 Q56 26 48 26 Q40 26 36 32" fill={hair} />
          </g>
        ) : (
          <path d="M22 48 Q18 16 48 15 Q78 16 74 48 Q68 30 58 32 Q52 20 40 28 Q30 30 22 48Z" fill={hair} />
        )}
        <circle cx="39" cy="52" r="2.7" fill="#14334c" />
        <circle cx="40" cy="51" r=".9" fill="#fff" />
        <circle cx="57" cy="52" r="2.7" fill="#14334c" />
        <circle cx="58" cy="51" r=".9" fill="#fff" />
        <path d="M36 41 Q39 39 42 41" stroke="#14334c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M54 41 Q57 39 60 41" stroke="#14334c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M40 62 Q48 69 56 62" fill="none" stroke="#a93a55" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}
