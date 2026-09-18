/**
 * Original decorative elements for Malarvadi (drawn here, not copied).
 * "Sunny Garden Classroom" direction: sun, clouds, kites, stars, leaves,
 * flowers, books, pencils, sprouts, balloons, butterflies, rainbows and a
 * small cast of simple child characters.
 *
 * Rules for everything in this file:
 *  - every element is aria-hidden and purely decorative;
 *  - size/colour comes from className (fills use currentColor where the
 *    element is meant to be re-tinted by its container);
 *  - nothing ever covers or blocks content (Float is pointer-events-none);
 *  - movement only comes from the Float wrapper / Tailwind animations,
 *    which globals.css disables under prefers-reduced-motion.
 */

type S = { className?: string };

/* ------------------------------------------------------------------ */
/* Small shapes                                                        */
/* ------------------------------------------------------------------ */

export function LeafDots({ className = "" }: S) {
  return (
    <svg viewBox="0 0 120 24" className={className} aria-hidden="true">
      {[6, 26, 46, 66, 86, 106].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? 16 : 8} r={i % 2 ? 3 : 4.5} fill="currentColor" opacity={0.35 + (i % 3) * 0.2} />
      ))}
    </svg>
  );
}

export function GardenWave({ className = "" }: S) {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M0 25 Q 40 5 80 20 T 160 18 T 240 22 T 320 16 T 400 20 L400 40 L0 40 Z" fill="currentColor" opacity="0.12" />
    </svg>
  );
}

/** Organic section divider. Place above a colored section; inherits its bg via currentColor. */
export function WaveDivider({ className = "", flip = false }: S & { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 32"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path d="M0 20 Q 50 2 100 14 T 200 12 T 300 16 T 400 10 L400 32 L0 32 Z" fill="currentColor" />
    </svg>
  );
}

