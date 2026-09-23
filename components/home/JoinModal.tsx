"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Star, X } from "lucide-react";

/** Global "അംഗമാവുക" membership popup — same fields as the home join form, openable from any page via useJoinModal(). */
export default function JoinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  useEffect(() => {
    if (open) { setJoined(false); setError(""); }
  }, [open]);

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "");
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "join",
          data: { name: get("name"), unit: get("unit"), place: get("place"), phone: get("phone"), email: get("email"), grade: get("grade") },
        }),
      });
      if (!res.ok) throw new Error("failed");
      setJoined(true);
      form.reset();
    } catch {
      setError("ക്ഷമിക്കണം, അയക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കൂ.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="join-pop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="അംഗമാവുക"
        >
          <motion.div
            className="join-pop-card"
            style={{ maxWidth: 460, background: "#fff", textAlign: "left" }}
            initial={{ scale: 0.92, y: 22, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 190, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="join-pop-eyebrow" style={{ background: "#e4f7fc", color: "#0d7f99", border: "1px solid #cdeef7" }}>
              <Sparkles size={13} /> ചേരാം • Join Us
            </p>
            <h4 className="join-pop-title" style={{ color: "#0d7f99", textShadow: "none", fontSize: "clamp(20px,4vw,26px)" }}>
              മലർവാടിയിൽ അംഗമാവാം
            </h4>
            {joined ? (
              <p className="join-note" style={{ marginTop: 4 }}><Star size={13} /> നന്ദി! ഞങ്ങൾ ഉടൻ ബന്ധപ്പെടും.</p>
            ) : (
              <form onSubmit={handleJoin}>
                <div className="join-fields">
                  <input required name="name" placeholder="പേര് *" aria-label="പേര്" />
                  <input name="unit" placeholder="യൂണിറ്റ്" aria-label="യൂണിറ്റ്" />
                  <input required name="place" placeholder="സ്ഥലം *" aria-label="സ്ഥലം" />
                  <input
                    required
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="മൊബൈൽ നമ്പർ *"
                    aria-label="മൊബൈൽ നമ്പർ"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="10 അക്ക മൊബൈൽ നമ്പർ നൽകുക"
                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10); }}
                  />
                  <input name="email" type="email" placeholder="ഇമെയിൽ" aria-label="ഇമെയിൽ" />
                  <select name="grade" aria-label="ക്ലാസ്" defaultValue="" required>
                    <option value="" disabled>ക്ലാസ് തിരഞ്ഞെടുക്കാം *</option>
                    <option>എൽ.കെ.ജി – 4</option>
                    <option>5 – 7</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-pink join-submit" disabled={sending}>
                  അയക്കാം <ArrowRight size={15} />
                </button>
                {error && <p className="join-note" style={{ color: "#c62f2f" }}>{error}</p>}
              </form>
            )}
          </motion.div>
          <button className="join-pop-close" onClick={onClose} aria-label="അടയ്ക്കാം"><X size={18} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
