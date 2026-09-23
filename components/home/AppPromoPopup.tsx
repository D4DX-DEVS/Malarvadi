"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSite } from "@/components/site-context";

/**
 * Site-open popup: the app promo banner, shown once per session.
 *
 * Replaces the old newsletter sign-up popup. The banner is a single designed
 * image (uploaded via Site settings → Popup → Image); two invisible hotspots
 * sit over its App Store / Google Play buttons, positioned from the current
 * artwork's exact pixel bounds (see .app-pop-hotspot in globals.css) - retune
 * those percentages if the banner is ever replaced. Nothing shows until an
 * image is set, so there is no broken-image flash on a fresh install.
 */
export default function AppPromoPopup() {
  const { app, popup } = useSite();
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
    try { sessionStorage.setItem("mv_join_seen", "1"); } catch {}
  };
  const enabled = popup.enabled !== false && !!popup.image;
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="join-pop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={app.eyebrow || "App"}
        >
          <motion.div
            className="app-pop-card"
            initial={{ scale: 0.92, y: 22, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 190, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img className="app-pop-img" src={popup.image} alt={app.eyebrow || "മലർവാടി ആപ്പ്"} />
            {app.appStore && <a className="app-pop-hotspot app-pop-hs-l" href={app.appStore} target="_blank" rel="noreferrer" aria-label="Download on the App Store" />}
            {app.playStore && <a className="app-pop-hotspot app-pop-hs-r" href={app.playStore} target="_blank" rel="noreferrer" aria-label="Get it on Google Play" />}
          </motion.div>
          <button className="join-pop-close" onClick={close} aria-label="അടയ്ക്കാം"><X size={18} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
