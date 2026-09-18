import Image from "next/image";
import { photoSrc } from "@/lib/photos";
import { SCENES, sceneFor, type SceneName } from "./Illustrations";

/**
 * A picture slot. By default it draws one of the illustrated scenes in
 * `Illustrations.tsx`; dropping `public/images/<name>.jpg` swaps in a real
 * photograph at exactly the same size, so the layout never shifts when
 * photography arrives later.
 *
 * With `zoom`, the artwork swells gently inside the fixed frame whenever the
 * nearest `.group` ancestor is hovered or focused.
 */
export function Photo({
  name,
  alt,
  /** Tailwind aspect/size classes for the frame. */
  className = "aspect-[4/3]",
  rounded = "rounded-cardLg",
  /** Which illustrated scene to draw when no photo is supplied. */
  scene,
  /** Used to vary the scene when none is named explicitly. */
  tone = 0,
  priority = false,
  zoom = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  name: string;
  alt: string;
  className?: string;
  rounded?: string;
  scene?: SceneName;
  tone?: number;
  priority?: boolean;
  zoom?: boolean;
  sizes?: string;
}) {
  const src = photoSrc(name);
  const Scene = SCENES[scene ?? sceneFor(tone)];
  const inner = zoom ? "zoom-target" : "";

  return (
    <div className={`relative bg-cream ${zoom ? "zoom-frame" : "overflow-hidden"} ${rounded} ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${inner}`} />
      ) : (
        <Scene className={`absolute inset-0 h-full w-full ${inner}`} />
      )}
    </div>
  );
}

/** Wide hero-sized slot. */
export function PhotoHero({ name, alt, priority = true }: { name: string; alt: string; priority?: boolean }) {
  const src = photoSrc(name);
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2.5rem] bg-cream shadow-soft sm:aspect-[4/3]">
      {src ? (
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 55vw" priority={priority} className="object-cover" />
      ) : (
        <SCENES.cheer live className="scene-live absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
