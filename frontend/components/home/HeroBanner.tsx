import { photoSrc } from "@/lib/photos";
import { Logo } from "../Logo";
import { Bird, Butterfly, Cloud, Float, Flower, KidGardener, KidWaving, KidWithKite, Leaf, PaperPlane, Sun } from "../Decor";
import { HeroSlides } from "./HeroSlides";

/**
 * The home banner: one wide illustrated picture inside the reference's white
 * cloud-shaped frame, the wordmark sitting in the middle of it, with the sun,
 * clouds and leaves loose on the page around it.
 *
 * Everything in it is drawn here, so the page has a banner on a clean install
 * with no artwork at all. Dropping `public/images/banner.jpg` (the finished
 * illustration, wordmark included) swaps the drawn garden for that picture;
 * `banner-1.jpg`, `banner-2.jpg`, ... turn it into a slideshow with dots.
 */
const SLOTS = ["banner", "banner-1", "banner-2", "banner-3", "banner-4", "banner-5", "banner-6", "banner-7", "banner-8"];

/** A kite in four colours, the one the boy on the left is flying. */
function RainbowKite({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 110" className={className} aria-hidden="true">
      <path d="M30 4 L52 34 L30 34 Z" fill="#FFC93C" />
      <path d="M30 4 L8 34 L30 34 Z" fill="#E2365C" />
      <path d="M8 34 L30 64 L30 34 Z" fill="#2FA36B" />
      <path d="M52 34 L30 64 L30 34 Z" fill="#1D6FB8" />
      <path d="M30 4 L30 64 M8 34 L52 34" stroke="#fff" strokeWidth="1.5" opacity="0.7" />
      <path d="M30 64 Q 22 80 32 92 Q 24 100 30 108" fill="none" stroke="#2B2117" strokeWidth="1.6" opacity="0.5" />
      <path d="M26 74 L34 74 M24 88 L32 88" stroke="#E2365C" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/** The big tree with its house, on the right of the banner. */
function TreeHouse({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 240" className={className} aria-hidden="true">
      <path d="M104 236 L104 120 L124 120 L124 236 Z" fill="#8A5A34" />
      <path d="M110 150 L70 118" stroke="#8A5A34" strokeWidth="9" strokeLinecap="round" />
      <path d="M118 140 L164 106" stroke="#8A5A34" strokeWidth="9" strokeLinecap="round" />
      <circle cx="112" cy="70" r="58" fill="#3E9F5B" />
      <circle cx="56" cy="96" r="40" fill="#2FA36B" />
      <circle cx="170" cy="92" r="42" fill="#2FA36B" />
      <circle cx="90" cy="46" r="34" fill="#6CC17A" opacity="0.9" />
      <circle cx="146" cy="52" r="30" fill="#6CC17A" opacity="0.85" />
      {/* the house */}
      <path d="M62 130 L114 96 L166 130 Z" fill="#E2365C" />
      <rect x="72" y="130" width="84" height="46" rx="5" fill="#F2B04B" />
      <rect x="100" y="146" width="22" height="30" rx="3" fill="#8A5A34" />
      <rect x="80" y="140" width="14" height="12" rx="2" fill="#5AB6E8" />
      <rect x="132" y="140" width="14" height="12" rx="2" fill="#5AB6E8" />
      <rect x="66" y="174" width="96" height="6" rx="3" fill="#B8783F" />
      {/* bunting */}
      <path d="M40 124 Q 100 150 176 118" fill="none" stroke="#2B2117" strokeWidth="1.5" opacity="0.4" />
      {[52, 72, 92, 112, 132, 152].map((x, i) => (
        <path
          key={x}
          d={`M${x} ${130 + Math.sin((x / 176) * Math.PI) * 14} l5 9 l5 -9 Z`}
          fill={["#FFC93C", "#E2365C", "#5AB6E8", "#2FA36B", "#FF8A5B", "#B79CE0"][i]}
        />
      ))}
      {/* ladder */}
      <g stroke="#8A5A34" strokeWidth="4" strokeLinecap="round">
        <line x1="150" y1="180" x2="168" y2="236" />
        <line x1="162" y1="178" x2="180" y2="234" />
        <line x1="154" y1="192" x2="166" y2="190" />
        <line x1="158" y1="206" x2="170" y2="204" />
        <line x1="162" y1="220" x2="174" y2="218" />
      </g>
    </svg>
  );
}

/** Two rolling green hills with a strip of flowers, the banner's meadow. */
function Meadow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 120" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M0 60 Q 140 20 300 54 T 600 46 T 800 56 L800 120 L0 120 Z" fill="#7CC66E" />
      <path d="M0 84 Q 200 50 420 82 T 800 76 L800 120 L0 120 Z" fill="#3E9F5B" />
    </svg>
  );
}

