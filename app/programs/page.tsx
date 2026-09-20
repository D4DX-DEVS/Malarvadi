"use client";
import { motion } from "framer-motion";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import { Rainbow, GraduationCap, PartyPopper, Sprout, Microscope, HeartHandshake, Palette, CalendarDays } from "lucide-react";

const items = [
  { e: <Rainbow />, c: "#fff3c4", t: "മഴവില്ല്", d: "വായനാ വസന്തം — പുസ്തക പരിചയം, കഥപറയൽ, വായനാ മത്സരങ്ങൾ. എല്ലാ വർഷവും ജൂണിൽ.", meta: "എല്ലാ യൂണിറ്റുകളിലും • 4 ആഴ്ച" },
  { e: <GraduationCap />, c: "#dcf2ff", t: "Little Scholar 2025", d: "സ്കോളർഷിപ്പ് പരീക്ഷ — ഗണിതം, ശാസ്ത്രം, ഭാഷ, പൊതുവിജ്ഞാനം. ജില്ലാതല ഫൈനൽ.", meta: "Class 3–7 • സെപ്റ്റംബർ" },
  { e: <PartyPopper />, c: "#ffe1e8", t: "ബാലോത്സവം", d: "കല, സാഹിത്യം, കായികം — മെഗാ കിഡ്സ് ഫെസ്റ്റ്. നാടകം, പാട്ട്, ചിത്രരചന, ഓട്ടം.", meta: "സോൺ തലം → സംസ്ഥാനം" },
  { e: <Sprout />, c: "#efffef", t: "പച്ചത്തുരുത്ത്", d: "പരിസ്ഥിതി ക്ലബ് — തൈ നടൽ, പൂന്തോട്ടം, പ്ലാസ്റ്റിക് രഹിത ക്യാമ്പയിൻ.", meta: "വർഷം മുഴുവൻ" },
  { e: <Microscope />, c: "#eef2ff", t: "കുഞ്ഞു ശാസ്ത്രജ്ഞൻ", d: "പരീക്ഷണശാല — ലളിതമായ ശാസ്ത്ര പരീക്ഷണങ്ങൾ, നിരീക്ഷണ ഡയറി.", meta: "മാസത്തിൽ ഒരിക്കൽ" },
  { e: <HeartHandshake />, c: "#fff7dd", t: "സ്നേഹസ്പർശം", d: "സാമൂഹിക സേവനം — വയോജന സന്ദർശനം, ഭക്ഷണപ്പൊതി, രക്തദാന ബോധവൽക്കരണം.", meta: "സേവന ഞായറുകൾ" },
];

export default function Programs() {
  return (
    <div className="page">
      <Header />
      <div className="wrap">
        <PageHero kicker="പരിപാടികൾ • Programs" title="കളിയും പഠനവും ഒരുമിച്ച്" sub="6 മുഖ്യ പരിപാടികൾ — ഓരോ കുട്ടിക്കും തിളങ്ങാൻ ഒരു വേദി." icon={<Palette size={56} strokeWidth={1.8} />} />
        <div className="prog-detail">
          {items.map((p,i)=>(
            <motion.div key={p.t} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%3)*0.08}} whileHover={{y:-6,rotate:-0.5}} className="sub-card" style={{background:p.c}}>
              <span className="big">{p.e}</span>
              <h4>{p.t}</h4><p>{p.d}</p>
              <span style={{fontSize:11,fontWeight:800,background:"#fff",borderRadius:999,padding:"4px 10px",display:"inline-block",marginTop:6}}>{p.meta}</span>
            </motion.div>
          ))}
        </div>
        <div className="sub-card" style={{background:"#0a3d2e",color:"#d8efe3",borderColor:"#0a3d2e"}}>
              <h4 style={{color:"#ffd23f", display:"flex", alignItems:"center", gap:7}}><CalendarDays size={20} /> ഈ മാസത്തെ കലണ്ടർ</h4>
          <p style={{color:"#bfe3cf"}}>സെപ് 21 — യൂണിറ്റ് തല കഥപറയൽ • സെപ് 28 — സോൺ ക്വിസ് ഫൈനൽ • ഒക്ടോ 5 — തൈ നടൽ ദിനം. പങ്കെടുക്കാൻ മെന്ററെ ബന്ധപ്പെടൂ.</p>
        </div>
        <div style={{height:16}} />
      </div>
      <CTABand /><Footer />
    </div>
  );
}
