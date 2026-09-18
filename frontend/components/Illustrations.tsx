import { KidGardener, KidReading, KidWaving, KidWithKite, type KidColors } from "./Decor";

/**
 * Full-scene illustrations that stand in for the photography in the design.
 * Each scene is one self-contained SVG: sky, sun, hills, grass and a group of
 * children composed from the character set in Decor.
 *
 * The characters accept a palette, so every scene uses a different mix of skin
 * tones, hair and clothing rather than repeating one child.
 */
interface S {
  className?: string;
  /**
   * Animate the contents (sun rays, drifting clouds, bobbing children).
   *
   * Off by default and deliberately so: animation inside an SVG repaints the
   * subtree rather than compositing it, which is cheap for one large scene and
   * ruinous across a page of card thumbnails. Only the hero opts in.
   */
  live?: boolean;
}

/* A deliberately varied cast, reused across scenes. */
const CAST: Required<KidColors>[] = [
  { skin: "#8D5524", hair: "#241812", shirt: "#E2365C" },
  { skin: "#E8B48A", hair: "#3B2A1E", shirt: "#1D6FB8" },
  { skin: "#C68642", hair: "#1E1410", shirt: "#FFC93C" },
  { skin: "#F1C9A5", hair: "#5B3A21", shirt: "#2FA36B" },
  { skin: "#A9713F", hair: "#2A1C13", shirt: "#7C3A8A" },
];

function Sky({ from = "#BFE6FA", to = "#EAF8EE" }: { from?: string; to?: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`sky-${from.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#sky-${from.slice(1)})`} />
    </>
  );
}

function SunAndClouds({ live = false }: { live?: boolean }) {
  return (
    <>
      {/* The sun pulses softly and throws turning rays; the clouds drift. */}
      <g style={{ transformOrigin: "338px 52px" }}>
        <g className={live ? "animate-ray-turn" : undefined} style={{ transformOrigin: "338px 52px" }}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <rect
                key={i}
                x={336}
                y={16}
                width={4}
                height={11}
                rx={2}
                fill="#FFC93C"
                opacity="0.75"
                transform={`rotate(${(a * 180) / Math.PI} 338 52)`}
              />
            );
          })}
        </g>
        <circle cx="338" cy="52" r="34" fill="#FFC93C" opacity="0.22" className={live ? "animate-twinkle" : undefined} style={{ transformOrigin: "338px 52px" }} />
        <circle cx="338" cy="52" r="26" fill="#FFC93C" />
      </g>
      <g fill="#FFFFFF" opacity="0.95">
        <g className={live ? "animate-drift" : undefined} style={{ animationDuration: "17s" }}>
          <ellipse cx="72" cy="52" rx="26" ry="15" />
          <ellipse cx="94" cy="50" rx="18" ry="12" />
        </g>
        <g className={live ? "animate-drift" : undefined} style={{ animationDuration: "23s", animationDelay: "2s" }}>
          <ellipse cx="196" cy="34" rx="20" ry="11" />
          <ellipse cx="214" cy="33" rx="14" ry="9" />
        </g>
      </g>
    </>
  );
}

function Ground() {
  return (
    <>
      {/* Rolling hills behind the play area */}
      <path d="M0 196 Q 70 160 150 190 T 300 184 T 400 196 L400 300 L0 300 Z" fill="#2FA36B" opacity="0.35" />
      <path d="M0 214 Q 100 186 210 210 T 400 206 L400 300 L0 300 Z" fill="#2FA36B" opacity="0.55" />
      <rect y="244" width="400" height="56" fill="#2FA36B" opacity="0.75" />
      {/* Grass tufts */}
      <g stroke="#1e7a4e" strokeWidth="3" strokeLinecap="round" opacity="0.55">
        <path d="M24 262 V252" />
        <path d="M31 262 V255" />
        <path d="M132 268 V257" />
        <path d="M139 268 V261" />
        <path d="M268 264 V254" />
        <path d="M275 264 V258" />
        <path d="M366 270 V259" />
      </g>
    </>
  );
}

