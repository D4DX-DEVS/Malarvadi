"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Hand, FileText, Heart, Map, MessageCircle, Camera, Youtube, AlertCircle } from "lucide-react";
import { Header, Footer, PageHero } from "@/components/site";
import { useSite, telHref } from "@/components/site-context";
import { handleOf, waHref } from "./format";

const SUBJECTS = ["അഡ്മിഷൻ", "പുതിയ യൂണിറ്റ്", "വളണ്ടിയർ / മെന്റർ", "മറ്റുള്ളവ"];

export default function ContactView() {
  const settings = useSite();
  const { contact, social, pages } = settings;
  const p = pages.contact;
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      place: String(fd.get("place") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
    };
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "contact", data }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "അയക്കാനായില്ല");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "എന്തോ പിഴവ് — വീണ്ടും ശ്രമിക്കൂ.");
    } finally {
      setSending(false);
    }
  }

  const igHandle = handleOf(social.instagram);

  return (
    <div className="page page-inner">
      <Header />
      <div className="wrap">
        <PageHero kicker={p.kicker} title={p.title} sub={p.sub} icon={<Hand size={56} strokeWidth={1.8} />} />
        <div className="contact-grid">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="form-card">
            {!sent ? (
              <form onSubmit={submit}>
                <h4 style={{ margin: "0 0 4px", display: "flex", alignItems: "center", gap: 7 }}><FileText size={20} /> സന്ദേശം അയക്കൂ</h4>
                <p style={{ fontSize: 13.5, color: "#777", margin: "0 0 6px" }}>24 മണിക്കൂറിനുള്ളിൽ മറുപടി നൽകും.</p>
                <label>പേര് *</label><input name="name" required placeholder="നിങ്ങളുടെ പേര്" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <span><label>ഫോൺ *</label><input name="phone" required placeholder="+91 ..." /></span>
                  <span><label>സ്ഥലം</label><input name="place" placeholder="ഉദാ: മലപ്പുറം" /></span>
                </div>
                <label>വിഷയം</label>
                <select name="subject" defaultValue={SUBJECTS[0]}>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select>
                <label>സന്ദേശം *</label><textarea name="message" required rows={4} placeholder="എഴുതൂ..." />
                {error && (
                  <p style={{ display: "flex", alignItems: "center", gap: 6, margin: "12px 0 0", fontSize: 14, fontWeight: 800, color: "#d93a72" }}>
                    <AlertCircle size={15} /> {error}
                  </p>
                )}
                <button className="btn btn-green" style={{ marginTop: 12, opacity: sending ? .65 : 1 }} type="submit" disabled={sending}>
                  <Send size={15} /> {sending ? "അയക്കുന്നു..." : "അയക്കൂ"}
                </button>
              </form>
            ) : (
              <motion.div initial={{ scale: .92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", padding: "30px 10px" }}>
                <CheckCircle size={52} color="#1f9d55" />
                <h4 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>നന്ദി! സന്ദേശം ലഭിച്ചു <Heart size={18} fill="currentColor" /></h4>
                <p style={{ fontSize: 15, color: "#666" }}>ഞങ്ങളുടെ ടീം ഉടൻ ബന്ധപ്പെടും. മലർവാടിയിലേക്ക് സ്വാഗതം!</p>
                <button className="btn btn-pink" onClick={() => setSent(false)}>വേറൊന്ന് അയക്കൂ</button>
              </motion.div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}>
            <div className="sub-card" style={{ background: "#0a3d2e", color: "#d8efe3", borderColor: "#0a3d2e" }}>
              <h4 style={{ color: "#ffd23f", display: "flex", alignItems: "center", gap: 7 }}><MapPin size={20} /> {contact.orgName}</h4>
              <p style={{ color: "#bfe3cf" }}>
                <MapPin size={13} /> {contact.address}<br />
                <Phone size={13} /> {contact.phone}<br />
                <Mail size={13} /> {contact.email}<br />
                <Clock size={13} /> {contact.hours}
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <a className="btn btn-pink" href={telHref(contact.phone)}><Phone size={14} /> വിളിക്കൂ</a>
                <a className="btn" style={{ background: "#fff" }} href={`mailto:${contact.email}`}><Mail size={14} /> മെയിൽ</a>
              </div>
            </div>
            <div className="sub-card" style={{ marginTop: 12 }}>
              <h4 style={{ display: "flex", alignItems: "center", gap: 7 }}><Map size={20} /> യൂണിറ്റ് കണ്ടെത്തൂ</h4>
              <p>1500+ യൂണിറ്റുകൾ — നിങ്ങളുടെ അടുത്തുള്ളത് അറിയാൻ നിങ്ങളുടെ സ്ഥലം <b>{contact.whatsapp}</b> -നമ്പറിലേക്ക് വാട്ട്സ്ആപ്പ് ചെയ്യൂ.</p>
              <div style={{ background: "#fff7dd", borderRadius: 14, padding: 14, fontSize: 14.5, lineHeight: 1.95 }}>
                <MessageCircle size={14} /> വാട്ട്സ്ആപ്പ്: <a href={waHref(contact.whatsapp)} target="_blank" rel="noreferrer"><b>{contact.whatsapp}</b></a><br />
                <Camera size={14} /> ഇൻസ്റ്റാഗ്രാം: <a href={social.instagram} target="_blank" rel="noreferrer"><b>{igHandle}</b></a><br />
                <Youtube size={14} /> യൂട്യൂബ്: <a href={social.youtube} target="_blank" rel="noreferrer"><b>YouTube</b></a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