/* Flowers standing in the meadow: big blooms in the two corners, small ones
   scattered between. */
const BLOOMS = [
  { left: "2%", bottom: "4%", size: "h-14 w-14 sm:h-20 sm:w-20", tone: "text-[#E2365C]" },
  { left: "9%", bottom: "-1%", size: "h-10 w-10 sm:h-14 sm:w-14", tone: "text-marigold" },
  { left: "15%", bottom: "2%", size: "h-8 w-8 sm:h-11 sm:w-11", tone: "text-[#5AB6E8]" },
  { left: "36%", bottom: "1%", size: "h-6 w-6 sm:h-8 sm:w-8", tone: "text-coral" },
  { left: "48%", bottom: "3%", size: "h-5 w-5 sm:h-7 sm:w-7", tone: "text-marigold" },
  { left: "58%", bottom: "0%", size: "h-6 w-6 sm:h-8 sm:w-8", tone: "text-blossom" },
  { left: "84%", bottom: "1%", size: "h-9 w-9 sm:h-12 sm:w-12", tone: "text-marigold" },
  { left: "90%", bottom: "4%", size: "h-12 w-12 sm:h-[4.5rem] sm:w-[4.5rem]", tone: "text-[#E2365C]" },
  { left: "95%", bottom: "-1%", size: "h-8 w-8 sm:h-11 sm:w-11", tone: "text-[#FF8A5B]" },
];

/** The drawn garden shown until the painted banner arrives. */
function GardenScene() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#BFE3F7] via-[#E9F6FD] to-[#F4FAEE]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* sky */}
        <Float className="absolute left-[30%] top-[6%]" animation="animate-drift" duration="28s">
          <Cloud className="h-7 w-16 text-white sm:h-10 sm:w-24" />
        </Float>
        <Float className="absolute right-[30%] top-[4%]" animation="animate-drift" duration="36s" delay="4s">
          <Cloud className="h-6 w-14 text-white/95 sm:h-9 sm:w-20" />
        </Float>
        <Float className="absolute left-[8%] top-[24%]" animation="animate-drift" duration="32s" delay="2s">
          <Cloud className="h-5 w-12 text-white/90 sm:h-8 sm:w-18" />
        </Float>
        <Bird className="absolute left-[40%] top-[14%] hidden h-4 w-8 animate-sway-slow text-cocoa/35 sm:block" />

        {/* kites and planes over the left half */}
        <Float className="absolute left-[11%] top-[5%]" animation="animate-sway-slow">
          <RainbowKite className="h-24 w-14 sm:h-36 sm:w-20" />
        </Float>
        <Float className="absolute left-[30%] top-[14%] hidden sm:block" animation="animate-float" duration="8s">
          <PaperPlane className="h-8 w-12 -rotate-[20deg] text-coral" />
        </Float>
        <Float className="absolute left-[38%] top-[30%] hidden sm:block" animation="animate-float-slow" duration="10s">
          <PaperPlane className="h-6 w-10 rotate-[10deg] text-[#1D6FB8]" />
        </Float>
        <Butterfly className="absolute left-[44%] top-[8%] h-5 w-6 animate-float text-coral sm:h-7 sm:w-8" />
        <Butterfly className="absolute left-[27%] top-[46%] hidden h-5 w-6 animate-float-slow text-[#5AB6E8] sm:block" />
        <Butterfly className="absolute right-[36%] top-[40%] hidden h-5 w-6 animate-float text-blossom sm:block" />

        {/* meadow */}
        <Meadow className="absolute inset-x-0 bottom-0 h-[30%] w-full" />

        {/* the tree house on the right */}
        <TreeHouse className="absolute bottom-[5%] right-[-2%] h-[72%] w-auto sm:right-0 sm:h-[84%]" />

        {/* children: two on the left, two on the right */}
        <KidWithKite className="absolute bottom-[7%] left-[8%] h-[38%] w-auto sm:left-[9%] sm:h-[42%]" colors={{ shirt: "#1D6FB8" }} />
        <KidWaving className="absolute bottom-[5%] left-[17%] h-[34%] w-auto sm:left-[18%] sm:h-[37%]" colors={{ shirt: "#F2789F", hair: "#241812", skin: "#D9A57C" }} />
        <KidWaving className="absolute bottom-[7%] right-[27%] hidden h-[40%] w-auto sm:block" colors={{ shirt: "#5AB6E8", skin: "#C98A5B" }} />
        <KidGardener className="absolute bottom-[5%] right-[19%] hidden h-[34%] w-auto sm:block" colors={{ shirt: "#FF8A5B", hair: "#241812" }} />

        {BLOOMS.map((b, i) => (
          <span key={i} className={`absolute animate-float-slow ${b.tone}`} style={{ left: b.left, bottom: b.bottom, animationDelay: `${i * 0.4}s` }}>
            <Flower className={b.size} />
          </span>
        ))}
      </div>

      {/* The wordmark alone, centred on the scene. */}
      <div className="relative flex h-full items-center justify-center px-6 pb-[6%]">
        <Logo priority className="h-12 drop-shadow-[0_3px_0_rgba(255,255,255,0.95)] sm:h-20 lg:h-24" />
      </div>
    </div>
  );
}