/** A group of children with arms up, cheering - the hero scene. */
export function SceneCheer({ className = "", live = false }: S) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <Sky />
      <SunAndClouds live={live} />
      {/* Kite flying over the group */}
      <g className={live ? "animate-sway-slow" : undefined} style={{ transformOrigin: "314px 78px" }}>
        <path d="M300 96 L314 78 L328 96 L314 118 Z" fill="#F2789F" />
        <path d="M314 118 Q 320 132 310 142" stroke="#2B2117" strokeWidth="1.6" fill="none" opacity="0.45" strokeDasharray="4 4" />
      </g>
      <Ground />
      {/* The children bob as two groups rather than four. Each animated group
          is its own repaint region inside the SVG, and four of them on a
          hero-sized scene cost noticeably more than two for motion no one can
          tell apart. */}
      <g className={live ? "animate-float" : undefined} style={{ animationDuration: "4.4s" }}>
        <svg x="34" y="150" width="78" height="117" viewBox="0 0 64 96">
          <KidWaving colors={CAST[0]} />
        </svg>
        <svg x="186" y="146" width="82" height="123" viewBox="0 0 64 96">
          <KidWaving colors={CAST[2]} />
        </svg>
      </g>
      <g className={live ? "animate-float" : undefined} style={{ animationDuration: "5.4s", animationDelay: "0.9s" }}>
        <svg x="106" y="138" width="86" height="129" viewBox="0 0 64 96">
          <KidWithKite colors={CAST[1]} />
        </svg>
        <svg x="258" y="156" width="74" height="111" viewBox="0 0 64 96">
          <KidWithKite colors={CAST[3]} />
        </svg>
      </g>
      {/* Confetti sparkle */}
      <g fill="#FFC93C">
        <circle cx="60" cy="118" r="3" className={live ? "animate-twinkle" : undefined} style={{ transformOrigin: "60px 118px" }} />
        <circle cx="236" cy="104" r="2.6" className={live ? "animate-twinkle" : undefined} style={{ transformOrigin: "236px 104px", animationDelay: "0.7s" }} />
        <circle cx="180" cy="90" r="2.2" className={live ? "animate-twinkle" : undefined} style={{ transformOrigin: "180px 90px", animationDelay: "1.4s" }} />
      </g>
    </svg>
  );
}

/** Children planting a sapling - environment and campaign scenes. */
export function ScenePlanting({ className = "", live = false }: S) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <Sky from="#CDEBFB" to="#EFFAE9" />
      <SunAndClouds live={live} />
      <Ground />
      {/* The sapling being planted */}
      <g>
        <path d="M204 250 V214" stroke="#6B4A2B" strokeWidth="5" strokeLinecap="round" />
        <path d="M204 224 Q 184 210 180 190 Q 200 192 204 214" fill="#2FA36B" />
        <path d="M204 218 Q 226 204 232 184 Q 210 188 204 210" fill="#4BBE7F" />
        <ellipse cx="204" cy="252" rx="26" ry="7" fill="#6B4A2B" opacity="0.45" />
      </g>
      <svg x="106" y="150" width="78" height="117" viewBox="0 0 64 96">
        <KidGardener colors={CAST[1]} />
      </svg>
      <svg x="226" y="152" width="76" height="114" viewBox="0 0 64 96">
        <KidGardener colors={CAST[4]} />
      </svg>
      <svg x="42" y="170" width="62" height="93" viewBox="0 0 64 96">
        <KidWaving colors={CAST[2]} />
      </svg>
    </svg>
  );
}

/** Children with a trophy - competitions and finals. */
export function SceneTrophy({ className = "", live = false }: S) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <Sky from="#FFE9B8" to="#FFF8E9" />
      <SunAndClouds live={live} />
      <Ground />
      {/* Trophy held up in the middle */}
      <g transform="translate(200 96)">
        <path d="M-20 -22 H20 V-6 A20 20 0 0 1 -20 -6 Z" fill="#FFC93C" />
        <path d="M-20 -18 H-30 A10 10 0 0 0 -20 -4 Z" fill="#F5BC31" />
        <path d="M20 -18 H30 A10 10 0 0 1 20 -4 Z" fill="#F5BC31" />
        <rect x="-4" y="14" width="8" height="14" fill="#E0A81F" />
        <rect x="-16" y="28" width="32" height="8" rx="3" fill="#E0A81F" />
        <circle cx="0" cy="-12" r="5" fill="#FFF8E9" opacity="0.7" />
      </g>
      <g fill="#F2789F">
        <circle cx="120" cy="82" r="3.4" />
        <circle cx="286" cy="92" r="3" />
        <circle cx="160" cy="62" r="2.4" />
        <circle cx="252" cy="58" r="2.6" />
      </g>
      <svg x="118" y="148" width="80" height="120" viewBox="0 0 64 96">
        <KidWaving colors={CAST[3]} />
      </svg>
      <svg x="204" y="148" width="80" height="120" viewBox="0 0 64 96">
        <KidWaving colors={CAST[0]} />
      </svg>
      <svg x="44" y="170" width="64" height="96" viewBox="0 0 64 96">
        <KidReading colors={CAST[2]} />
      </svg>
      <svg x="292" y="172" width="62" height="93" viewBox="0 0 64 96">
        <KidWithKite colors={CAST[1]} />
      </svg>
    </svg>
  );
}

