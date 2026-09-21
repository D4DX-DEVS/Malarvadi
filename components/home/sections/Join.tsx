"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Star, Plus, Minus } from "lucide-react";
import type { SectionProps } from "@/components/home/section-types";

export default function Join({ data, section }: SectionProps) {
  const { join } = data.settings;
  const faqs = data.faqs;
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [joined, setJoined] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "");
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "join",
          data: { name: get("name"), place: get("place"), phone: get("phone"), email: get("email"), grade: get("grade"), message: get("message") },
        }),
      });
      if (!res.ok) throw new Error("failed");
      setJoined(true);
    } catch {
      setError("ക്ഷമിക്കണം, അയക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കൂ.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="join" className="join-band">
      <span className="join-spark s1" aria-hidden /><span className="join-spark s2" aria-hidden />
      <div className="wrap reveal rv-rotate">
        <div className="join-head">
          <div>
            <p className="join-eyebrow"><Sparkles size={13} /> {join.eyebrow || section.subtitle}</p>
            <h4 className="join-title">{join.title || section.title}</h4>
          </div>
          <a href="/contact" className="join-chip">ബന്ധപ്പെടാം <ArrowRight size={14} /></a>
        </div>
        <div className="join-grid">
          <form className="join-card" onSubmit={handleJoin}>
            <h4>{join.formTitle}</h4>
            <div className="join-fields">
              <input required name="name" placeholder="പേര് *" aria-label="പേര്" />
              <input required name="place" placeholder="യൂണിറ്റ് / സ്ഥലം *" aria-label="യൂണിറ്റ്" />
              <input required name="phone" type="tel" placeholder="ഫോൺ നമ്പർ *" aria-label="ഫോൺ നമ്പർ" />
              <input name="email" type="email" placeholder="ഇമെയിൽ" aria-label="ഇമെയിൽ" />
              <select name="grade" aria-label="ക്ലാസ്" defaultValue="" required>
                <option value="" disabled>ക്ലാസ് തിരഞ്ഞെടുക്കാം *</option>
                <option>എൽ.കെ.ജി – 4</option>
                <option>5 – 7</option>
                <option>8 – 10</option>
                <option>+1, +2</option>
              </select>
              <textarea name="message" rows={3} placeholder="സന്ദേശം" aria-label="സന്ദേശം" />
            </div>
            <button type="submit" className="btn btn-pink join-submit" disabled={sending}>അയക്കാം <ArrowRight size={15} /></button>
            {joined && <p className="join-note"><Star size={13} /> നന്ദി! ഞങ്ങൾ ഉടൻ ബന്ധപ്പെടും.</p>}
            {error && <p className="join-note"><span style={{ color: "#c62f2f" }}>{error}</span></p>}
          </form>
          <div className="join-faq">
            {faqs.map((f, i) => (
              <div key={f._id} className={`join-faq-item tone-${i % 4} ${faqOpen === i ? "open" : ""}`}>
                <button type="button" onClick={() => setFaqOpen(faqOpen === i ? null : i)} aria-expanded={faqOpen === i}>
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
  );
}
