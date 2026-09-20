"use client";
import { motion } from "framer-motion";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import { TreePine, Flower2, Sprout, BookOpen, GraduationCap, PartyPopper } from "lucide-react";

const mentors = [
  { photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=75", name: "ഫാത്തിമ ടീച്ചർ", role: "സോൺ മെന്റർ", shape: "scallop", tone: "m-teal" },
  { photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=75", name: "അബ്ദുൽ സലാം സാർ", role: "കലാ മെന്റർ", shape: "star", tone: "m-orange" },
  { photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=75", name: "സുമയ്യ ടീച്ചർ", role: "ശാസ്ത്ര മെന്റർ", shape: "scallop", tone: "m-purple" },
  { photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&q=75", name: "ആരിഫ് സാർ", role: "കായിക മെന്റർ", shape: "star", tone: "m-green" },
];

export default function About() {
  return (
    <div className="page">
      <Header />
      <div className="wrap">
        <PageHero kicker="ഞങ്ങളെക്കുറിച്ച് • About US" title="കുട്ടികൾക്കായി, സമൂഹത്തിനായി" sub="1990 മുതൽ കേരളത്തിലുടനീളം കുരുന്നുകളുടെ സർഗാത്മകതയും മൂല്യങ്ങളും വളർത്തുന്ന ബാലസംഘം." icon={<TreePine size={56} strokeWidth={1.8} />} />
        <div className="sub-grid">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="sub-card">
            <h4><Flower2 size={20} /> ഞങ്ങളുടെ കഥ</h4>
            <p>മലർവാടി ഒരു കുട്ടിക്കൂട്ടായ്മയാണ് — വായന, കല, ശാസ്ത്രം, കായികം, സാമൂഹികസേവനം എന്നിവയിലൂടെ കുട്ടികളിൽ ആത്മവിശ്വാസവും സഹാനുഭൂതിയും വളർത്തുന്നു. എല്ലാ ഞായറാഴ്ചയും 1500+ യൂണിറ്റുകളിൽ സ്നേഹത്തോടെ കൂടുന്നു.</p>
            <p>10,000+ വിദ്യാർത്ഥികൾ, 1500+ പരിശീലകരായ മെന്റർമാർ — ഓരോ കുട്ടിയും ഒരു പൂവ് പോലെ വിരിയുന്നു.</p>
          </motion.div>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="sub-card" style={{overflow:"hidden",padding:0}}>
            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80" alt="kids learning" style={{height:240,width:"100%",objectFit:"cover"}} />
            <div style={{padding:14}}><b>എല്ലാ ഞായറും • 9:30 AM</b><p style={{margin:"4px 0 0",fontSize:12}}>പാട്ട്, കഥ, കളി, ചിത്രം വര, പരിസ്ഥിതി പാഠങ്ങൾ — പഠനം രസകരമാക്കുന്നു.</p></div>
          </motion.div>
        </div>
        <div className="timeline">
          {[
            [<Sprout size={20} />,"1992 — തുടക്കം","മലപ്പുറത്ത് ആദ്യ ബാലസംഘം. 20 കുട്ടികൾ, 2 മെന്റർമാർ."],
            [<BookOpen size={20} />,"2005 — മഴവില്ല്","വായനോത്സവം സംസ്ഥാനതലത്തിൽ. ആയിരക്കണക്കിന് പുസ്തകങ്ങൾ."],
            [<GraduationCap size={20} />,"2018 — Little Scholar","സ്കോളർഷിപ്പ് പരീക്ഷ ആരംഭം. പഠനത്തിൽ മികവിന് അംഗീകാരം."],
            [<PartyPopper size={20} />,"2025 — ബാലോത്സവം","കലാ-കായിക-സാഹിത്യ മെഗാ ഫെസ്റ്റ്. 10,000+ പങ്കാളികൾ."],
          ].map(([e,t,d],i)=>(
            <motion.div key={`${String(t)}-${i}`} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.06}} className="t-item">
              <span className="dot" style={{background:"#eafff1"}}>{e}</span>
              <span><b style={{fontSize:14}}>{t}</b><br/><small style={{color:"#666"}}>{d}</small></span>
            </motion.div>
          ))}
        </div>
      </div>

      <section className="mentors-band">
        <svg className="mentor-defs" aria-hidden focusable="false">
          <defs>
            <clipPath id="mScallop" clipPathUnits="objectBoundingBox">
              <path d="M 0.95 0.5 A 0.14 0.14 0 0 1 0.8897 0.725 A 0.14 0.14 0 0 1 0.725 0.8897 A 0.14 0.14 0 0 1 0.5 0.95 A 0.14 0.14 0 0 1 0.275 0.8897 A 0.14 0.14 0 0 1 0.1103 0.725 A 0.14 0.14 0 0 1 0.05 0.5 A 0.14 0.14 0 0 1 0.1103 0.275 A 0.14 0.14 0 0 1 0.275 0.1103 A 0.14 0.14 0 0 1 0.5 0.05 A 0.14 0.14 0 0 1 0.725 0.1103 A 0.14 0.14 0 0 1 0.8897 0.275 A 0.14 0.14 0 0 1 0.95 0.5 Z" />
            </clipPath>
            <clipPath id="mStar" clipPathUnits="objectBoundingBox">
              <path d="M 0.5 0 L 0.6014 0.1546 L 0.7703 0.0794 L 0.7721 0.2643 L 0.9548 0.2923 L 0.8563 0.4488 L 0.9949 0.5712 L 0.8275 0.6495 L 0.8779 0.8274 L 0.6946 0.8029 L 0.6409 0.9797 L 0.5 0.86 L 0.3591 0.9797 L 0.3054 0.8029 L 0.1221 0.8274 L 0.1725 0.6495 L 0.0051 0.5712 L 0.1437 0.4488 L 0.0452 0.2923 L 0.2279 0.2643 L 0.2297 0.0794 L 0.3986 0.1546 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="wrap">
          <p className="mentors-eyebrow">ഞങ്ങളുടെ മെന്റർമാർ</p>
          <h4 className="mentors-title">ഓരോ കുട്ടിക്കും <span>കരുതലുള്ള മെന്റർമാർ</span></h4>
          <p className="mentors-sub">സുരക്ഷിതവും സ്നേഹപൂർണ്ണവുമായ അന്തരീക്ഷത്തിൽ ഓരോ കുട്ടിയെയും അറിഞ്ഞ്, ക്ഷമയോടെയും പ്രോത്സാഹനത്തോടെയും കൂടെ നിൽക്കുന്ന മെന്റർമാർ.</p>
          <div className="mentors-grid">
            {mentors.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09, duration: .55 }} whileHover={{ y: -8 }} className="mentor-card">
                <span className={`mentor-shape ${m.shape} ${m.tone}`} style={{ animationDelay: `${-i * 1.2}s` }}>
                  <img src={m.photo} alt={m.name} loading="lazy" />
                </span>
                <b>{m.name}</b>
                <small>{m.role}</small>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CTABand /><Footer />
    </div>
  );
}
