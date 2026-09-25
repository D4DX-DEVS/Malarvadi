"use client";
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxItem {
  /** Image source — used when `embedSrc` is absent. */
  src?: string;
  /** Ready-built player URL (YouTube, Facebook or Instagram). */
  embedSrc?: string;
  caption?: string;
}

export default function Lightbox({ items, index, onClose, onIndex }: {
  items: LightboxItem[];
  /** null / -1 closes the lightbox. */
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null && index >= 0 && index < items.length;
  const go = useCallback((delta: number) => {
    if (index === null || items.length === 0) return;
    onIndex((index + delta + items.length) % items.length);
  }, [index, items.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose, go]);

  const item = open ? items[index!] : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="lightbox-stage" onClick={(e) => e.stopPropagation()}
            initial={{ scale: .94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .94, opacity: 0 }} transition={{ duration: .22 }}>
            <button className="lightbox-btn close" aria-label="അടയ്ക്കുക" onClick={onClose}><X size={20} /></button>
            {items.length > 1 && (
              <>
                <button className="lightbox-btn prev" aria-label="മുൻപത്തേത്" onClick={() => go(-1)}><ChevronLeft size={22} /></button>
                <button className="lightbox-btn next" aria-label="അടുത്തത്" onClick={() => go(1)}><ChevronRight size={22} /></button>
              </>
            )}
            {item.embedSrc ? (
              <div className="lightbox-frame">
                <iframe
                  src={item.embedSrc}
                  title={item.caption || "video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                />
              </div>
            ) : (
              <img className="lightbox-img" src={item.src} alt={item.caption || "gallery"} />
            )}
            {item.caption && <p className="lightbox-caption">{item.caption}</p>}
            {items.length > 1 && <span className="lightbox-count">{(index! + 1)} / {items.length}</span>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
