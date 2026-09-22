"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

/** Blocks on inner pages that should fade in as they scroll into view. */
const AUTO_REVEAL = ".page-inner .sub-card, .page-inner .about-doc-card, .page-inner .filter-row, .page-inner .prose";

/**
 * Scroll reveal + back-to-top, shared by every public page.
 *
 * Toggles (not adds) `.in` so a block replays its intro whenever it scrolls
 * back into view. The negative bottom margin holds the trigger until the block
 * is properly on screen.
 */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(`.reveal, ${AUTO_REVEAL}`));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("in", e.isIntersecting)),
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function PageEffects() {
  useReveal();
  return (
    <motion.a
      href="#"
      className="to-top"
      aria-label="മുകളിലേക്ക്"
      onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      whileHover={{ scale: 1.12, rotate: -8 }}
      style={{
        position: "fixed", right: 16, bottom: 16, zIndex: 60, width: 48, height: 48,
        borderRadius: "50%", background: "#ef3f3f", color: "#fff", display: "grid",
        placeItems: "center", boxShadow: "0 14px 28px rgba(239,63,63,.4)",
        fontWeight: 800, border: "3px solid #fff",
      }}
    >
      ↑
    </motion.a>
  );
}
