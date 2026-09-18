"use client";

import { useState } from "react";
import type { Localized } from "@/lib/api";
import { pick } from "@/lib/api";

export interface AlbumImage {
  cdnUrl: string;
  caption?: Localized;
}

export function AlbumGrid({ images, locale }: { images: AlbumImage[]; locale: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const t =
    locale === "ml"
      ? { photo: "ചിത്രം", viewer: "ചിത്രം കാണുക", prev: "മുൻപത്തെ ചിത്രം", next: "അടുത്ത ചിത്രം", close: "അടയ്ക്കുക" }
      : { photo: "Photo", viewer: "photo viewer", prev: "previous photo", next: "next photo", close: "Close" };
  if (!images.length) return null;
  return (
    <>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            className="pop group overflow-hidden rounded-card bg-white shadow-playful hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.cdnUrl}
              alt={pick(locale, img.caption) || `${t.photo} ${i + 1}`}
              loading="lazy"
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {img.caption ? <span className="block px-3 py-2 text-left text-xs text-cocoa/70">{pick(locale, img.caption)}</span> : null}
          </button>
        ))}
      </div>
      {open !== null && images[open] ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/80 p-4" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={t.viewer}>
          <div className="max-h-[90vh] max-w-4xl overflow-auto rounded-card bg-white p-3" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[open].cdnUrl} alt={pick(locale, images[open].caption) || t.photo} className="max-h-[75vh] w-auto rounded-2xl" />
            <div className="flex items-center justify-between gap-3 p-2">
              <button onClick={() => setOpen((v) => (v! > 0 ? v! - 1 : v))} className="rounded-full bg-cocoa px-4 py-2 text-sm font-bold text-white" aria-label={t.prev}>←</button>
              <span className="text-sm text-cocoa/70">{open + 1} / {images.length}</span>
              <button onClick={() => setOpen((v) => (v! < images.length - 1 ? v! + 1 : v))} className="rounded-full bg-cocoa px-4 py-2 text-sm font-bold text-white" aria-label={t.next}>→</button>
            </div>
            <button onClick={() => setOpen(null)} className="mt-1 w-full rounded-full bg-marigold px-4 py-2 text-sm font-bold text-cocoa">{t.close}</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
