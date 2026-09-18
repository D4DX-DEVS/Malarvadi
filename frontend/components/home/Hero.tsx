import { Button } from "../ui";
import { PhotoHero } from "../Photo";
import { Balloon, Cloud, Float, FlowerFriend, Kite, PaperPlane, Star, Sun } from "../Decor";

/**
 * Home hero: a multi-colour display headline on the left, the illustrated
 * children on the right, sitting in a mint sky that resolves into grass.
 *
 * The sky carries real furniture - sun, clouds, a kite, a balloon, a paper
 * plane, rising bubbles - at sizes you actually notice, because this band is
 * the first thing a child sees and it should read as a place rather than a
 * header. All of it is aria-hidden, and it drops away on small screens where it
 * would crowd the text.
 */
const LINE1_TONES = ["text-ink-blue", "text-ink-red"];
const LINE2_TONES = ["text-coral", "text-leaf"];

/**
 * Headline words drop in one after another, like a child setting letter blocks
 * onto a shelf. `inline-block` is what lets each word carry its own transform.
 */
function ColorWords({ text, tones, offset = 0 }: { text: string; tones: string[]; offset?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className={`inline-block animate-drop-in ${tones[i % tones.length]} ${i ? "ml-[0.28em]" : ""}`}
          style={{ animationDelay: `${(offset + i) * 110}ms` }}
        >
          {word}
        </span>
      ))}
    </>
  );
}

const BUBBLES = [
  { left: "16%", size: "h-3 w-3", delay: "0s", tone: "bg-white/60" },
  { left: "72%", size: "h-2.5 w-2.5", delay: "2.5s", tone: "bg-marigold/45" },
  { left: "88%", size: "h-4 w-4", delay: "4.5s", tone: "bg-blossom/35" },
];

export function Hero({
  locale,
  badge,
  line1,
  line2,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  script,
  bubble,
}: {
  locale: string;
  badge: string;
  line1: string;
  line2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  script: string;
  bubble: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky/30 via-mint to-cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Float className="absolute left-[4%] top-12 hidden md:block" animation="animate-drift" duration="26s">
          <Cloud className="h-12 w-28 text-white" />
        </Float>
        <Float className="absolute left-[28%] top-4 hidden lg:block" animation="animate-drift" duration="34s" delay="3s">
          <Cloud className="h-9 w-20 text-white/85" />
        </Float>
        <Float className="absolute right-[6%] top-10 hidden sm:block" animation="animate-sway-slow">
          <Kite className="h-24 w-14 text-blossom/80" />
        </Float>
        <Float className="absolute left-[46%] top-6 hidden xl:block" animation="animate-float-slow">
          <Sun face className="h-20 w-20 animate-float-slow text-marigold sm:h-24 sm:w-24" />
        </Float>
        <Float className="absolute bottom-10 left-[40%] hidden xl:block" animation="animate-float" duration="7s">
          <Balloon className="h-16 w-11 text-coral/80" />
        </Float>
        <Float className="absolute right-[34%] top-[22%] hidden xl:block" animation="animate-drift" duration="19s">
          <PaperPlane className="h-8 w-12 -rotate-12 text-teal/60" />
        </Float>

        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className={`absolute bottom-12 hidden animate-float-slow rounded-full sm:block ${b.size} ${b.tone}`}
            style={{ left: b.left, animationDelay: b.delay, animationDuration: "9s" }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
        <div className="grid items-center gap-12 md:grid-cols-[1.02fr_0.98fr]">
          <div className="enter-seq">
            <span
              style={{ "--i": 0 } as React.CSSProperties}
              className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold text-[#1e7a4e] shadow-playful ring-1 ring-leaf/20"
            >
              <Star className="h-4 w-4 animate-twinkle text-marigold" />
              {badge}
            </span>

            <h1
              style={{ "--i": 1 } as React.CSSProperties}
              className="mt-6 font-display text-[2.05rem] font-bold leading-[1.08] tracking-tight min-[400px]:text-[2.4rem] sm:text-5xl lg:text-[4rem]"
            >
              <span className="block">
                <ColorWords text={line1} tones={LINE1_TONES} />
              </span>
              <span className="mt-1 block">
                <ColorWords text={line2} tones={LINE2_TONES} offset={line1.split(" ").length} />
              </span>
            </h1>

            <p style={{ "--i": 2 } as React.CSSProperties} className="mt-5 max-w-md text-lg leading-relaxed text-cocoa/75">
              {subtitle}
            </p>

            <div style={{ "--i": 3 } as React.CSSProperties} className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={`/${locale}/programs`} variant="berry">
                {ctaPrimary}
              </Button>
              <Button href={`/${locale}/events`} variant="soft">
                {ctaSecondary}
              </Button>
            </div>

            {/* The brand's promise line, in a handwritten voice. */}
            <p
              aria-hidden="true"
              style={{ "--i": 4 } as React.CSSProperties}
              className="mt-7 font-display text-sm font-bold italic text-plum/70"
            >
              {script}
            </p>
          </div>

          <div className="relative animate-pop-in">
            {/* A soft blob behind the picture gives the frame something to sit on. */}
            <span
              aria-hidden="true"
              className="absolute -inset-3 -z-10 animate-blob rounded-blob bg-gradient-to-br from-marigold/40 via-blossom/25 to-teal/30 sm:-inset-5"
            />
            <PhotoHero name="hero" alt={`${line1} ${line2}`} />

            {/* Speech bubble + flower mascot anchored to the picture. */}
            <div className="group absolute -bottom-5 left-2 flex items-end gap-1 sm:left-6">
              <Float animation="animate-float-slow">
                <FlowerFriend className="hop-on-hover h-16 w-14 drop-shadow-sm sm:h-20 sm:w-16" />
              </Float>
              <span className="relative -mb-1 max-w-[9.5rem] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2 text-center font-display text-xs font-bold leading-snug text-cocoa shadow-playful ring-1 ring-cocoa/5 sm:text-sm">
                {bubble}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Layered grass edge into the page */}
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" className="block h-12 w-full sm:h-16">
        <path d="M0 48 Q 160 10 340 40 T 700 36 T 1080 44 T 1440 32 L1440 90 L0 90 Z" fill="#2FA36B" opacity="0.28" />
        <path d="M0 62 Q 200 32 420 54 T 860 52 T 1440 50 L1440 90 L0 90 Z" fill="#2FA36B" opacity="0.5" />
        <path d="M0 76 Q 240 56 520 70 T 1000 68 T 1440 66 L1440 90 L0 90 Z" fill="#2FA36B" opacity="0.7" />
      </svg>
    </section>
  );
}
