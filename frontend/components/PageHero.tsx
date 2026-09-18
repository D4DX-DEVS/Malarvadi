import { Balloon, Cloud, Float, Kite, Sparkle, Star, Sun } from "./Decor";

/**
 * Sub-page banner: a wide rounded band with a soft sky wash, a pill kicker, a
 * large display title whose last word carries a colour accent, and a layered
 * grass edge along the bottom.
 *
 * The sky carries the same furniture as the home hero - sun, clouds, a kite, a
 * balloon - so every page reads as the same garden. All of it is decorative and
 * steps down in stages on narrow screens so it never crowds the title.
 */
const ACCENTS: Record<string, string> = {
  leaf: "text-leaf",
  plum: "text-plum",
  teal: "text-[#0f766e]",
  marigold: "text-coral",
};

const PILLS: Record<string, string> = {
  leaf: "bg-white/85 text-[#1e7a4e] ring-leaf/25",
  plum: "bg-white/85 text-plum ring-plum/25",
  teal: "bg-white/85 text-[#0f766e] ring-teal/25",
  marigold: "bg-white/85 text-cocoa ring-marigold/40",
};

export function PageHero({
  badge,
  badgeTone = "leaf",
  title,
  sub,
  tint = "from-marigold/25 to-cream",
  mascot,
}: {
  badge: string;
  badgeTone?: "leaf" | "plum" | "teal" | "marigold";
  title: string;
  sub?: string;
  /** Tailwind gradient stops for the band wash. */
  tint?: string;
  mascot?: React.ReactNode;
}) {
  /* The pill is a kicker, so it only earns its place when it says something
     the heading does not. It is dropped whenever the heading already contains
     it - "About" over "About Malarvadi", "Events" over "Upcoming events", or
     History/Objectives, where the nav label and the page title are the same
     string. This matters most in Malayalam, where several nav labels translate
     to a word that also appears in the corresponding title. */
  const b = badge.trim().toLowerCase();
  const t = title.trim().toLowerCase();
  const showBadge = b.length > 0 && !t.includes(b);

  /* Color only the final word, so long Malayalam titles stay readable. */
  const words = title.split(" ");
  const head = words.slice(0, -1).join(" ");
  const tail = words[words.length - 1];

  return (
    <div
      className={`animate-pop-in relative overflow-hidden rounded-cardXl bg-gradient-to-b ${tint} px-6 pb-16 pt-10 sm:px-10 sm:pb-20 sm:pt-14`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* With a mascot in the bottom-right corner the sun moves left so the
            two never overlap. */}
        <Float className={`absolute top-6 ${mascot ? "right-1/4 sm:right-[30%]" : "right-6 sm:right-12"}`} animation="animate-float-slow">
          <Sun face className="h-16 w-16 text-marigold sm:h-24 sm:w-24" />
        </Float>
        <Float className="absolute left-6 top-7 hidden sm:block" animation="animate-drift" duration="24s">
          <Cloud className="h-9 w-24 text-white/95" />
        </Float>
        <Float className="absolute left-[38%] top-4 hidden lg:block" animation="animate-drift" duration="30s" delay="2s">
          <Cloud className="h-7 w-16 text-white/80" />
        </Float>
        <Float className={`absolute top-10 hidden md:block ${mascot ? "right-[46%]" : "right-28 sm:right-36"}`} animation="animate-sway-slow">
          <Kite className="h-16 w-10 text-blossom/70" />
        </Float>
        <Float className="absolute bottom-12 left-[26%] hidden xl:block" animation="animate-float" duration="8s">
          <Balloon className="h-12 w-8 text-teal/50" />
        </Float>
        <Sparkle className="absolute left-[14%] top-[54%] hidden h-4 w-4 animate-twinkle text-marigold/70 lg:block" />
        <Sparkle className="absolute bottom-[38%] right-[18%] hidden h-3 w-3 animate-twinkle text-blossom/60 lg:block" />
      </div>

      {mascot ? (
        <div className="pointer-events-none absolute bottom-6 right-4 hidden opacity-95 sm:block md:right-14">{mascot}</div>
      ) : null}

      <div className="relative max-w-2xl">
        {showBadge ? (
          <span className={`badge-wrap inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-playful ring-1 ${PILLS[badgeTone]}`}>
            <Star className="h-4 w-4 animate-twinkle text-marigold" />
            {badge}
          </span>
        ) : null}
        <h1 className={`t-h1 ${showBadge ? "mt-4" : ""}`}>
          {head ? `${head} ` : ""}
          <span className={ACCENTS[badgeTone]}>{tail}</span>
        </h1>
        {sub ? <p className="t-lead mt-4 max-w-xl">{sub}</p> : null}
      </div>

      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 w-full sm:h-12">
        <path d="M0 50 Q 180 14 380 42 T 760 38 T 1120 46 T 1440 34 L1440 90 L0 90 Z" fill="#2FA36B" opacity="0.25" />
        <path d="M0 64 Q 220 34 460 56 T 900 54 T 1440 52 L1440 90 L0 90 Z" fill="#2FA36B" opacity="0.45" />
        <path d="M0 78 Q 260 58 540 72 T 1020 70 T 1440 68 L1440 90 L0 90 Z" fill="#2FA36B" opacity="0.65" />
      </svg>
    </div>
  );
}