/** A camp scene with a tent - camps and residential programs. */
export function SceneCamp({ className = "", live = false }: S) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <Sky from="#B9E3F7" to="#EAF8EE" />
      <SunAndClouds live={live} />
      <Ground />
      {/* Tent */}
      <g>
        <path d="M250 250 L300 168 L350 250 Z" fill="#E2365C" />
        <path d="M300 168 L300 250" stroke="#FFF8E9" strokeWidth="4" />
        <path d="M300 250 L286 206 L300 194 L314 206 Z" fill="#8F1F3C" opacity="0.65" />
      </g>
      {/* Campfire */}
      <g transform="translate(120 240)">
        <path d="M-14 8 L14 2" stroke="#6B4A2B" strokeWidth="5" strokeLinecap="round" />
        <path d="M-14 2 L14 8" stroke="#6B4A2B" strokeWidth="5" strokeLinecap="round" />
        <path d="M0 -18 Q 8 -8 4 0 Q 0 4 -4 0 Q -8 -8 0 -18 Z" fill="#FF8A5B" />
        <path d="M0 -10 Q 4 -5 2 0 Q 0 2 -2 0 Q -4 -5 0 -10 Z" fill="#FFC93C" />
      </g>
      <svg x="58" y="158" width="74" height="111" viewBox="0 0 64 96">
        <KidReading colors={CAST[4]} />
      </svg>
      <svg x="164" y="154" width="78" height="117" viewBox="0 0 64 96">
        <KidWaving colors={CAST[1]} />
      </svg>
    </svg>
  );
}

/** Children reading together - classroom, stories and news. */
export function SceneLearning({ className = "", live = false }: S) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <Sky from="#E3D7F6" to="#FFF8E9" />
      <SunAndClouds live={live} />
      <Ground />
      <svg x="70" y="148" width="82" height="123" viewBox="0 0 64 96">
        <KidReading colors={CAST[0]} />
      </svg>
      <svg x="158" y="144" width="86" height="129" viewBox="0 0 64 96">
        <KidReading colors={CAST[3]} />
      </svg>
      <svg x="250" y="152" width="78" height="117" viewBox="0 0 64 96">
        <KidReading colors={CAST[2]} />
      </svg>
      {/* Floating letters, as if read aloud */}
      <g fill="#7C3A8A" opacity="0.5" fontFamily="sans-serif" fontWeight="700">
        <text x="120" y="96" fontSize="20">A</text>
        <text x="214" y="78" fontSize="17">ക</text>
        <text x="292" y="100" fontSize="15">B</text>
      </g>
    </svg>
  );
}

/** Round portrait illustration used for leader cards. */
export function ScenePortrait({ className = "", index = 0 }: S & { index?: number }) {
  const c = CAST[index % CAST.length];
  const bands = ["#EAF8EE", "#FDEFF4", "#FFF3D6", "#E9F3FD", "#F1EAFA"];
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-hidden="true">
      <circle cx="60" cy="60" r="60" fill={bands[index % bands.length]} />
      <circle cx="60" cy="108" r="42" fill={c.shirt} opacity="0.9" />
      <svg x="28" y="18" width="64" height="96" viewBox="0 0 64 96">
        <KidWaving colors={c} />
      </svg>
    </svg>
  );
}

/** Scene lookup used by the photo slots. */
export const SCENES = {
  cheer: SceneCheer,
  planting: ScenePlanting,
  trophy: SceneTrophy,
  camp: SceneCamp,
  learning: SceneLearning,
} as const;

export type SceneName = keyof typeof SCENES;

/** Deterministic scene pick, so a given card always draws the same picture. */
export function sceneFor(index: number): SceneName {
  const order: SceneName[] = ["planting", "trophy", "camp", "learning", "cheer"];
  return order[index % order.length];
}
