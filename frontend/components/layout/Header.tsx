"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LocaleSwitcher } from "../LocaleSwitcher";
import { Logo } from "../Logo";
import type { AppLocale } from "@/tokens";

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

/* The three About chapters ride under one trigger, so the bar carries the same
   seven top-level items - and the same lg breakpoint - it always had. */
const ABOUT_GROUP: NavItem[] = [
  { slug: "about", label: "about" },
  { slug: "objectives", label: "objectives" },
  { slug: "global-presence", label: "globalPresence" },
];

const LINKS: NavItem[] = [
  { slug: "programs", label: "programs" },
  { slug: "events", label: "events" },
  { slug: "gallery", label: "gallery" },
  { slug: "leaders", label: "leaders" },
  { slug: "news", label: "news" },
  { slug: "contact", label: "contact" },
];

/* One string for both the bar links and the dropdown trigger, so the two never
   drift apart: same height, same padding, same sliding leaf underline. */
const BAR_ITEM =
  "relative inline-flex min-h-[44px] items-center rounded-lg px-3 transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-leaf after:transition-transform after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf";
const BAR_ON = "text-cocoa after:scale-x-100";
const BAR_OFF = "text-cocoa/70 after:scale-x-0 hover:text-cocoa hover:after:scale-x-100";

const SHEET_ITEM =
  "min-h-[44px] rounded-xl px-4 py-2.5 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf";

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 8"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 1.5 6 6.5 11 1.5" />
    </svg>
  );
}

