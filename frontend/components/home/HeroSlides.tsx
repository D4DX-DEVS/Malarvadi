"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

/**
 * The reference banner's outline, in a 0..1 box so it stretches to any aspect
 * ratio: a rounded rectangle whose long edges rise into two soft humps with a
 * shallow dip between them, and whose short edges bow gently outward. The same
 * path draws the white rim (filled, with the shadow) and, scaled a little
 * inward, clips the picture inside it.
 */
export const BANNER_SHAPE =
  "M0.08 0.10 C0.14 0.02 0.22 0.01 0.30 0.03 C0.38 0.05 0.44 0.09 0.50 0.09 C0.56 0.09 0.62 0.05 0.70 0.03 C0.78 0.01 0.86 0.02 0.92 0.10 C0.97 0.16 1.00 0.32 1.00 0.50 C1.00 0.68 0.97 0.84 0.92 0.90 C0.86 0.98 0.78 0.99 0.70 0.97 C0.62 0.95 0.56 0.91 0.50 0.91 C0.44 0.91 0.38 0.95 0.30 0.97 C0.22 0.99 0.14 0.98 0.08 0.90 C0.03 0.84 0.00 0.68 0.00 0.50 C0.00 0.32 0.03 0.16 0.08 0.10 Z";

const INTERVAL = 6000;

/**
 * The banner frame and, when more than one picture is supplied, a quiet
 * slideshow between them with the reference's row of dots underneath.
 *
 * With no pictures at all the drawn garden passed as `fallback` is the one and
 * only slide and no dots are shown - a single dot would promise a carousel
 * that is not there. Auto-advance pauses while the pointer or focus is on the
 * banner and is switched off for reduced-motion visitors.
 */
export function HeroSlides({
  slides,
  alt,
  fallback,
  slideLabel,
}: {
  slides: string[];
  alt: string;
  fallback: ReactNode;
  /** Accessible name for a dot, with "{n}" replaced by the slide number. */
  slideLabel: string;
}) {
  const count = Math.max(slides.length, 1);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearInterval(id);
  }, [count, paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* The white rim, carrying the shadow. */}
      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full overflow-visible"
        style={{ filter: "drop-shadow(0 16px 26px rgba(43, 33, 23, 0.2))" }}
      >
        <path d={BANNER_SHAPE} fill="#fff" />
      </svg>
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <clipPath id="hero-banner-clip" clipPathUnits="objectBoundingBox">
            <path d={BANNER_SHAPE} transform="translate(0.010 0.024) scale(0.980 0.952)" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9]" style={{ clipPath: "url(#hero-banner-clip)" }}>
        {slides.length ? (
          slides.map((src, i) => (
            <div
              key={src}
              aria-hidden={i !== index || undefined}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${i === index ? "opacity-100" : "opacity-0"}`}
            >
              <Image src={src} alt={i === index ? alt : ""} fill sizes="(max-width: 1152px) 100vw, 1000px" priority={i === 0} className="object-cover" />
            </div>
          ))
        ) : (
          <div className="absolute inset-0">{fallback}</div>
        )}
      </div>

      {count > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label={alt}>
          {slides.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={slideLabel.replace("{n}", String(i + 1))}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 ${
                i === index ? "w-2.5 bg-cocoa/80" : "w-2.5 bg-cocoa/20 hover:bg-cocoa/40"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
