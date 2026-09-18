import Link from "next/link";
import type { ReactNode } from "react";
import { pick, type Localized } from "@/lib/api";
import { Sparkle, Sprout } from "./Decor";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Button({
  href,
  children,
  variant = "primary",
  locale,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "dark" | "soft" | "berry";
  locale?: string;
}) {
  const lift = "hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.97]";
  const styles =
    variant === "primary"
      ? `bg-marigold text-cocoa ${lift}`
      : variant === "berry"
        ? `bg-berry text-white ${lift}`
        : variant === "dark"
          ? `bg-cocoa text-white ${lift}`
          : `bg-white text-cocoa ring-1 ring-cocoa/15 hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0 active:scale-[0.97]`;
  return (
    <Link
      href={href}
      hrefLang={locale}
      className={`squish group inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-bold shadow-playful transition-all duration-200 ${styles}`}
    >
      {children}
      {/* The sparkle is the primary call to action's flourish only - secondary
          buttons repeat often enough that it would read as noise. */}
      {variant === "primary" || variant === "berry" ? (
        <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
          <Sparkle className="h-3.5 w-3.5 group-hover:animate-wiggle" />
        </span>
      ) : null}
    </Link>
  );
}

export function Badge({ children, tone = "leaf" }: { children: ReactNode; tone?: "leaf" | "plum" | "teal" | "marigold" }) {
  const map = {
    // Deepened text tones for WCAG AA contrast on tinted backgrounds.
    leaf: "bg-leaf/15 text-[#1e7a4e]",
    plum: "bg-plum/10 text-plum",
    teal: "bg-teal/15 text-[#0f766e]",
    marigold: "bg-marigold/30 text-cocoa",
  } as const;
  return <span className={`badge-wrap inline-block rounded-full px-3 py-1 text-xs font-bold ${map[tone]}`}>{children}</span>;
}

export function SectionHeading({ title, sub, kicker }: { title: string; sub?: string; kicker?: string }) {
  return (
    <div className="max-w-2xl">
      {kicker ? <p className="t-micro mb-2 text-leaf">{kicker}</p> : null}
      <h2 className="t-h2">{title}</h2>
      {sub ? <p className="t-body mt-2">{sub}</p> : null}
    </div>
  );
}

/**
 * The pill filter that sits above the programs and leaders grids. One
 * component so the two pages cannot drift apart in height, padding or hover
 * behaviour - they were carrying the same twelve utility classes twice.
 */
export function FilterChip({ href, active = false, children }: { href: string; active?: boolean; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={`squish inline-flex min-h-[44px] items-center rounded-full px-5 text-sm font-bold shadow-playful transition-all duration-200 ${
        active ? "bg-berry text-white" : "bg-white text-cocoa ring-1 ring-cocoa/15 hover:-translate-y-0.5 hover:shadow-soft"
      }`}
    >
      {children}
    </a>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`pop rounded-card bg-white p-5 shadow-playful hover:shadow-soft ${className}`}>{children}</div>;
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="animate-fade-up rounded-card bg-white/70 p-8 text-center">
      <Sprout className="mx-auto h-10 w-10 animate-sway text-leaf/60" />
      <p className="t-meta mt-2">{text}</p>
    </div>
  );
}

export function ErrorState({ text, retry }: { text: string; retry: string }) {
  return (
    <div className="rounded-card bg-white p-8 text-center">
      <p className="t-meta text-cocoa/80">{text}</p>
      <a href="." className="pop mt-3 inline-block rounded-full bg-cocoa px-5 py-2 text-sm font-bold text-white">
        {retry}
      </a>
    </div>
  );
}

export interface CardDoc {
  slug: string;
  title: Localized;
  coverImage?: string;
}

export function CoverArt({ title, tone = 0 }: { title: string; tone?: number }) {
  // Original CSS-only cover art (no copied assets): layered garden shapes.
  const tones = ["from-leaf/70 to-teal/60", "from-marigold/80 to-leaf/50", "from-plum/60 to-teal/50", "from-teal/60 to-leaf/50"];
  const t = tones[tone % tones.length];
  return (
    <div className={`relative h-36 overflow-hidden rounded-2xl bg-gradient-to-br ${t}`} aria-hidden="true">
      <svg viewBox="0 0 200 80" className="absolute bottom-0 h-16 w-full" preserveAspectRatio="none">
        <path d="M0 55 Q 25 35 50 50 T 100 48 T 150 52 T 200 45 L200 80 L0 80 Z" fill="rgba(255,255,255,0.55)" />
        <circle cx="165" cy="20" r="12" fill="rgba(255,255,255,0.7)" />
      </svg>
      <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2 py-0.5 font-display text-lg font-bold text-cocoa/70">
        {title.slice(0, 1)}
      </span>
    </div>
  );
}

export function ListingCard({
  href,
  title,
  excerpt,
  badge,
  demo,
  demoLabel,
  index = 0,
}: {
  href: string;
  title: string;
  excerpt?: string;
  badge?: string;
  demo?: boolean;
  demoLabel?: string;
  index?: number;
}) {
  return (
    <Link href={href} className="pop group flex h-full flex-col rounded-card bg-white p-5 shadow-playful hover:shadow-soft">
      <CoverArt title={title} tone={index} />
      <div className="mt-3 flex items-center gap-2">
        {badge ? <Badge tone="leaf">{badge}</Badge> : null}
        {demo ? <Badge tone="marigold">{demoLabel ?? "Demo"}</Badge> : null}
      </div>
      <h3 className="t-h3 mt-2">{title}</h3>
      {excerpt ? <p className="t-meta mt-1.5 line-clamp-2">{excerpt}</p> : null}
    </Link>
  );
}

export function localizedTitle(locale: string, doc: { title?: Localized }): string {
  return pick(locale, doc.title as Localized);
}

/**
 * The round arrow button that closes every card in the reference design.
 * Renders as a link; `as="span"` lets it sit inside a card that is itself a
 * link without nesting two anchors.
 */
export function CircleArrow({
  href,
  label,
  tone = 0,
  as = "link",
}: {
  href?: string;
  label: string;
  tone?: number;
  as?: "link" | "span";
}) {
  const tones = ["bg-berry text-white", "bg-plum text-white", "bg-coral text-white", "bg-leaf text-white"];
  const cls = `inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-playful transition-transform duration-200 group-hover:translate-x-0.5 group-hover:scale-105 ${tones[tone % tones.length]}`;
  const glyph = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
  if (as === "span") {
    return (
      <span className={cls} aria-hidden="true">
        {glyph}
      </span>
    );
  }
  return (
    <Link href={href ?? "#"} aria-label={label} className={cls}>
      {glyph}
    </Link>
  );
}

/**
 * Display heading in the reference's two-tone style: the first word carries a
 * colored accent, the rest stays in cocoa.
 */
export function DisplayTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`t-h2 ${className}`}>{children}</h2>;
}
