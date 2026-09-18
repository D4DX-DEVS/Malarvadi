import fs from "node:fs";
import path from "node:path";

/**
 * Photography is optional. Files dropped into `public/images` (see the README
 * there) light up the photo slots across the site; anything missing falls back
 * to an illustrated panel of exactly the same size, so the layout is identical
 * either way and nothing ever renders as a broken image.
 *
 * Server-only: this reads the filesystem, so it must not be imported from a
 * "use client" module.
 */
const DIR = path.join(process.cwd(), "public", "images");
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

let cache: Set<string> | null = null;

function available(): Set<string> {
  // Re-read every call in dev so a newly dropped file shows up on refresh;
  // read once in production where the folder cannot change under us.
  if (cache && process.env.NODE_ENV === "production") return cache;
  try {
    cache = new Set(fs.readdirSync(DIR));
  } catch {
    cache = new Set();
  }
  return cache;
}

/** Resolve a bare slot name ("hero") to a public URL, or null if absent. */
export function photoSrc(name: string): string | null {
  const files = available();
  for (const ext of EXTENSIONS) {
    if (files.has(name + ext)) return `/images/${name}${ext}`;
  }
  return null;
}

/** True when at least one photo has been supplied. */
export function hasPhotos(): boolean {
  return available().size > 1; // the folder always contains README.md
}