/** Rounded scalloped divider - reads like cut paper between sections. */
export function ScallopDivider({ className = "", flip = false }: S & { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path
        d="M0 14 Q 12.5 0 25 14 T 50 14 T 75 14 T 100 14 T 125 14 T 150 14 T 175 14 T 200 14 T 225 14 T 250 14 T 275 14 T 300 14 T 325 14 T 350 14 T 375 14 T 400 14 L400 24 L0 24 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Rolling hills divider with two depths, for garden-style section changes. */
export function HillsDivider({ className = "", flip = false }: S & { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 48"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path d="M0 30 Q 60 6 130 26 T 270 24 T 400 30 L400 48 L0 48 Z" fill="currentColor" opacity="0.45" />
      <path d="M0 38 Q 80 18 170 34 T 400 32 L400 48 L0 48 Z" fill="currentColor" />
    </svg>
  );
}

/** Hand-drawn style zigzag ribbon, used as a playful rule under headings. */
export function Zigzag({ className = "" }: S) {
  return (
    <svg viewBox="0 0 120 12" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M0 9 L12 3 L24 9 L36 3 L48 9 L60 3 L72 9 L84 3 L96 9 L108 3 L120 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Dotted curve, like a garden path or a kite string. */
export function DottedCurve({ className = "" }: S) {
  return (
    <svg viewBox="0 0 200 40" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d="M2 30 Q 50 2 100 22 T 198 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 10" opacity="0.7" />
    </svg>
  );
}

/**
 * The garden sun. With `face` it gets eyes and a smile and blinks slowly - the
 * friendly sun the brand artwork uses. It is off by default so every existing
 * sun on the site stays exactly as it was.
 */
export function Sun({ className = "", face = false }: S & { face?: boolean }) {
  const rays = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  return (
    <svg viewBox="0 0 80 80" className={`${face ? "sun-face " : ""}${className}`} aria-hidden="true">
      {rays.map((a, i) => (
        <line
          key={i}
          x1={40 + Math.cos(a) * 24}
          y1={40 + Math.sin(a) * 24}
          x2={40 + Math.cos(a) * 32}
          y2={40 + Math.sin(a) * 32}
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
      ))}
      <circle cx="40" cy="40" r="17" fill="currentColor" opacity="0.9" />
      <circle cx="40" cy="40" r="17" fill="white" opacity="0.25" />
      {face ? (
        <g>
          <circle className="sun-eye" cx="34" cy="37" r="2.2" fill="#2B2117" opacity="0.75" />
          <circle className="sun-eye" cx="46" cy="37" r="2.2" fill="#2B2117" opacity="0.75" />
          <path d="M34 44 Q40 49 46 44" stroke="#2B2117" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7" />
          <circle cx="29" cy="43" r="3" fill="#FF8A5B" opacity="0.35" />
          <circle cx="51" cy="43" r="3" fill="#FF8A5B" opacity="0.35" />
        </g>
      ) : null}
    </svg>
  );
}

export function Cloud({ className = "" }: S) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="38" cy="40" rx="24" ry="15" opacity="0.85" />
        <ellipse cx="64" cy="30" rx="22" ry="17" opacity="0.9" />
        <ellipse cx="88" cy="41" rx="20" ry="13" opacity="0.85" />
        <rect x="20" y="38" width="84" height="14" rx="7" opacity="0.85" />
      </g>
    </svg>
  );
}

export function Kite({ className = "" }: S) {
  return (
    <svg viewBox="0 0 60 100" className={className} aria-hidden="true">
      <path d="M30 4 L50 32 L30 58 L10 32 Z" fill="currentColor" opacity="0.9" />
      <path d="M30 4 L30 58 M10 32 L50 32" stroke="white" strokeWidth="2" opacity="0.7" />
      <path d="M30 58 Q 26 70 32 78 Q 26 86 31 96" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="30" cy="68" r="3.5" fill="currentColor" opacity="0.7" />
      <circle cx="30" cy="82" r="3.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

export function Heart({ className = "" }: S) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-9.4-9A5.2 5.2 0 0 1 12 6.6 5.2 5.2 0 0 1 21.4 12c-1.9 4.4-9.4 9-9.4 9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Star({ className = "" }: S) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 3 L24.5 14.5 L36.5 15 L27 22.5 L30 34 L20 27.5 L10 34 L13 22.5 L3.5 15 L15.5 14.5 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

/** Four-point sparkle - lighter than a star, good for tiny accents. */
export function Sparkle({ className = "" }: S) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 1 Q 13.6 9 22 12 Q 13.6 15 12 23 Q 10.4 15 2 12 Q 10.4 9 12 1 Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

export function Leaf({ className = "" }: S) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M6 34 Q 8 14 34 6 Q 32 32 6 34 Z" fill="currentColor" opacity="0.9" />
      <path d="M10 30 Q 20 20 30 10" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function Flower({ className = "" }: S) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
      <g fill="currentColor" opacity="0.9">
        <circle cx="30" cy="12" r="9" />
        <circle cx="47" cy="24" r="9" />
        <circle cx="41" cy="44" r="9" />
        <circle cx="19" cy="44" r="9" />
        <circle cx="13" cy="24" r="9" />
      </g>
      <circle cx="30" cy="29" r="8" fill="white" opacity="0.85" />
    </svg>
  );
}

export function Book({ className = "" }: S) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true">
      <path d="M32 10 Q 20 4 6 8 L6 40 Q 20 36 32 42 Z" fill="currentColor" opacity="0.9" />
      <path d="M32 10 Q 44 4 58 8 L58 40 Q 44 36 32 42 Z" fill="currentColor" opacity="0.7" />
      <line x1="32" y1="10" x2="32" y2="42" stroke="white" strokeWidth="2.5" opacity="0.8" />
    </svg>
  );
}

export function Pencil({ className = "" }: S) {
  return (
    <svg viewBox="0 0 24 72" className={className} aria-hidden="true">
      <rect x="5" y="4" width="14" height="44" rx="3" fill="currentColor" opacity="0.9" />
      <path d="M5 48 L12 68 L19 48 Z" fill="currentColor" opacity="0.7" />
      <path d="M9.5 58 L12 68 L14.5 58 Z" fill="white" opacity="0.8" />
    </svg>
  );
}

