"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Header, Footer, PageHero } from "@/components/site";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Hand, FileText, Heart, Map, MessageCircle, Camera, Youtube } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="page">
      <Header />
      <div className="wrap">
        <PageHero kicker="ബന്ധപ്പെടാം • Contact Us" title="ഹലോ പറയൂ, ചേരൂ" sub="അഡ്മിഷൻ, യൂണിറ്റ് തുടങ്ങൽ, സംശയങ്ങൾ — ഞങ്ങൾ സന്തോഷത്തോടെ സഹായിക്കാം." icon={<Hand size={56} strokeWidth={1.8} />} />
        <div className="contact-grid">
          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="form-card">
            {!sent ? (
              <form onSubmit={(e)=>{e.preventDefault();setSent(true);}}>
                <h4 style={{margin:"0 0 4px", display:"flex", alignItems:"center", gap:7}}><FileText size={20} /> സന്ദേശം അയക്കൂ</h4>
                <p style={{fontSize:12,color:"#777",margin:"0 0 6px"}}>24 മണിക്കൂറിനുള്ളിൽ മറുപടി നൽകും.</p>
                <label>പേര് *</label><input required placeholder="നിങ്ങളുടെ പേര്" />
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <span><label>ഫോൺ *</label><input required placeholder="+91 ..." /></span>
                  <span><label>സ്ഥലം</label><input placeholder="ഉദാ: മലപ്പുറം" /></span>
                </div>
                <label>വിഷയം</label>
                <select><option>അഡ്മിഷൻ</option><option>പുതിയ യൂണിറ്റ്</option><option>വളണ്ടിയർ / മെന്റർ</option><option>മറ്റുള്ളവ</option></select>
                <label>സന്ദേശം *</label><textarea required rows={4} placeholder="എഴുതൂ..." />
                <button className="btn btn-green" style={{marginTop:12}} type="submit"><Send size={15} /> അയക്കൂ</button>
              </form>
            ) : (
              <motion.div initial={{scale:.92,opacity:0}} animate={{scale:1,opacity:1}} style={{textAlign:"center",padding:"30px 10px"}}>
                <CheckCircle size={52} color="#1f9d55" />
                <h4 style={{display:"flex", alignItems:"center", justifyContent:"center", gap:7}}>നന്ദി! സന്ദേശം ലഭിച്ചു <Heart size={18} fill="currentColor" /></h4>
                <p style={{fontSize:13,color:"#666"}}>ഞങ്ങളുടെ ടീം ഉടൻ ബന്ധപ്പെടും. മലർവാടിയിലേക്ക് സ്വാഗതം!</p>
                <button className="btn btn-pink" onClick={()=>setSent(false)}>വേറൊന്ന് അയക്കൂ</button>
              </motion.div>
            )}
          </motion.div>
          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.08}}>
            <div className="sub-card" style={{background:"#0a3d2e",color:"#d8efe3",borderColor:"#0a3d2e"}}>
              <h4 style={{color:"#ffd23f", display:"flex", alignItems:"center", gap:7}}><MapPin size={20} /> മലർവാടി സെൻട്രൽ കമ്മിറ്റി</h4>
              <p style={{color:"#bfe3cf"}}><MapPin size={13}/> മലപ്പുറം, കേരളം 676505<br/><Phone size={13}/> +91 98765 43210 (രാവിലെ 9 – വൈകിട്ട് 5)<br/><Mail size={13}/> info@malarvadi.org<br/><Clock size={13}/> തിങ്കൾ – ശനി</p>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <a className="btn btn-pink" href="tel:+919876543210"><Phone size={14}/> വിളിക്കൂ</a>
                <a className="btn" style={{background:"#fff"}} href="mailto:info@malarvadi.org"><Mail size={14}/> മെയിൽ</a>
              </div>
            </div>
            <div className="sub-card" style={{marginTop:12}}>
              <h4 style={{display:"flex", alignItems:"center", gap:7}}><Map size={20} /> യൂണിറ്റ് കണ്ടെത്തൂ</h4>
              <p>1500+ യൂണിറ്റുകൾ — നിങ്ങളുടെ അടുത്തുള്ളത് അറിയാൻ സ്ഥലം അയക്കൂ. ഉദാ: <b>“മലപ്പുറം”</b> എന്ന് 98765 43210-ലേക്ക് വാട്ട്സ്ആപ്പ് ചെയ്യൂ.</p>
              <div style={{background:"#fff7dd",borderRadius:14,padding:12,fontSize:13}}><MessageCircle size={14} /> വാട്ട്സ്ആപ്പ്: <b>+91 98765 43210</b><br/><Camera size={14} /> ഇൻസ്റ്റാഗ്രാം: <b>@malarvadi</b><br/><Youtube size={14} /> യൂട്യൂബ്: <b>Malarvadi TV</b></div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
