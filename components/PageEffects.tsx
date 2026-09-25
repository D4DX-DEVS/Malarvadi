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
      title="മുകളിലേക്ക്"
      onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      whileHover={{ scale: 1.12, rotate: -8 }}
    >
      {/* A pencil standing on its eraser - the sharpened tip is the "up". */}
      <svg viewBox="0 0 24 24" width="23" height="23" fill="none" aria-hidden focusable="false">
        <path d="M12 2.4 16.4 9.4H7.6L12 2.4Z" fill="#fff8ec" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M10.4 6.9h3.2l1.2 2.5H9.2l1.2-2.5Z" fill="#0d3945" />
        <path d="M7.6 9.4h8.8v7.4H7.6z" fill="#ffd23f" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 11v4" stroke="#e8a900" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M8.6 16.8h6.8a1.2 1.2 0 0 1 1.2 1.2v1.4a2 2 0 0 1-2 2h-5.2a2 2 0 0 1-2-2V18a1.2 1.2 0 0 1 1.2-1.2Z"
          fill="#ff9dc6" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </motion.a>
  );
}
