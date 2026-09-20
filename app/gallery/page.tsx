"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Header, Footer, CTABand, PageHero } from "@/components/site";
import { Camera, Play } from "lucide-react";

const all = [
  { s: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=70", c: "photos" },
  { s: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=70", c: "photos" },
  { s: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=70", c: "events" },
  { s: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=70", c: "events" },
  { s: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=70", c: "photos" },
  { s: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=600&q=70", c: "posters" },
  { s: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=70", c: "events" },
  { s: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=70", c: "posters" },
];
const videos = [
  { t: "മലർവാടിയിലെ ഒരു ദിവസം", d: "02:45 • 12k views", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=70" },
  { t: "ബാലോത്സവം 2024 ഹൈലൈറ്റ്സ്", d: "04:10 • 8k views", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=70" },
  { t: "കുഞ്ഞു ശാസ്ത്രജ്ഞൻ പരീക്ഷണങ്ങൾ", d: "03:02 • 5k views", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=70" },
];

export default function Gallery() {
  const [f, setF] = useState("all");
  const shown = all.filter((a) => f === "all" || a.c === f);
  return (
    <div className="page">
      <Header />
      <div className="wrap">
        <PageHero kicker="ഗാലറി • Photos & Videos" title="നമ്മുടെ ചിത്രങ്ങളും വീഡിയോകളും" sub="ചിരിയും കളിയും പഠനവും — ഓരോ ഫ്രെയിമിലും സന്തോഷം." icon={<Camera size={56} strokeWidth={1.8} />} />
        <div className="filter-row">
          {[["all","എല്ലാം"],["photos","ചിത്രങ്ങൾ"],["videos","വീഡിയോകൾ"],["events","പരിപാടികൾ"],["posters","പോസ്റ്ററുകൾ"]].map(([v,l])=>(
            <button key={v} onClick={()=>setF(v)} className={`chip ${f===v?"on":""}`}>{l}</button>
          ))}
        </div>
        {(f === "all" || f === "photos" || f === "events" || f === "posters") && (
          <div className="g-grid">
            {shown.map((a,i)=>(
              <motion.img key={i} src={a.s} alt="gallery" loading="lazy" initial={{opacity:0,scale:.94}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:(i%4)*0.06}} />
            ))}
          </div>
        )}
        {(f === "all" || f === "videos") && (
          <div className="sub-grid">
            {videos.map((v,i)=>(
              <motion.div key={v.t} whileHover={{y:-5}} className="sub-card" style={{padding:0,overflow:"hidden"}}>
                <div style={{position:"relative"}}><img src={v.img} alt={v.t} style={{height:190,width:"100%",objectFit:"cover"}} />
                  <span style={{position:"absolute",inset:0,display:"grid",placeItems:"center"}}><span className="play"><i><Play size={22} fill="currentColor" /></i></span></span></div>
                <div style={{padding:12}}><b style={{fontSize:14}}>{v.t}</b><br/><small style={{color:"#888"}}>{v.d}</small></div>
              </motion.div>
            ))}
          </div>
        )}
        <div style={{height:14}} />
      </div>
      <CTABand /><Footer />
    </div>
  );
}
