"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock, ChevronLeft, ChevronRight, Megaphone, Image as ImageIcon, ArrowRight, Sparkles, Star, Trophy, BookOpen, Sun as SunIcon, Leaf, Heart, Palette, Camera, Plane, Sprout, TreePine, Baby, UserRound, Rainbow, PartyPopper, Building2, UsersRound, Pencil, CircleHelp, TentTree, Flower2, MessageCircle, Apple, Plus, Minus, X } from "lucide-react";
import { Header, Footer, CTABand, Ticker } from "@/components/site";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let started = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        const t0 = performance.now(), dur = 1600;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: .4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n.toLocaleString("en-IN")}{suffix}</span>;
}

const COMMUNITY = [
  { href: "#", label: "Facebook", icon: <Facebook size={15} /> },
  { href: "#", label: "Instagram", icon: <Instagram size={15} /> },
  { href: "#", label: "YouTube", icon: <Youtube size={15} /> },
  { href: "#", label: "WhatsApp", icon: <MessageCircle size={15} /> },
];

function JoinPopup() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const close = () => {
    setOpen(false);
    try { sessionStorage.setItem("mv_join_seen", "1"); } catch {}
  };
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("mv_join_seen") === "1"; } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 1400);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="join-pop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }} onClick={close} role="dialog" aria-modal="true" aria-label="മലർവാടിയിൽ ചേരാം">
          <motion.div className="join-pop-card" initial={{ scale: .92, y: 22, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: .95, opacity: 0 }} transition={{ type: "spring", stiffness: 190, damping: 20 }} onClick={(e) => e.stopPropagation()}>
            <img className="join-pop-kid" src="/kid-right.png" alt="" aria-hidden />
            <p className="join-pop-eyebrow"><Sparkles size={13} /> ബാലസംഘം • Join Us</p>
            <h4 className="join-pop-title">മലർവാടിയിൽ ചേരാം</h4>
            <p className="join-pop-sub">പുതിയ പരിപാടികളും വാർത്തകളും അറിയാൻ ഇമെയിൽ നൽകൂ — ആഴ്ചയിൽ ഒരിക്കൽ മാത്രം.</p>
            <form className="join-pop-form" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
              <input type="email" required placeholder="ഇമെയിൽ വിലാസം" aria-label="ഇമെയിൽ വിലാസം" />
              <button type="submit">അയക്കാം</button>
            </form>
            {done
              ? <p className="join-pop-thanks"><Star size={13} /> നന്ദി! ഞങ്ങൾ ഉടൻ ബന്ധപ്പെടും.</p>
              : <div className="join-pop-social">
                  {COMMUNITY.map((c) => (
                    <a key={c.label} href={c.href} aria-label={c.label} title={c.label}>{c.icon}</a>
                  ))}
                </div>}
          </motion.div>
          <button className="join-pop-close" onClick={close} aria-label="അടയ്ക്കാം"><X size={18} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.09, duration: 0.65, ease: "easeOut" } }) };