export function HeroBanner({ tagline, alt, slideLabel }: { tagline: string; alt: string; slideLabel: string }) {
  const slides = SLOTS.map(photoSrc).filter((s): s is string => Boolean(s));

  return (
    <section className="relative overflow-hidden pb-6 pt-5 sm:pb-8 sm:pt-6">
      {/* The page has one heading of its own; the banner is the wordmark. */}
      <h1 className="sr-only">{tagline}</h1>

      {/* Loose garden furniture on the page around the frame, as in the reference. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <Sun face className="absolute left-[3%] top-[12%] h-16 w-16 animate-float-slow text-marigold xl:left-[5%] xl:h-20 xl:w-20" />
        <Float className="absolute left-[2%] top-[42%]" animation="animate-drift" duration="26s">
          <Cloud className="h-9 w-20 text-[#DCEEFB] xl:h-11 xl:w-24" />
        </Float>
        <Float className="absolute left-[1%] top-[68%]" animation="animate-drift" duration="34s" delay="3s">
          <Cloud className="h-7 w-16 text-[#E4F1FA] xl:h-9 xl:w-20" />
        </Float>
        <Float className="absolute right-[1.5%] top-[10%]" animation="animate-drift" duration="30s" delay="1s">
          <Cloud className="h-8 w-18 text-[#DCEEFB] xl:h-10 xl:w-22" />
        </Float>
        <Leaf className="absolute right-[3%] top-[36%] h-10 w-10 rotate-[25deg] animate-sway text-leaf/85 xl:h-12 xl:w-12" />
        <Leaf className="absolute bottom-[26%] right-[1.5%] h-14 w-14 -rotate-[35deg] animate-sway-slow text-[#2E8B4A] xl:h-16 xl:w-16" />
        <Leaf className="absolute bottom-[12%] right-[5%] h-9 w-9 rotate-[70deg] animate-sway text-leaf/70" />
        <Flower className="absolute bottom-[9%] right-[2%] h-6 w-6 text-marigold" />
        <Flower className="absolute bottom-[6%] right-[4.5%] h-4 w-4 text-blossom" />
        <Butterfly className="absolute bottom-[40%] right-[6%] h-6 w-7 animate-float text-blossom" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-2 sm:px-6">
        <div className="mx-auto w-full lg:w-[86%]">
          <HeroSlides slides={slides} alt={alt} slideLabel={slideLabel} fallback={<GardenScene />} />
        </div>
      </div>
    </section>
  );
}
