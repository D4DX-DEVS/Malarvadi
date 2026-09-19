"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SocialLink } from "@/lib/site";
import type { AppLocale } from "@/tokens";
import { LocaleSwitcher } from "../LocaleSwitcher";
import { Logo } from "../Logo";
import { SocialIcons } from "../SocialIcons";

export interface NavLabels {
  home: string;
  about: string;
  objectives: string;
  globalPresence: string;
  programs: string;
  events: string;
  leaders: string;
  news: string;
  gallery: string;
  contact: string;
  menu: string;
  close: string;
}

/* `slug` is the route segment, `label` the key in the nav dictionary - the two
   differ only where a label needs more than one word in the URL. */
interface NavItem {
  slug: string;
  label: keyof NavLabels;
}

type Tone = "teal" | "orange" | "green" | "yellow" | "pink";

interface NavGroup extends NavItem {
  tone: Tone;
  /** Pages that ride under this pill as a dropdown; the first is the pill's own page. */
  children?: NavItem[];
}

/* The five pills the reference draws, in its five colours. Pages without a
   pill of their own ride under the nearest one, so the bar stays five items
   wide while every page remains one hover away. */
const GROUPS: NavGroup[] = [
  { slug: "", label: "home", tone: "teal" },
  {
    slug: "about",
    label: "about",
    tone: "orange",
    children: [
      { slug: "about", label: "about" },
      { slug: "objectives", label: "objectives" },
      { slug: "global-presence", label: "globalPresence" },
      { slug: "leaders", label: "leaders" },
    ],
  },
  {
    slug: "programs",
    label: "programs",
    tone: "green",
    children: [
      { slug: "programs", label: "programs" },
      { slug: "events", label: "events" },
    ],
  },
  {
    slug: "gallery",
    label: "gallery",
    tone: "yellow",
    children: [
      { slug: "gallery", label: "gallery" },
      { slug: "news", label: "news" },
    ],
  },
  { slug: "contact", label: "contact", tone: "pink" },
];

/* Filled when it is the current section, a thin outline otherwise - the
   reference's teal, orange, green, gold and pink. The outlined text is a shade
   darker than its border so it reads at AA on white. */
const TONES: Record<Tone, { on: string; off: string; item: string }> = {
  teal: { on: "border-[#2FA9C9] bg-[#2FA9C9] text-white", off: "border-[#2FA9C9] text-[#137F9E] hover:bg-[#2FA9C9]/10", item: "hover:bg-[#2FA9C9]/10" },
  orange: { on: "border-[#F26B3A] bg-[#F26B3A] text-white", off: "border-[#F26B3A] text-[#D84E1F] hover:bg-[#F26B3A]/10", item: "hover:bg-[#F26B3A]/10" },
  green: { on: "border-[#1F8F73] bg-[#1F8F73] text-white", off: "border-[#1F8F73] text-[#1F8F73] hover:bg-[#1F8F73]/10", item: "hover:bg-[#1F8F73]/10" },
  yellow: { on: "border-[#C9962E] bg-[#C9962E] text-white", off: "border-[#C9962E] text-[#9A6B12] hover:bg-[#C9962E]/10", item: "hover:bg-[#C9962E]/10" },
  pink: { on: "border-[#F0567A] bg-[#F0567A] text-white", off: "border-[#F0567A] text-[#DB3E63] hover:bg-[#F0567A]/10", item: "hover:bg-[#F0567A]/10" },
};

/* The top-level pills, the dropdown panels under them and the mobile sheet
   are all English chrome (the whole header lives inside a lang="en"
   wrapper - see the locale layout) and share one font: the page's own
   display face, never the Malayalam body serif, on every locale. */
const PILL =
  "inline-flex min-h-[34px] items-center rounded-full border px-3.5 font-nav text-[15px] font-semibold leading-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2";

const SHEET_ITEM =
  "min-h-[44px] rounded-xl px-4 py-2.5 font-nav font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf";

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 8" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 1.5 6 6.5 11 1.5" />
    </svg>
  );
}