function Sun() {
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

function TreeHouse() {
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

function Kite({ left, top, c1, c2, delay, s = 1 }: { left: string; top: string; c1: string; c2: string; delay: string; s?: number }) {
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

function Butterfly({ color = "#a78bfa", left, top, delay, scale = 1 }: { color?: string; left: string; top: string; delay: string; scale?: number }) {
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

function Flower({ delay = "0s", size = 26 }: { delay?: string; size?: number }) {
  return <span className="fl" style={{ width: size, height: size, animationDelay: delay }}><Flower2 size={size} strokeWidth={1.8} /></span>;
}

function Kid({ variant = 0 }: { variant?: number }) {
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

export default function Page() {
  useReveal();
  const [progIdx, setProgIdx] = useState(1);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [joined, setJoined] = useState(false);
  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setJoined(true);
  };
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const faqs = [
    { q: "മലർവാടി എന്താണ്?", a: "മലർവാടി ഒരു ബാലസംഘമാണ് — 5 മുതൽ 15 വയസ്സുവരെയുള്ള കുട്ടികളുടെ സർഗാത്മകതയും അറിവും മൂല്യങ്ങളും വളർത്തുന്ന സ്നേഹക്കൂട്ടം. 1500+ യൂണിറ്റുകളിലായി എല്ലാ ഞായറും കുട്ടികൾ ഒത്തുചേരുന്നു." },
    { q: "ആർക്കൊക്കെ അംഗമാകാം?", a: "5–15 പ്രായത്തിലുള്ള എല്ലാ കുട്ടികൾക്കും ചേരാം. അടുത്തുള്ള യൂണിറ്റിലെ മെന്ററെ ബന്ധപ്പെട്ടാൽ മതി — വായന, കല, കായികം തുടങ്ങി ഇഷ്ടമുള്ള മേഖല തിരഞ്ഞെടുക്കാം." },
    { q: "കുട്ടികൾക്ക് സുരക്ഷിതമാണോ?", a: "തീർച്ചയായും. പരിശീലനം ലഭിച്ച 1500+ മെന്റർമാരുടെ മേൽനോട്ടത്തിലാണ് എല്ലാ പരിപാടികളും. സുരക്ഷിതവും സ്നേഹനിർഭരവുമായ അന്തരീക്ഷമാണ് ഞങ്ങളുടെ ഉറപ്പ്." },
    { q: "രക്ഷിതാക്കളുടെ പിന്തുണ വേണോ?", a: "പഠനയാത്രയിൽ കുട്ടിയോടൊപ്പം നിൽക്കാൻ രക്ഷിതാക്കളെ ഞങ്ങൾ പ്രോത്സാഹിപ്പിക്കുന്നു. യൂണിറ്റ് യോഗങ്ങളിലും പ്രത്യേക പരിപാടികളിലും പങ്കെടുക്കാം." },
    { q: "എങ്ങനെ അംഗമാകാം? ഫീസ് ഉണ്ടോ?", a: "അംഗമാകാൻ താഴെയുള്ള അംഗമാവുക ബട്ടൺ അമർത്തൂ, അല്ലെങ്കിൽ +91 98765 43210 എന്ന നമ്പറിൽ ബന്ധപ്പെടൂ. അടിസ്ഥാന അംഗത്വം സൗജന്യമാണ്." },
  ];

  const photos = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=70",
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=70",
    "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&q=70",
    "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=400&q=70",
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=70",
    "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=400&q=70",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=70",
    "https://images.unsplash.com/photo-1526634332515-d56c5fd16991?w=400&q=70",
  ];
  const allPhotos = [...uploadedPhotos, ...photos];
  const youtubeVideos = [
    { id: "M7lc1UVf-VE", title: "വീഡിയോ വിശേഷങ്ങൾ • Embedded YouTube", meta: "YouTube • വീഡിയോ പ്ലെയർ" },
    { id: "aqz-KE-bpKQ", title: "കളിച്ചും പഠിച്ചും മുന്നോട്ട്", meta: "YouTube • കുട്ടികൾക്കായുള്ള ഷോർട്ട് ഫിലിം" },
    { id: "ScMzIvxBSi4", title: "നമ്മുടെ ഓർമ്മകളിൽ നിന്നൊരു ഫ്രെയിം", meta: "YouTube • വീഡിയോ" },
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setUploadedPhotos((current) => [...files.map((file) => URL.createObjectURL(file)), ...current]);
    event.target.value = "";
  };

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
                <span className="hero-badge"><Palette size={13} /> കല</span>
                <span className="hero-badge" style={{ animationDelay: "-1.2s" }}><BookOpen size={13} /> വായന</span>
              </div>
              <div className="hero-badges" style={{ right: 210, top: 26 }}>
                <span className="hero-badge" style={{ animationDelay: "-2s" }}><TreePine size={13} /> ബാലസംഘം</span>
              </div>
              <TreeHouse />
              <div className="hero-title">
                <div className="over">ബാലസംഘം • SINCE 1992</div>
                <h4><span className="r">മ</span><span className="t">ല</span><span className="r">ർ</span><span className="p">വാ</span><span className="o">ടി</span></h4>
                <div className="under">കുട്ടികളുടെ സന്തോഷ ലോകം • 1500+ യൂണിറ്റുകൾ</div>
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

        <section className="strip reveal">
          <div style={{ position: "relative" }}>
            <span className="side-kid" style={{ left: -62 }}><Baby size={50} /><small><Sprout size={18} /></small></span>
            <span className="side-kid" style={{ right: -60, animationDelay: "-1.4s" }}><UserRound size={50} /><small><Heart size={18} /></small></span>
            <div className="strip-row">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={0} viewport={{ once: true }} className="prog-card pc-yellow" onMouseEnter={() => setProgIdx(0)} style={{ opacity: progIdx === 0 ? 1 : 0.94, scale: progIdx===0?1.03:1 }}>
                <motion.span animate={{ y: [0,-7,0], rotate: [-5,5,-5] }} transition={{ repeat: Infinity, duration: 3.4 }} style={{ display:"block" }}><Rainbow size={42} /></motion.span>
                <h4 style={{ color: "#111" }}>മഴവില്ല്</h4><p>CHILDREN'S FEST • READING</p>
                <span style={{ marginTop: 8, display:"inline-block", fontSize: 11, fontWeight: 800, background:"#fff", borderRadius:999, padding:"4px 12px", border:"1px solid #f0d9a9" }}>ജൂൺ • 4 ആഴ്ച →</span>
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }} className="prog-card pc-blue" onMouseEnter={() => setProgIdx(1)} style={{ opacity: progIdx === 1 ? 1 : 0.94, scale: progIdx===1?1.045:1 }}>
                <span style={{ fontSize: 12, fontWeight: 800, background: "#1f9d55", color: "#fff", borderRadius: 999, padding: "3px 12px", display:"inline-flex", alignItems:"center", gap:6 }}><BookOpen size={12}/> Little</span>
                <h4 style={{ color: "#e8590c", textShadow: "0 2px 0 #fff", letterSpacing: .5 }}>SCHOLAR</h4>
                <p>SCHOLARSHIP EXAM • 2025</p>
                <motion.span animate={{ y: [0,-6,0] }} transition={{ repeat: Infinity, duration: 2.8 }} style={{ display:"block", marginTop:4 }}><Trophy size={32} /></motion.span>
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={2} viewport={{ once: true }} className="prog-card pc-pink" onMouseEnter={() => setProgIdx(2)} style={{ opacity: progIdx === 2 ? 1 : 0.94, scale: progIdx===2?1.03:1 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#d9480f" }}>മലർവാടി</span>
                <h4 style={{ color: "#5c2e00", textShadow: "0 2px 0 #ffd43b, 0 4px 0 #fff" }}>ബാലോ<br />ത്സവം</h4><p>MEGA KIDS FESTIVAL</p>
                <span style={{ marginTop: 8, display:"inline-block", fontSize: 11, fontWeight: 800, background:"#fff", borderRadius:999, padding:"4px 12px", border:"1px solid #ffc7d8" }}>10,000+ കുട്ടികൾ →</span>
              </motion.div>
            </div>
            <span className="arrow l" onClick={() => setProgIdx((progIdx + 2) % 3)}><ChevronLeft size={16} /></span>
            <span className="arrow r" onClick={() => setProgIdx((progIdx + 1) % 3)}><ChevronRight size={16} /></span>
          </div>
        </section>

        <section className="about reveal">
          <div className="about-photo-wrap">
            <div className="about-blob" />
            <motion.div whileHover={{ rotate: 0, scale: 1.015 }} className="about-photo">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80" alt="Kids learning together" />
            </motion.div>
            <span className="about-sticker"><Flower2 size={28} /><Flower2 size={28} /></span>
            <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: .3, type:"spring", stiffness:200 }} style={{ position:"absolute", left:-10, top:12, background:"#fff", border:"2px solid #ffe0b8", borderRadius:999, padding:"6px 12px", fontSize:11, fontWeight:800, boxShadow:"0 8px 18px rgba(0,0,0,.1)", zIndex:2, display:"inline-flex", alignItems:"center", gap:5 }}><Star size={13} fill="#ffd23f" color="#e9a900" /> 30+ വർഷം</motion.span>
          </div>
          <div className="about-text">
            <div className="kick"><Leaf size={14} /> മലർവാടി മലപ്പുറം • <Sparkles size={12}/> സ്നേഹക്കൂട്ടം</div>
            <h4>കുട്ടികൾക്കായി...<br />സമൂഹത്തിനായി...</h4>
            <p>കുരുന്നുകളുടെ സർഗാത്മകതയും അറിവും വളർത്തുന്ന മലർവാടി — കല, സാഹിത്യം, ശാസ്ത്രം, സാമൂഹിക സേവനം എന്നീ മേഖലകളിൽ കുട്ടികൾക്ക് വേദിയൊരുക്കുന്നു. 1500+ യൂണിറ്റുകളിലായി പതിനായിരക്കണക്കിന് കുട്ടികൾ എല്ലാ ഞായറും ഒത്തുചേരുന്നു.</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
              <span style={{ fontSize:11, fontWeight:800, background:"#eafff1", border:"1px solid #bfe9c9", padding:"5px 12px", borderRadius:999, display:"inline-flex", alignItems:"center", gap:5 }}><Palette size={13} /> കല</span>
              <span style={{ fontSize:11, fontWeight:800, background:"#e8f6ff", border:"1px solid #bfe3ff", padding:"5px 12px", borderRadius:999, display:"inline-flex", alignItems:"center", gap:5 }}><BookOpen size={13} /> വായന</span>
              <span style={{ fontSize:11, fontWeight:800, background:"#fff4c9", border:"1px solid #f0d9a9", padding:"5px 12px", borderRadius:999, display:"inline-flex", alignItems:"center", gap:5 }}><Sprout size={13} /> പരിസ്ഥിതി</span>
            </div>
            <a href="/about" className="btn btn-green">കൂടുതൽ അറിയാം <ArrowRight size={15} /></a>
          </div>
        </section>
      </div>

      <div className="wrap"><section className="stats reveal">
        <Star className="star" size={22} style={{ right: 18, top: -14 }} />
        <Sparkles className="star" size={16} style={{ left: 32, bottom: -12 }} />
        <div className="stat s-blue"><span className="ic"><Building2 size={24} /></span><span><b><CountUp to={1500} suffix="+" /></b><small>Units • യൂണിറ്റുകൾ</small></span></div>
        <div className="stat s-green"><span className="ic"><UsersRound size={24} /></span><span><b><CountUp to={10000} suffix="+" /></b><small>Student's • കുട്ടികൾ</small></span></div>
        <div className="stat s-red"><span className="ic"><Star size={24} /></span><span><b><CountUp to={1500} suffix="+" /></b><small>Mentors • മെന്റർമാർ</small></span></div>
      </section></div>

      <section id="news" className="blog-band news-band reveal">
        <div className="wrap">
          <span className="news-kicker" aria-hidden><Megaphone size={18} /></span>
          <h4 className="blog-title">വാർത്തകളും വിശേഷങ്ങളും</h4>
          <p className="blog-sub">മലർവാടിയിലെ പുതിയ വാർത്തകളും വിശേഷങ്ങളും എല്ലാം ഒരിടത്ത്</p>
          <div className="blog-grid">
            <motion.article whileHover={{ y: -8 }} className="blog-card">
              <img className="blog-photo" src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=70" alt="ബാലപ്രതിഭാ സംഗമം" loading="lazy" />
              <div className="blog-tags"><span>മലപ്പുറം</span><span>പരിപാടികൾ</span></div>
              <h4>ബാലപ്രതിഭാ സംഗമം</h4>
              <p className="blog-text">മലപ്പുറം ജില്ലയിലെ മികച്ച പ്രതിഭകളെ അനുമോദിച്ചു. നൂറുകണക്കിന് കുട്ടികൾ പങ്കെടുത്ത സന്തോഷ ദിനം.</p>
              <a className="keiki-more" href="#">കൂടുതൽ വായിക്കാം <ArrowRight size={14} /></a>
            </motion.article>
            <motion.article whileHover={{ y: -8 }} className="blog-card">
              <img className="blog-photo" src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=70" alt="സമ്മാന വിതരണം" loading="lazy" />
              <div className="blog-tags"><span>സമ്മാനങ്ങൾ</span><span>വിദ്യാർത്ഥികൾ</span></div>
              <h4>സമ്മാന വിതരണം</h4>
              <p className="blog-text">വിദ്യാർത്ഥികൾക്ക് സമ്മാനങ്ങൾ കൈമാറി. കലയും പാട്ടും നിറഞ്ഞ വേദിയിൽ വലിയ ആഘോഷം.</p>
              <a className="keiki-more" href="#">കൂടുതൽ വായിക്കാം <ArrowRight size={14} /></a>
            </motion.article>
            <motion.article whileHover={{ y: -8 }} className="blog-card">
              <img className="blog-photo" src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=70" alt="ഫാമിലി ക്വിസ്" loading="lazy" />
              <div className="blog-tags"><span>ക്വിസ്</span><span>രജിസ്ട്രേഷൻ</span></div>
              <h4>ഫാമിലി ക്വിസ് മത്സരം</h4>
              <p className="blog-text">കുട്ടികൾക്കും മാതാപിതാക്കൾക്കുമായി ഓൺലൈൻ ഫാമിലി ക്വിസ്. സെപ്റ്റംബർ 14 ന് സൗജന്യ രജിസ്ട്രേഷൻ ആരംഭിച്ചു.</p>
              <a className="keiki-more" href="#">കൂടുതൽ വായിക്കാം <ArrowRight size={14} /></a>
            </motion.article>
          </div>
          <div className="news-cta"><a href="/programs" className="btn btn-green">എല്ലാ വാർത്തകളും കാണാം <ArrowRight size={15} /></a></div>
        </div>
      </section>

      <div className="cream-band">
        <div className="wrap">
          <div className="media-stack">
            <div className="panel lav video-panel reveal">
              <Plane className="corner" size={28} style={{ right: 2, top: -2 }} />
              <div className="gallery-panel-head">
                <div>
                  <h4><span style={{ background: "#f4558d", color: "#fff", borderRadius: "50%", width: 30, height: 30, display: "grid", placeItems: "center", fontSize: 14 }}>▶</span> വീഡിയോകൾ</h4>
                  <p className="sub">YouTube-ൽ നിന്നുള്ള മലർവാടി വിശേഷങ്ങൾ...</p>
                </div>
                <a href="/gallery" className="mini">എല്ലാം കാണാം →</a>
              </div>
              <div className="youtube-grid">
                {youtubeVideos.map((video, i) => (
                  <motion.article key={video.id} className={`youtube-card ${i === 0 ? "featured" : ""}`} whileHover={{ y: -6 }}>
                    <div className="youtube-frame">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1`}
                        title={video.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <div className="youtube-caption"><b>{video.title}</b><small>{video.meta}</small></div>
                  </motion.article>
                ))}
              </div>
              <p style={{ fontSize: 11, fontWeight: 800, color: "#0b6aa5", textAlign: "right", margin: "12px 0 0", display:"flex", justifyContent:"flex-end", alignItems:"center", gap:5 }}>കാണൂ... ചിരിക്കൂ... വളരൂ... <Plane size={14} /></p>
            </div>

            <div className="poster-segment reveal">
              <div className="section-head"><span style={{ color: "#fff", background:"#27a866", borderRadius:"50%", width:30, height:30, display:"grid", placeItems:"center" }}><ImageIcon size={16} /></span><h4>പോസ്റ്ററുകൾ</h4><a href="/gallery" className="mini">എല്ലാം കാണാം <ArrowRight size={13} /></a></div>
              <div className="poster-grid">
                <motion.div whileHover={{ y: -8 }} className="poster" style={{ background: "#101828", color: "#fff", padding: 20 }}>
                  <div style={{ background: "#ffd23f", color: "#111", fontWeight: 800, borderRadius: 10, padding: "6px 10px", fontSize: 12 }}>പ്രശ്നോത്തരി • ഫാമിലി ക്വിസ്</div>
                  <h4 style={{ fontSize: 22, lineHeight: 1.3, margin: "12px 0", color:"#fff" }}>കുട്ടികൾക്കുള്ള<br />ഫാമിലി ക്വിസ് <CircleHelp size={19} style={{ verticalAlign:-3 }} /></h4>
                  <p style={{ fontSize: 11, opacity: 0.8 }}>സെപ്റ്റംബർ 14 • ഓൺലൈൻ • സൗജന്യം</p>
                  <div style={{ marginTop: 12, background: "#f4558d", borderRadius: 999, textAlign: "center", fontWeight: 800, padding: 9, fontSize: 13, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>രജിസ്റ്റർ ചെയ്യൂ <Pencil size={14} /></div>
                  <div style={{ marginTop: 12, display:"flex", justifyContent:"center", gap:8 }}><Trophy size={30} /><BookOpen size={30} /></div>
                </motion.div>
                <motion.div whileHover={{ y: -8 }} className="poster" style={{ background: "#fff", padding: 20, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:12, textAlign:"center" }}>
                  <div style={{ background: "#ffe8a3", borderRadius: 10, padding: "6px 12px", fontSize: 11, fontWeight: 800 }}>ക്വിസ് • പോസ്റ്റർ</div>
                  <Palette size={56} color="#f4558d" />
                  <b style={{ fontSize: 17, color: "#0b4f3a" }}>ചിത്രരചനാ മത്സരം</b>
                  <small style={{ fontSize: 11.5, color: "#6b7c86", fontWeight: 700 }}>കുട്ടികൾക്കായി സൗജന്യം</small>
                </motion.div>
                <motion.div whileHover={{ y: -8 }} className="poster" style={{ background: "linear-gradient(180deg,#ff9a3d,#f4558d)", color: "#fff", padding: 20, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:8, textAlign:"center" }}>
                  <div style={{ fontWeight: 800, fontSize: 34, lineHeight:1 }}>20<br />25</div><PartyPopper size={36} /><b style={{ fontSize: 17 }}>ബാലോത്സവം</b><small style={{ fontSize:11, opacity:.9 }}>വരുന്നു...</small>
                </motion.div>
              </div>
            </div>
          </div>

          <section id="gallery" className="gallery-stack">
            <div className="panel mint gallery-panel reveal">
              <Camera className="corner" size={22} style={{ left: 12, top: 8 }} />
              <Sparkles className="corner" size={17} style={{ right: 16, top: 6 }} />
              <div className="gallery-panel-head">
                <div>
                  <h4 style={{ paddingLeft: 32 }}>നമ്മുടെ ചിത്രങ്ങൾ</h4>
                  <p className="sub" style={{ paddingLeft: 32 }}>കളികളും ചിരികളും നിറഞ്ഞ നിമിഷങ്ങൾ...</p>
                </div>
                <div className="gallery-actions">
                  <label className="upload-btn">
                    <ImageIcon size={14} /> ചിത്രം ചേർക്കാം
                    <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
                  </label>
                  <a href="/gallery" className="mini">എല്ലാം കാണാം →</a>
                </div>
              </div>
              <div className="photo-grid photo-grid-wide">
                {allPhotos.map((s, i) => (
                  <motion.img key={`${s}-${i}`} src={s} alt="gallery" loading="lazy" whileHover={{ scale: 1.08, rotate: -1.5 }} />
                ))}
              </div>
              <p style={{ fontSize: 11.5, fontWeight: 800, color: "#0b6e4f", margin: "14px 0 0", display:"flex", alignItems:"center", gap:5 }}><Camera size={14} /> ഓരോ ചിത്രവും ഒരു മധുര ഓർമ്മ...!</p>
              <Leaf className="corner" size={22} style={{ left: 14, bottom: 8 }} />
            </div>
          </section>
        </div>
      </div>

      <section className="features-bg">
        <div className="wrap">
          <p style={{ textAlign: "center", color: "#f4558d", fontWeight: 800, fontSize: 13.5, margin: "0 0 4px", letterSpacing: ".4px" }}><Star size={13} style={{ display:"inline", verticalAlign:-1 }} /> വാർത്തകളും വിശേഷങ്ങളും • എന്തുകൊണ്ട് മലർവാടി?</p>
          <h4 className="sec-title">കളിയിലൂടെ പഠനം, സ്നേഹത്തിലൂടെ വളർച്ച</h4>
          <div className="features-grid">
            {[
              { c: "f-blue", e: <BookOpen />, t: "വിജ്ഞാനവും പ്രതിഭാവികാസവും" },
              { c: "f-pink", e: <Palette />, t: "കല, സാഹിത്യം & സാംസ്കാരിക വേദികൾ" },
              { c: "f-mint", e: <Sprout />, t: "പരിസ്ഥിതി സ്നേഹവും കൃഷിപാഠങ്ങളും" },
              { c: "f-cream", e: <Heart />, t: "കരുണയും സാമൂഹിക പ്രതിബദ്ധതയും" },
              { c: "f-lav", e: <UsersRound />, t: "ജീവിതനൈപുണികളും സ്വഭാവസംസ്കരണവും" },
              { c: "f-peach", e: <TentTree />, t: "ക്യാമ്പുകൾ, സാഹസ യാത്രകൾ & ദിനാചരണങ്ങൾ" },
            ].map((f, i) => (
              <motion.div key={f.t} variants={fadeUp} initial="hidden" whileInView="show" custom={i} viewport={{ once: true }} whileHover={{ y: -8, rotate: -.6 }} className={`feat ${f.c}`}>
                <span className="e" style={{ animationDelay: `${-i * 0.5}s` }}>{f.e}</span><b>{f.t}</b>
              </motion.div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:10, marginTop:22, flexWrap:"wrap" }}>
            <a href="/programs" className="btn btn-green"><Trophy size={15}/> പരിപാടികൾ കാണാം</a>
            <a href="/gallery" className="btn" style={{ background:"#fff", border:"1.5px solid #ffe0b8" }}>ഗാലറി <ArrowRight size={15}/></a>
          </div>
        </div>
      </section>

      <section className="app-band">
        <span className="app-cloud c1" aria-hidden /><span className="app-cloud c2" aria-hidden />
        <div className="wrap app-inner">
          <div className="app-visual reveal">
            <span className="app-phone" aria-hidden>
              <img src="/zaitoon.png" alt="" />
              <b>ZaiToon</b>
              <small>കഥ • പാട്ട് • കാർട്ടൂൺ</small>
            </span>
            <img className="app-kid-l" src="/kid-left.png" alt="" aria-hidden />
          </div>
          <div className="app-copy">
            <motion.span initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="app-eyebrow"><Sparkles size={13} /> മലർവാടി ആപ്പ്</motion.span>
            <h4 className="app-title">കുട്ടികൾക്കായി <span>സൈത്തൂൺ</span> ആപ്പ്</h4>
            <p className="app-sub">കഥകളും പാട്ടുകളും കാർട്ടൂണുകളും — പരസ്യങ്ങളില്ലാത്ത, കുട്ടികൾക്ക് സുരക്ഷിതമായ ഒരിടം. മലർവാടിയുടെ എല്ലാ യൂണിറ്റുകൾക്കും സൗജന്യം.</p>
            <div className="app-badges">
              <motion.a whileHover={{ y: -4 }} whileTap={{ scale: .96 }} className="store-badge" href="#" aria-label="Download on the App Store">
                <Apple size={24} />
                <span><small>Download on the</small><b>App Store</b></span>
              </motion.a>
              <motion.a whileHover={{ y: -4 }} whileTap={{ scale: .96 }} className="store-badge" href="#" aria-label="Get it on Google Play">
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
          <div className="app-visual reveal">
            <img className="app-kid-r" src="/kid-right.png" alt="" aria-hidden />
          </div>
        </div>
        <span className="app-grass" aria-hidden />
      </section>

      <section className="blog-band reveal">
        <div className="wrap">
          <h4 className="blog-title">ബ്ലോഗ്</h4>
          <p className="blog-sub">കുട്ടികൾക്കും മാതാപിതാക്കൾക്കും ഉപകാരപ്രദമായ അറിവുകളും പ്രവർത്തനങ്ങളും</p>
          <div className="blog-grid">
            <motion.article whileHover={{ y: -8 }} className="blog-card">
              <img className="blog-photo" src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=70" alt="blog" loading="lazy" />
              <div className="blog-tags"><span>കുട്ടികൾക്കുള്ള പ്രവർത്തനങ്ങൾ</span><span>+1 more</span></div>
              <h4>52 രസകരമായ ബുദ്ധി പരീക്ഷണങ്ങൾ (ഉത്തരങ്ങളോടെ)</h4>
              <a className="keiki-more" href="#">വായിക്കാം →</a>
            </motion.article>
            <motion.article whileHover={{ y: -8 }} className="blog-card">
              <img className="blog-photo" src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=70" alt="blog" loading="lazy" />
              <div className="blog-tags"><span>കുഞ്ഞുങ്ങൾക്കുള്ള പ്രവർത്തനങ്ങൾ</span></div>
              <h4>34 ശിശു പ്രവർത്തനങ്ങൾ: സെൻസറി കളിയും സന്തോഷവും</h4>
              <a className="keiki-more" href="#">വായിക്കാം →</a>
            </motion.article>
            <motion.article whileHover={{ y: -8 }} className="blog-card">
              <img className="blog-photo" src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=70" alt="blog" loading="lazy" />
              <div className="blog-tags"><span>കുട്ടികൾക്കുള്ള പ്രവർത്തനങ്ങൾ</span><span>+1 more</span></div>
              <h4>45 കിന്റർഗാർട്ടൻ പ്രവർത്തനങ്ങൾ കുട്ടികൾക്കായി</h4>
              <a className="keiki-more" href="#">വായിക്കാം →</a>
            </motion.article>
          </div>
        </div>
      </section>

      <section id="join" className="join-band">
        <span className="join-spark s1" aria-hidden /><span className="join-spark s2" aria-hidden />
        <div className="wrap">
          <div className="join-head">
            <div>
              <p className="join-eyebrow"><Sparkles size={13} /> ചേരാം • Join Us</p>
              <h4 className="join-title">മലർവാടിയിൽ അംഗമാവാം</h4>
            </div>
            <a href="/contact" className="join-chip">ബന്ധപ്പെടാം <ArrowRight size={14} /></a>
          </div>
          <div className="join-grid">
            <form className="join-card" onSubmit={handleJoin}>
              <h4>ഫോം പൂരിപ്പിക്കൂ, ഞങ്ങൾ ബന്ധപ്പെടാം!</h4>
              <div className="join-fields">
                <input required name="first" placeholder="പേര് *" aria-label="പേര്" />
                <input required name="place" placeholder="യൂണിറ്റ് / സ്ഥലം *" aria-label="യൂണിറ്റ്" />
                <input required name="phone" type="tel" placeholder="ഫോൺ നമ്പർ *" aria-label="ഫോൺ നമ്പർ" />
                <input name="email" type="email" placeholder="ഇമെയിൽ" aria-label="ഇമെയിൽ" />
                <select name="grade" aria-label="ക്ലാസ്" defaultValue="">
                  <option value="" disabled>ക്ലാസ് തിരഞ്ഞെടുക്കാം *</option>
                  <option>എൽ.കെ.ജി – 4</option>
                  <option>5 – 7</option>
                  <option>8 – 10</option>
                  <option>+1, +2</option>
                </select>
                <textarea name="message" rows={3} placeholder="സന്ദേശം" aria-label="സന്ദേശം" />
              </div>
              <button type="submit" className="btn btn-pink join-submit">അയക്കാം <ArrowRight size={15} /></button>
              {joined && <p className="join-note"><Star size={13} /> നന്ദി! ഞങ്ങൾ ഉടൻ ബന്ധപ്പെടും.</p>}
            </form>
            <div className="join-faq">
              {faqs.map((f, i) => (
                <div key={i} className={`join-faq-item tone-${i % 4} ${faqOpen === i ? "open" : ""}`}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} aria-expanded={faqOpen === i}>
                    <span>{f.q}</span>
                    <span className="join-plus">{faqOpen === i ? <Minus size={16} /> : <Plus size={16} />}</span>
                  </button>
                  {faqOpen === i && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="join-answer">{f.a}</motion.p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABand />

      <Footer />

      <JoinPopup />

      <motion.a href="#" className="to-top" onClick={(e)=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});}} whileHover={{ scale: 1.12, rotate: -8 }} style={{ position: "fixed", right: 16, bottom: 16, zIndex: 60, width: 48, height: 48, borderRadius: "50%", background: "#f4558d", color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 14px 28px rgba(244,85,141,.4)", fontWeight:800, border:"3px solid #fff" }}>↑</motion.a>
    </div>
  );
}
