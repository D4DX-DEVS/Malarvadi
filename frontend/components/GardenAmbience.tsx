import { Butterfly, Flower, Leaf, Sparkle } from "./Decor";

/**
 * Ambient garden life for a section background: petals and small flowers
 * drifting down, a butterfly or two crossing the band, and a couple of doodle
 * sparkles - the scattered garden the brand artwork is built from.
 *
 * Deliberately restrained. Everything here is decorative, never interactive,
 * and sits behind the content. Two pieces drift on a phone; the rest wait for
 * `sm`, so a small screen never carries eight continuously animating layers.
 * All of it stops under reduced-motion via the global rule in globals.css.
 */
const FALLING = [
  { left: "8%", delay: "0s", duration: "15s", size: "h-4 w-4", tone: "text-blossom/50", shape: "leaf", phone: true },
  { left: "27%", delay: "6s", duration: "18s", size: "h-3 w-3", tone: "text-marigold/55", shape: "flower", phone: false },
  { left: "48%", delay: "2.5s", duration: "16s", size: "h-3.5 w-3.5", tone: "text-leaf/45", shape: "leaf", phone: false },
  { left: "69%", delay: "9s", duration: "19s", size: "h-4 w-4", tone: "text-lilac/50", shape: "flower", phone: true },
  { left: "88%", delay: "4s", duration: "14s", size: "h-3 w-3", tone: "text-coral/45", shape: "leaf", phone: false },
];

const SPARKS = [
  { left: "17%", top: "22%", delay: "0s", size: "h-3.5 w-3.5", tone: "text-marigold/60" },
  { left: "78%", top: "58%", delay: "1.4s", size: "h-3 w-3", tone: "text-blossom/55" },
];

export function GardenAmbience({ butterfly = true }: { butterfly?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {FALLING.map((p, i) => {
        const Shape = p.shape === "flower" ? Flower : Leaf;
        return (
          <span
            key={i}
            className={`absolute top-0 animate-petal-fall ${p.size} ${p.tone} ${p.phone ? "" : "hidden sm:block"}`}
            style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration }}
          >
            <Shape className="h-full w-full" />
          </span>
        );
      })}

      {SPARKS.map((s, i) => (
        <span
          key={i}
          className={`absolute hidden animate-twinkle sm:block ${s.size} ${s.tone}`}
          style={{ left: s.left, top: s.top, animationDelay: s.delay }}
        >
          <Sparkle className="h-full w-full" />
        </span>
      ))}

      {butterfly ? (
        <>
          <span className="absolute left-0 top-1/3 animate-flit-across text-plum/40">
            <Butterfly className="h-7 w-10" />
          </span>
          <span
            className="absolute left-0 top-2/3 hidden animate-flit-across text-blossom/35 sm:block"
            style={{ animationDelay: "8s", animationDuration: "23s" }}
          >
            <Butterfly className="h-5 w-8" />
          </span>
        </>
      ) : null}
    </div>
  );
}
