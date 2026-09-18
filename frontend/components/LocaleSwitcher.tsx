"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppLocale } from "@/tokens";

/** Language toggle that preserves the current page (swaps locale segment). */
export function LocaleSwitcher({ current, label }: { current: AppLocale; label: string }) {
  const pathname = usePathname();
  const next = current === "en" ? "ml" : "en";
  const rest = pathname.replace(/^\/(en|ml)(?=\/|$)/, "") || "/";
  return (
    <Link
      href={`/${next}${rest === "/" ? "" : rest}`}
      onClick={() => {
        document.cookie = `malarvadi_locale=${next}; path=/; max-age=31536000; samesite=lax`;
      }}
      className="inline-flex min-h-[40px] items-center rounded-xl px-3.5 text-sm font-bold text-cocoa/80 ring-1 ring-cocoa/15 transition-colors hover:bg-white hover:text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
      aria-label="switch language"
    >
      {label}
    </Link>
  );
}