export function Header({
  locale,
  nav,
  toggleLabel,
  socials,
}: {
  locale: AppLocale;
  nav: NavLabels;
  toggleLabel: string;
  socials: SocialLink[];
}) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const barRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Never leave the mobile sheet or a dropdown hanging open across a route change. */
  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  function isActive(slug: string): boolean {
    if (!slug) return pathname === `/${locale}`;
    return pathname === `/${locale}/${slug}` || pathname.startsWith(`/${locale}/${slug}/`);
  }
  const groupActive = (g: NavGroup) => isActive(g.slug) || (g.children ?? []).some((c) => isActive(c.slug));
  const hrefOf = (slug: string) => (slug ? `/${locale}/${slug}` : `/${locale}`);

  /* A panel opens on hover, so it must not vanish the instant the pointer
     crosses the seam between pill and panel - a short grace period covers
     that, and re-entering cancels it. */
  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }
  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenGroup(null), 140);
  }
  useEffect(() => cancelClose, []);

  /* A click elsewhere, or Escape, closes an open dropdown. */
  useEffect(() => {
    if (!openGroup) return;
    function onPointerDown(e: PointerEvent) {
      if (!barRef.current?.contains(e.target as Node)) setOpenGroup(null);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenGroup(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openGroup]);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_rgba(43,33,23,0.04)]">
      <div className="mx-auto flex min-h-[76px] w-full max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Link
          href={`/${locale}`}
          className="flex min-h-[44px] shrink-0 items-center rounded-2xl pr-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2"
          aria-label={locale === "ml" ? "മലർവാടി ഹോം" : "Malarvadi home"}
        >
          <Logo priority className="h-11 sm:h-14" />
        </Link>

        <nav ref={barRef} className="hidden items-center gap-2.5 lg:flex" aria-label="primary">
          {GROUPS.map((g) => {
            const tone = TONES[g.tone];
            const active = groupActive(g);
            const pill = `${PILL} ${active ? tone.on : tone.off}`;

            if (!g.children) {
              return (
                <Link key={g.slug || "home"} href={hrefOf(g.slug)} aria-current={active ? "page" : undefined} className={pill}>
                  {nav[g.label]}
                </Link>
              );
            }

            const isOpen = openGroup === g.slug;
            return (
              /* The pill is a real link to the group's own page; hovering or
                 focusing it opens the panel, so pointer and keyboard users
                 each get there in one move. */
              <div
                key={g.slug}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenGroup(g.slug);
                }}
                onMouseLeave={scheduleClose}
                onFocus={() => {
                  cancelClose();
                  setOpenGroup(g.slug);
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenGroup(null);
                }}
              >
                <Link
                  href={hrefOf(g.slug)}
                  aria-current={isActive(g.slug) ? "page" : undefined}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpenGroup(g.slug);
                      (e.currentTarget.parentElement?.querySelector("[data-panel] a") as HTMLElement | null)?.focus();
                    }
                  }}
                  className={pill}
                >
                  {nav[g.label]}
                </Link>

                {/* The padding sits on the wrapper, not the panel, so the
                    pointer never crosses a dead strip on its way down. */}
                {isOpen ? (
                  <div data-panel className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
                    <div className="dropdown-in min-w-[14rem] rounded-2xl bg-white p-2 shadow-soft ring-1 ring-cocoa/10">
                      {g.children.map((item) => (
                        <Link
                          key={item.slug}
                          href={hrefOf(item.slug)}
                          aria-current={isActive(item.slug) ? "page" : undefined}
                          onClick={() => setOpenGroup(null)}
                          className={`flex min-h-[44px] items-center whitespace-nowrap rounded-xl px-3 font-nav text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${
                            isActive(item.slug) ? "bg-cocoa/5 text-cocoa" : `text-cocoa/75 hover:text-cocoa ${tone.item}`
                          }`}
                        >
                          {nav[item.label]}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher current={locale} label={toggleLabel} />
          <SocialIcons items={socials} size="h-7 w-7" className="hidden md:flex" />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg ring-1 ring-cocoa/15 transition-colors hover:bg-cocoa/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? nav.close : nav.menu}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="dropdown-in border-t border-cocoa/10 bg-white px-4 pb-4 pt-3 sm:px-6 lg:hidden" aria-label="mobile">
          <div className="grid gap-1">
            {GROUPS.map((g) => {
              const tone = TONES[g.tone];
              const active = groupActive(g);
              if (!g.children) {
                return (
                  <Link
                    key={g.slug || "home"}
                    href={hrefOf(g.slug)}
                    aria-current={active ? "page" : undefined}
                    className={`${SHEET_ITEM} ${active ? "bg-cocoa/5 text-cocoa" : `text-cocoa/80 ${tone.item}`}`}
                  >
                    {nav[g.label]}
                  </Link>
                );
              }
              const expanded = Boolean(sheetOpen[g.slug]);
              return (
                <div key={g.slug}>
                  {/* Hover means nothing on a touch screen, so the group becomes
                      a tap-to-expand row - every child still its own 44px target. */}
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setSheetOpen((s) => ({ ...s, [g.slug]: !expanded }))}
                    className={`${SHEET_ITEM} flex w-full items-center justify-between text-left ${
                      active ? "bg-cocoa/5 text-cocoa" : `text-cocoa/80 ${tone.item}`
                    }`}
                  >
                    {nav[g.label]}
                    <Chevron className={`h-2 w-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
                  </button>
                  {expanded ? (
                    <div className="dropdown-in mt-1 grid gap-1 border-l-2 border-cocoa/10 pl-3">
                      {g.children.map((item) => (
                        <Link
                          key={item.slug}
                          href={hrefOf(item.slug)}
                          aria-current={isActive(item.slug) ? "page" : undefined}
                          className={`${SHEET_ITEM} ${isActive(item.slug) ? "bg-cocoa/5 text-cocoa" : `text-cocoa/75 ${tone.item}`}`}
                        >
                          {nav[item.label]}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}

            <SocialIcons items={socials} size="h-9 w-9" className="mt-2 px-1 md:hidden" />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
