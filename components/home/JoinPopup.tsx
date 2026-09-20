"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Instagram, Youtube, MessageCircle, Sparkles, Star, X } from "lucide-react";
import { useSite } from "@/components/site-context";

/** Newsletter pop-up shown once per session. Copy comes from settings.popup. */
export default function JoinPopup() {
  const { popup, social } = useSite();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const close = () => {
    setOpen(false);
    try { sessionStorage.setItem("mv_join_seen", "1"); } catch {}
  };
  const enabled = popup.enabled !== false;
  useEffect(() => {
    if (!enabled) return;
    let seen = false;
    try { seen = sessionStorage.getItem("mv_join_seen") === "1"; } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 1400);
    return () => clearTimeout(t);
  }, [enabled]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  if (!enabled) return null;

  const community = [
    { href: social.facebook, label: "Facebook", icon: <Facebook size={15} /> },
    { href: social.instagram, label: "Instagram", icon: <Instagram size={15} /> },
    { href: social.youtube, label: "YouTube", icon: <Youtube size={15} /> },
    { href: social.whatsapp, label: "WhatsApp", icon: <MessageCircle size={15} /> },
  ];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "newsletter", data: { email } }),
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
    } catch {
      setError("ക്ഷമിക്കണം, അയക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കൂ.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="join-pop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }} onClick={close} role="dialog" aria-modal="true" aria-label={popup.title}>
          <motion.div className="join-pop-card" initial={{ scale: .92, y: 22, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: .95, opacity: 0 }} transition={{ type: "spring", stiffness: 190, damping: 20 }} onClick={(e) => e.stopPropagation()}>
            <img className="join-pop-kid" src="/kid-right.png" alt="" aria-hidden />
            <p className="join-pop-eyebrow"><Sparkles size={13} /> {popup.eyebrow}</p>
            <h4 className="join-pop-title">{popup.title}</h4>
            <p className="join-pop-sub">{popup.body}</p>
            <form className="join-pop-form" onSubmit={submit}>
              <input type="email" name="email" required placeholder="ഇമെയിൽ വിലാസം" aria-label="ഇമെയിൽ വിലാസം" />
              <button type="submit" disabled={sending}>അയക്കാം</button>
            </form>
            {done
              ? <p className="join-pop-thanks"><Star size={13} /> നന്ദി! ഞങ്ങൾ ഉടൻ ബന്ധപ്പെടും.</p>
              : <div className="join-pop-social">
                  {community.map((c) => (
                    <a key={c.label} href={c.href} target="_blank" rel="noreferrer" aria-label={c.label} title={c.label}>{c.icon}</a>
                  ))}
                </div>}
            {error && <p className="join-pop-thanks" style={{ color: "#ffd7d7" }}>{error}</p>}
          </motion.div>
          <button className="join-pop-close" onClick={close} aria-label="അടയ്ക്കാം"><X size={18} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
