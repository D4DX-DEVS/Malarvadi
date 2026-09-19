"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppLocale } from "@/tokens";

/**
 * Language toggle that preserves the current page (swaps the locale segment).
 *
 * It is drawn as the small round button the reference sets between the menu
 * and the social badges. The disc shows the language it switches TO - the
 * Malayalam letter "മ" on English pages, "En" on Malayalam ones - and the full
 * name travels in the accessible label and tooltip.
 */
export function LocaleSwitcher({ current, label }: { current: AppLocale; label: string }) {
  const pathname = usePathname();
  const next = current === "en" ? "ml" : "en";
  const rest = pathname.replace(/^\/(en|ml)(?=\/|$)/, "") || "/";
  return (
    <Link
      href={`/${next}${rest === "/" ? "" : rest}`}
      hrefLang={next}
      onClick={() => {
        document.cookie = `malarvadi_locale=${next}; path=/; max-age=31536000; samesite=lax`;
      }}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cocoa/20 bg-white font-nav text-xs font-bold text-cocoa/75 transition-colors hover:bg-cocoa/5 hover:text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2"
      aria-label={label}
      title={label}
    >
      <span lang={next} aria-hidden="true">
        {next === "ml" ? "മ" : "En"}
      </span>
    </Link>
  );
}