export function Header({
  locale,
  nav,
  toggleLabel,
  joinLabel,
}: {
  locale: AppLocale;
  nav: NavLabels;
  toggleLabel: string;
  joinLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [sheetAboutOpen, setSheetAboutOpen] = useState(false);
  const pathname = usePathname();
  const aboutRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Never leave the mobile sheet or the dropdown hanging open across a route
     change. */
  useEffect(() => {
    setOpen(false);
    setAboutOpen(false);
  }, [pathname]);

  function isActive(slug: string): boolean {
    return pathname === `/${locale}/${slug}` || pathname.startsWith(`/${locale}/${slug}/`);
  }
  const homeActive = pathname === `/${locale}`;
  const aboutActive = ABOUT_GROUP.some((i) => isActive(i.slug));

  /* The panel opens on hover, so it must not vanish the instant the pointer
     crosses the seam between trigger and panel - a short grace period covers
     that, and re-entering cancels it. */
  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }
  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setAboutOpen(false), 140);
  }
  useEffect(() => cancelClose, []);

  /* A click elsewhere, or Escape, closes the dropdown - the first thing a
     pointer user and a keyboard user each reach for. */
  useEffect(() => {
    if (!aboutOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (!aboutRef.current?.contains(e.target as Node)) setAboutOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAboutOpen(false);
        aboutRef.current?.querySelector("button")?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [aboutOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-cocoa/10 bg-cream/90 backdrop-blur">
      {/* Hairline rule in the wordmark's own colors. */}
      <div
        aria-hidden="true"
        className="h-1 w-full bg-[linear-gradient(90deg,#EF3D42_0%,#F6974C_25%,#F5BC31_50%,#95B83D_75%,#10B5D7_100%)]"
      />
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link
          href={`/${locale}`}
          className="flex min-h-[44px] items-center rounded-2xl pr-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          aria-label={locale === "ml" ? "മലർവാടി ഹോം" : "Malarvadi home"}
        >
          <Logo priority className="h-9 sm:h-10" />
        </Link>

        <nav className="hidden items-center gap-0.5 text-sm font-semibold lg:flex" aria-label="primary">
          <Link
            href={`/${locale}`}
            aria-current={homeActive ? "page" : undefined}
            className={`${BAR_ITEM} ${homeActive ? BAR_ON : BAR_OFF}`}
          >
            {nav.home}
          </Link>

          {/* About Us: a dropdown over its three chapters. Hover opens it for a
              pointer, click and Enter/Space for everyone else. */}
          <div
            ref={aboutRef}
            className="relative"
            onMouseEnter={() => {
              cancelClose();
              setAboutOpen(true);
            }}
            onMouseLeave={scheduleClose}
            onFocus={() => {
              cancelClose();
              setAboutOpen(true);
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setAboutOpen(false);
            }}
          >
            <button
              type="button"
              aria-expanded={aboutOpen}
              aria-haspopup="true"
              onClick={() => setAboutOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setAboutOpen(true);
                }
              }}
              className={`${BAR_ITEM} gap-1.5 ${aboutActive || aboutOpen ? BAR_ON : BAR_OFF}`}
            >
              {nav.about}
              <Chevron className={`h-2 w-3 transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
            </button>

            {/* The padding sits on the wrapper, not the panel, so the pointer
                never crosses a dead strip on its way down to the links. */}
            {aboutOpen ? (
              <div className="absolute left-0 top-full z-50 pt-2">
                <div className="dropdown-in min-w-[15rem] rounded-cardLg bg-white p-2 shadow-soft ring-1 ring-cocoa/10">
                  {ABOUT_GROUP.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${locale}/${item.slug}`}
                      aria-current={isActive(item.slug) ? "page" : undefined}
                      onClick={() => setAboutOpen(false)}
                      className={`flex min-h-[44px] items-center whitespace-nowrap rounded-xl px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${
                        isActive(item.slug)
                          ? "bg-leaf/10 text-cocoa"
                          : "text-cocoa/75 hover:bg-cream hover:text-cocoa"
                      }`}
                    >
                      {nav[item.label]}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {LINKS.map((l) => (
            <Link
              key={l.slug}
              href={`/${locale}/${l.slug}`}
              aria-current={isActive(l.slug) ? "page" : undefined}
              className={`${BAR_ITEM} ${isActive(l.slug) ? BAR_ON : BAR_OFF}`}
            >
              {nav[l.label]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher current={locale} label={toggleLabel} />
          <Link
            href={`/${locale}/contact`}
            className="squish hidden min-h-[44px] items-center rounded-full bg-berry px-5 text-sm font-bold text-white shadow-playful transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berry focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:inline-flex"
          >
            {joinLabel}
          </Link>
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-lg ring-1 ring-cocoa/15 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? nav.close : nav.menu}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="dropdown-in border-t border-cocoa/10 bg-cream px-4 pb-4 pt-3 sm:px-6 lg:hidden" aria-label="mobile">
          <div className="grid gap-1">
            <Link
              href={`/${locale}`}
              aria-current={homeActive ? "page" : undefined}
              className={`${SHEET_ITEM} ${homeActive ? "bg-leaf/10 text-cocoa" : "text-cocoa/80 hover:bg-white"}`}
            >
              {nav.home}
            </Link>

            {/* Hover means nothing on a touch screen, so the same group becomes
                a tap-to-expand row - every child still its own 44px target. */}
            <button
              type="button"
              aria-expanded={sheetAboutOpen}
              onClick={() => setSheetAboutOpen((v) => !v)}
              className={`${SHEET_ITEM} flex w-full items-center justify-between text-left ${
                aboutActive ? "bg-leaf/10 text-cocoa" : "text-cocoa/80 hover:bg-white"
              }`}
            >
              {nav.about}
              <Chevron className={`h-2 w-3 transition-transform duration-200 ${sheetAboutOpen ? "rotate-180" : ""}`} />
            </button>
            {sheetAboutOpen ? (
              <div className="dropdown-in grid gap-1 border-l-2 border-leaf/25 pl-3">
                {ABOUT_GROUP.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${locale}/${item.slug}`}
                    aria-current={isActive(item.slug) ? "page" : undefined}
                    className={`${SHEET_ITEM} ${
                      isActive(item.slug) ? "bg-leaf/10 text-cocoa" : "text-cocoa/75 hover:bg-white"
                    }`}
                  >
                    {nav[item.label]}
                  </Link>
                ))}
              </div>
            ) : null}

            {LINKS.map((l) => (
              <Link
                key={l.slug}
                href={`/${locale}/${l.slug}`}
                aria-current={isActive(l.slug) ? "page" : undefined}
                className={`${SHEET_ITEM} ${isActive(l.slug) ? "bg-leaf/10 text-cocoa" : "text-cocoa/80 hover:bg-white"}`}
              >
                {nav[l.label]}
              </Link>
            ))}

            <Link
              href={`/${locale}/contact`}
              className="squish mt-1 inline-flex min-h-[44px] items-center justify-center rounded-full bg-berry px-5 font-bold text-white shadow-playful sm:hidden"
            >
              {joinLabel}
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
