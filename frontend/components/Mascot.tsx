import Image from "next/image";
import { photoSrc } from "@/lib/photos";
import { KidGardener, KidReading, KidWaving, KidWithKite, type KidColors } from "./Decor";

const DRAWN = {
  waving: KidWaving,
  kite: KidWithKite,
  gardener: KidGardener,
  reading: KidReading,
} as const;

/**
 * One of the illustrated children that stand at the ends of the campaign shelf
 * and the invitation band.
 *
 * Drop `public/images/mascot-<name>.png` (a transparent cut-out) and that
 * artwork is used; until then the simple drawn child stands in at the same
 * height, so the layout is identical either way. Purely decorative.
 */
export function Mascot({
  name,
  drawn = "waving",
  colors,
  className = "",
}: {
  /** Slot name: `mascot-${name}.png` in public/images. */
  name: string;
  drawn?: keyof typeof DRAWN;
  colors?: KidColors;
  className?: string;
}) {
  const src = photoSrc(`mascot-${name}`);
  if (src) {
    /* Height comes from className with `w-auto`, so the file's own aspect
       ratio is kept whatever size the cut-out was exported at. */
    return <Image src={src} alt="" width={240} height={360} aria-hidden="true" className={`select-none object-contain ${className}`} />;
  }
  const Kid = DRAWN[drawn];
  return <Kid className={className} colors={colors} />;
}
