import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The header that opens each of the four panels in the lower half of the home
 * page - news, posters, pictures, videos.
 *
 * It is one component rather than four copies because the reference draws them
 * identically: a coloured emblem, the panel title beside it, and a small white
 * pill link to the full section pushed to the far right. Only the emblem's
 * colour changes.
 */
export function PanelHead({
  title,
  sub,
  href,
  linkLabel,
  icon,
  /** Colour of the emblem; the title keeps the panel's deep green. */
  tone = "text-coral",
  titleTone = "text-[#245C3A]",
  className = "",
}: {
  title: string;
  sub?: string;
  href: string;
  linkLabel: string;
  icon: ReactNode;
  tone?: string;
  titleTone?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-3 ${className}`}>
      <div className="flex min-w-0 items-center gap-2.5">
        <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center ${tone}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className={`font-display text-xl font-bold leading-tight sm:text-2xl ${titleTone}`}>{title}</h2>
          {sub ? <p className="mt-0.5 text-xs text-cocoa/60">{sub}</p> : null}
        </div>
      </div>

      <Link
        href={href}
        className="squish inline-flex min-h-[32px] shrink-0 items-center gap-1.5 self-center rounded-full bg-white px-3.5 text-[11px] font-bold text-cocoa/80 ring-1 ring-cocoa/15 transition-all duration-200 hover:-translate-y-0.5 hover:text-cocoa hover:shadow-playful focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
      >
        {linkLabel}
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