/** Two crossed crayons - the arts/drawing motif. */
export function Crayons({ className = "" }: S) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g transform="rotate(-18 32 32)">
        <rect x="16" y="10" width="12" height="38" rx="4" fill="currentColor" opacity="0.9" />
        <path d="M16 48 L22 60 L28 48 Z" fill="currentColor" opacity="0.6" />
        <rect x="16" y="18" width="12" height="5" fill="white" opacity="0.65" />
      </g>
      <g transform="rotate(16 32 32)">
        <rect x="36" y="14" width="12" height="34" rx="4" fill="currentColor" opacity="0.65" />
        <path d="M36 48 L42 59 L48 48 Z" fill="currentColor" opacity="0.5" />
        <rect x="36" y="21" width="12" height="5" fill="white" opacity="0.6" />
      </g>
    </svg>
  );
}

export function Sprout({ className = "" }: S) {
  return (
    <svg viewBox="0 0 48 56" className={className} aria-hidden="true">
      <path d="M24 52 Q 24 34 24 22" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M24 34 Q 12 32 8 20 Q 20 22 24 34 Z" fill="currentColor" opacity="0.9" />
      <path d="M24 28 Q 36 26 40 14 Q 28 16 24 28 Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** Grass tuft, for the bottom edge of garden bands. */
export function Grass({ className = "" }: S) {
  return (
    <svg viewBox="0 0 120 30" className={className} aria-hidden="true" preserveAspectRatio="none">
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.85">
        <path d="M10 29 Q 8 16 14 6" />
        <path d="M24 29 Q 26 18 20 9" />
        <path d="M40 29 Q 38 14 46 4" />
        <path d="M56 29 Q 58 17 52 8" />
        <path d="M72 29 Q 70 15 78 5" />
        <path d="M90 29 Q 92 18 86 9" />
        <path d="M106 29 Q 104 14 112 6" />
      </g>
    </svg>
  );
}

export function Rainbow({ className = "" }: S) {
  const bands = [
    { r: 46, c: "#F2789F" },
    { r: 38, c: "#FF8A5B" },
    { r: 30, c: "#FFC93C" },
    { r: 22, c: "#2FA36B" },
    { r: 14, c: "#5AB6E8" },
  ];
  return (
    <svg viewBox="0 0 110 60" className={className} aria-hidden="true">
      {bands.map((b) => (
        <path key={b.r} d={`M${55 - b.r} 56 A ${b.r} ${b.r} 0 0 1 ${55 + b.r} 56`} fill="none" stroke={b.c} strokeWidth="7" strokeLinecap="round" opacity="0.85" />
      ))}
    </svg>
  );
}

export function Balloon({ className = "" }: S) {
  return (
    <svg viewBox="0 0 40 72" className={className} aria-hidden="true">
      <ellipse cx="20" cy="22" rx="16" ry="20" fill="currentColor" opacity="0.9" />
      <ellipse cx="14" cy="16" rx="4.5" ry="6" fill="white" opacity="0.5" />
      <path d="M17 42 L23 42 L20 47 Z" fill="currentColor" opacity="0.9" />
      <path d="M20 47 Q 15 55 21 61 Q 15 67 20 71" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function PaperPlane({ className = "" }: S) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true">
      <path d="M2 20 L60 4 L36 44 L28 30 Z" fill="currentColor" opacity="0.9" />
      <path d="M60 4 L28 30 L2 20" fill="none" stroke="white" strokeWidth="2" opacity="0.65" strokeLinejoin="round" />
      <path d="M28 30 L30 44" stroke="white" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

export function Butterfly({ className = "" }: S) {
  return (
    <svg viewBox="0 0 64 52" className={className} aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="18" cy="18" rx="15" ry="13" opacity="0.85" transform="rotate(-18 18 18)" />
        <ellipse cx="46" cy="18" rx="15" ry="13" opacity="0.85" transform="rotate(18 46 18)" />
        <ellipse cx="22" cy="37" rx="11" ry="10" opacity="0.65" />
        <ellipse cx="42" cy="37" rx="11" ry="10" opacity="0.65" />
        <rect x="30" y="12" width="4" height="32" rx="2" opacity="0.95" />
      </g>
      <path d="M32 13 Q 26 4 21 3 M32 13 Q 38 4 43 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export function Bird({ className = "" }: S) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
      <path d="M4 20 Q 16 4 28 18 Q 40 4 56 18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/** Music note, for arts and festival sections. */
export function MusicNote({ className = "" }: S) {
  return (
    <svg viewBox="0 0 40 48" className={className} aria-hidden="true">
      <path d="M16 38 L16 8 L34 4 L34 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <circle cx="10" cy="39" r="7" fill="currentColor" opacity="0.9" />
      <circle cx="28" cy="33" r="6.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** Paint palette, for the drawing/arts programs. */
export function Palette({ className = "" }: S) {
  return (
    <svg viewBox="0 0 60 52" className={className} aria-hidden="true">
      <path
        d="M30 3 C 46 3 57 14 57 26 C 57 34 50 36 44 36 C 39 36 37 40 39 44 C 41 48 36 50 30 50 C 15 50 3 40 3 26 C 3 13 14 3 30 3 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <g fill="white" opacity="0.8">
        <circle cx="19" cy="18" r="4" />
        <circle cx="32" cy="13" r="4" />
        <circle cx="44" cy="21" r="4" />
        <circle cx="19" cy="33" r="4" />
      </g>
    </svg>
  );
}

/** Confetti scatter used behind celebratory bands. */
export function Confetti({ className = "" }: S) {
  const bits: Array<[number, number, number]> = [
    [10, 12, -20],
    [38, 6, 14],
    [66, 18, -8],
    [94, 9, 26],
    [122, 20, -16],
    [150, 7, 10],
    [178, 17, -24],
  ];
  return (
    <svg viewBox="0 0 200 30" className={className} aria-hidden="true">
      {bits.map(([x, y, r], i) => (
        <rect key={x} x={x} y={y} width="7" height="4" rx="2" fill="currentColor" opacity={0.3 + (i % 3) * 0.2} transform={`rotate(${r} ${x + 3} ${y + 2})`} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Floating wrapper                                                    */
/* ------------------------------------------------------------------ */

/** Gentle floating wrapper for decorative elements. Motion is disabled globally under reduced-motion. */
export function Float({
  children,
  className = "",
  animation = "animate-float",
  delay = "0s",
  duration,
}: {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "animate-float"
    | "animate-float-slow"
    | "animate-drift"
    | "animate-sway"
    | "animate-sway-slow"
    | "animate-twinkle"
    | "animate-spin-slow";
  delay?: string;
  duration?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${animation} ${className}`}
      style={{ animationDelay: delay, ...(duration ? { animationDuration: duration } : {}) }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Original Malarvadi buddies: simple geometric friends drawn here.    */
/* Abstract smiling faces on garden shapes - not copied from anywhere. */
/* ------------------------------------------------------------------ */

/** Malu the flower friend: five petals, sunny face. */
export function FlowerFriend({ className = "" }: S) {
  return (
    <svg viewBox="0 0 80 96" className={className} aria-hidden="true">
      <line x1="40" y1="62" x2="40" y2="92" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <g fill="currentColor" opacity="0.9">
        <circle cx="40" cy="18" r="12" />
        <circle cx="62" cy="34" r="12" />
        <circle cx="53" cy="59" r="12" />
        <circle cx="27" cy="59" r="12" />
        <circle cx="18" cy="34" r="12" />
      </g>
      <circle cx="40" cy="39" r="14" fill="white" opacity="0.92" />
      <circle cx="35" cy="37" r="2.4" fill="currentColor" />
      <circle cx="45" cy="37" r="2.4" fill="currentColor" />
      <path d="M34 43 Q40 48 46 43" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Pusthu the book buddy: an open book with a happy face. */
export function BookBuddy({ className = "" }: S) {
  return (
    <svg viewBox="0 0 72 60" className={className} aria-hidden="true">
      <path d="M36 12 Q 22 5 6 10 L6 46 Q 22 41 36 48 Z" fill="currentColor" opacity="0.9" />
      <path d="M36 12 Q 50 5 66 10 L66 46 Q 50 41 36 48 Z" fill="currentColor" opacity="0.65" />
      <circle cx="28" cy="28" r="2.4" fill="white" />
      <circle cx="44" cy="28" r="2.4" fill="white" />
      <path d="M29 35 Q36 40 43 35" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** StarBuddy: a cheerful little star companion. */
export function StarBuddy({ className = "" }: S) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 4 L29 17 L43 18 L32 27 L36 41 L24 33 L12 41 L16 27 L5 18 L19 17 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx="20" cy="24" r="2" fill="white" />
      <circle cx="28" cy="24" r="2" fill="white" />
      <path d="M20 29 Q24 32 28 29" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Pencil pal: a smiling pencil, the "learning" mascot. */
export function PencilPal({ className = "" }: S) {
  return (
    <svg viewBox="0 0 40 84" className={className} aria-hidden="true">
      <rect x="8" y="6" width="24" height="52" rx="8" fill="currentColor" opacity="0.9" />
      <rect x="8" y="6" width="24" height="9" rx="4.5" fill="white" opacity="0.45" />
      <path d="M8 58 L20 80 L32 58 Z" fill="currentColor" opacity="0.7" />
      <path d="M15 69 L20 80 L25 69 Z" fill="white" opacity="0.85" />
      <circle cx="15" cy="30" r="2.6" fill="white" />
      <circle cx="25" cy="30" r="2.6" fill="white" />
      <path d="M15 38 Q20 43 25 38" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Cloud friend: a soft cloud with a sleepy-happy face. */
export function CloudFriend({ className = "" }: S) {
  return (
    <svg viewBox="0 0 120 64" className={className} aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="38" cy="42" rx="25" ry="16" opacity="0.9" />
        <ellipse cx="66" cy="31" rx="24" ry="19" opacity="0.95" />
        <ellipse cx="91" cy="43" rx="21" ry="14" opacity="0.9" />
        <rect x="18" y="40" width="88" height="16" rx="8" opacity="0.92" />
      </g>
      <circle cx="54" cy="36" r="2.8" fill="#2B2117" opacity="0.65" />
      <circle cx="74" cy="36" r="2.8" fill="#2B2117" opacity="0.65" />
      <path d="M56 44 Q64 51 72 44" stroke="#2B2117" strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.55" />
      <circle cx="46" cy="44" r="4" fill="#F2789F" opacity="0.35" />
      <circle cx="82" cy="44" r="4" fill="#F2789F" opacity="0.35" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Simple child characters (original, abstract, inclusive)             */
/* Built from circles and rounded shapes; palette is passed in so the  */
/* same character reads differently in different sections.             */
/* ------------------------------------------------------------------ */

export interface KidColors {
  /** Skin tone. */
  skin?: string;
  /** Hair colour. */
  hair?: string;
  /** Shirt colour. */
  shirt?: string;
}

const KID_DEFAULT: Required<KidColors> = { skin: "#E8B48A", hair: "#3B2A1E", shirt: "#2FA36B" };

/** Shared head: face, hair cap, eyes, blush and a smile. */
function KidHead({ c }: { c: Required<KidColors> }) {
  return (
    <>
      <circle cx="32" cy="26" r="17" fill={c.skin} />
      <path d="M15 26 Q 15 7 32 7 Q 49 7 49 26 Q 45 16 32 16 Q 19 16 15 26 Z" fill={c.hair} />
      <circle cx="26" cy="26" r="2.4" fill="#2B2117" />
      <circle cx="38" cy="26" r="2.4" fill="#2B2117" />
      <circle cx="21" cy="31" r="3.2" fill="#F2789F" opacity="0.4" />
      <circle cx="43" cy="31" r="3.2" fill="#F2789F" opacity="0.4" />
      <path d="M26 33 Q 32 38 38 33" stroke="#2B2117" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  );
}

/** Waving child - the welcome character. */
export function KidWaving({ className = "", colors }: S & { colors?: KidColors }) {
  const c = { ...KID_DEFAULT, ...colors };
  return (
    <svg viewBox="0 0 64 96" className={className} aria-hidden="true">
      <KidHead c={c} />
      <path d="M32 44 Q 16 48 14 90 L50 90 Q 48 48 32 44 Z" fill={c.shirt} />
      <path d="M46 56 Q 56 48 57 36" stroke={c.skin} strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="57" cy="33" r="5" fill={c.skin} />
      <path d="M18 56 Q 11 66 12 76" stroke={c.skin} strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="78" r="4.6" fill={c.skin} />
    </svg>
  );
}

/** Child reading a book - the learning character. */
export function KidReading({ className = "", colors }: S & { colors?: KidColors }) {
  const c = { ...KID_DEFAULT, ...colors };
  return (
    <svg viewBox="0 0 64 96" className={className} aria-hidden="true">
      <KidHead c={c} />
      <path d="M32 44 Q 16 48 14 90 L50 90 Q 48 48 32 44 Z" fill={c.shirt} />
      <path d="M32 66 Q 22 60 10 64 L10 84 Q 22 80 32 86 Z" fill="#FFF8E9" />
      <path d="M32 66 Q 42 60 54 64 L54 84 Q 42 80 32 86 Z" fill="#FFF8E9" />
      <line x1="32" y1="66" x2="32" y2="86" stroke="#2FA36B" strokeWidth="2.5" opacity="0.7" />
      <g stroke="#2B2117" strokeOpacity="0.2" strokeWidth="1.6" strokeLinecap="round">
        <line x1="15" y1="70" x2="27" y2="69" />
        <line x1="15" y1="75" x2="27" y2="74" />
        <line x1="37" y1="69" x2="49" y2="70" />
        <line x1="37" y1="74" x2="49" y2="75" />
      </g>
    </svg>
  );
}

/** Child holding a kite string, looking up. */
export function KidWithKite({ className = "", colors }: S & { colors?: KidColors }) {
  const c = { ...KID_DEFAULT, ...colors };
  return (
    <svg viewBox="0 0 64 96" className={className} aria-hidden="true">
      <KidHead c={c} />
      <path d="M32 44 Q 16 48 14 90 L50 90 Q 48 48 32 44 Z" fill={c.shirt} />
      <path d="M44 54 Q 54 46 58 32" stroke={c.skin} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M18 56 Q 11 66 12 78" stroke={c.skin} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M58 32 Q 60 18 52 6" stroke="#2B2117" strokeWidth="1.8" fill="none" opacity="0.4" strokeDasharray="3 4" />
    </svg>
  );
}

/** Child with a small potted sprout - the nature character. */
export function KidGardener({ className = "", colors }: S & { colors?: KidColors }) {
  const c = { ...KID_DEFAULT, ...colors };
  return (
    <svg viewBox="0 0 64 96" className={className} aria-hidden="true">
      <KidHead c={c} />
      <path d="M32 44 Q 16 48 14 90 L50 90 Q 48 48 32 44 Z" fill={c.shirt} />
      <path d="M22 62 L42 62 L39 80 L25 80 Z" fill="#FF8A5B" opacity="0.9" />
      <rect x="20" y="57" width="24" height="7" rx="3.5" fill="#FF8A5B" />
      <path d="M32 57 Q 32 46 32 42" stroke="#2FA36B" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 50 Q 24 48 21 40 Q 30 42 32 50 Z" fill="#2FA36B" opacity="0.9" />
      <path d="M32 46 Q 40 44 43 36 Q 34 38 32 46 Z" fill="#2FA36B" opacity="0.7" />
    </svg>
  );
}

/** Internal: a plain standing child used inside grouped scenes. */
function KidPlain({ colors }: { colors?: KidColors }) {
  const c = { ...KID_DEFAULT, ...colors };
  return (
    <g>
      <KidHead c={c} />
      <path d="M32 44 Q 16 48 14 90 L50 90 Q 48 48 32 44 Z" fill={c.shirt} />
      <path d="M18 56 Q 10 64 12 76" stroke={c.skin} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M46 56 Q 54 64 52 76" stroke={c.skin} strokeWidth="7" strokeLinecap="round" fill="none" />
    </g>
  );
}

/**
 * A small line-up of three children, used as a friendly group motif.
 * Different tones on purpose - Malarvadi children come from everywhere.
 */
export function KidsGroup({ className = "" }: S) {
  return (
    <svg viewBox="0 0 200 96" className={className} aria-hidden="true">
      <g transform="translate(6,10) scale(0.88)">
        <KidPlain colors={{ skin: "#C98A5B", hair: "#241812", shirt: "#FFC93C" }} />
      </g>
      <g transform="translate(66,2)">
        <KidPlain colors={{ skin: "#E8B48A", hair: "#3B2A1E", shirt: "#2FA36B" }} />
      </g>
      <g transform="translate(132,10) scale(0.88)">
        <KidPlain colors={{ skin: "#8D5A3B", hair: "#161009", shirt: "#2EC4B6" }} />
      </g>
    </svg>
  );
}
