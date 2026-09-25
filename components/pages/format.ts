// Small shared formatting helpers for the inner pages.
// Plain module (no "use client") so both server pages and client views can import it.

export const ML_MONTHS = ["ജനു", "ഫെബ്", "മാർ", "ഏപ്ര", "മേയ്", "ജൂൺ", "ജൂലൈ", "ഓഗ", "സെപ്", "ഒക്ടോ", "നവം", "ഡിസം"];

function parts(iso: string): { d: number; m: number; y: number } | null {
  if (!iso) return null;
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return null;
  return { d: t.getUTCDate(), m: t.getUTCMonth(), y: t.getUTCFullYear() };
}

/** "സെപ് 21" — short day+month, used on the programs calendar. */
export function shortDate(iso: string): string {
  const p = parts(iso);
  if (!p) return iso || "";
  return `${ML_MONTHS[p.m]} ${p.d}`;
}

/** "21 സെപ് 2025" — full date line on news / blog cards. */
export function longDate(iso: string): string {
  const p = parts(iso);
  if (!p) return iso || "";
  return `${p.d} ${ML_MONTHS[p.m]} ${p.y}`;
}

/** Split a plain-text body into paragraphs (blank-line separated). */
export function paragraphs(body?: string): string[] {
  if (!body) return [];
  return body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

/** Last path segment of a social URL → "@handle". */
export function handleOf(url: string): string {
  const seg = (url || "").replace(/\/+$/, "").split("/").pop() || "";
  return seg ? (seg.startsWith("@") ? seg : `@${seg}`) : "";
}
