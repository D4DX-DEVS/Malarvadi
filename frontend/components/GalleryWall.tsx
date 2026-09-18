import Link from "next/link";
import { pick, type Localized } from "@/lib/api";
import { Photo } from "./Photo";
import { sceneFor } from "./Illustrations";
import { Reveal } from "./Reveal";
import { Badge } from "./ui";
import { Heart, Sparkle } from "./Decor";

export interface AlbumDoc {
  slug: string;
  title: Localized;
  images?: Array<unknown>;
  demo?: boolean;
}

/**
 * Picture wall for the gallery.
 *
 * The rhythm is deliberate rather than random: the opening album runs at
 * double size as the feature, then every sixth tile runs wide, so the wall
 * reads as an arranged scrapbook instead of a uniform grid. Each tile zooms
 * its artwork, lifts its caption and fades in a "view album" pill on hover -
 * and on keyboard focus, so the same affordances reach both.
 */
/**
 * The wall only takes on its arrangement once there is enough to arrange.
 *
 * Phones show a plain two-column grid - with two columns a double-size tile
 * cannot read as a composition, it just leaves holes. The same is true of a
 * short album list at any width, so the feature and wide tiles wait until there
 * are at least five albums to sit around them.
 */
function spanFor(i: number, total: number): string {
  if (total < 5) return "";
  if (i === 0) return "sm:col-span-2 sm:row-span-2";
  if (i % 6 === 4) return "sm:col-span-2";
  return "";
}

export function GalleryWall({
  locale,
  items,
  viewLabel,
  demoLabel,
}: {
  locale: string;
  items: AlbumDoc[];
  viewLabel: string;
  demoLabel: string;
}) {
  return (
    <div className={`mt-8 grid auto-rows-[10.5rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:gap-4 lg:auto-rows-[12rem] lg:gap-5 ${
        items.length < 3 ? "sm:grid-cols-2" : items.length < 5 ? "sm:grid-cols-3" : "sm:grid-cols-3 lg:grid-cols-4"
      }`}>
      {items.map((d, i) => {
        const title = pick(locale, d.title);
        const count = Array.isArray(d.images) ? d.images.length : 0;
        const feature = i === 0 && items.length >= 5;

        return (
          <Reveal key={d.slug} delay={`${(i % 8) * 120}ms`} variant="pop" className={`h-full ${spanFor(i, items.length)}`}>
            <Link
              href={`/${locale}/gallery/${d.slug}`}
              className="group relative block h-full overflow-hidden rounded-cardXl shadow-playful transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <Photo
                name={`gallery-${i + 1}`}
                alt={title}
                scene={sceneFor(i)}
                zoom
                className="h-full w-full"
                rounded="rounded-cardXl"
                sizes={feature ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
              />

              {/* Warm wash so white caption text stays readable over any picture */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cocoa/80 via-cocoa/15 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-95"
              />

              <Sparkle className="spark-on-hover pointer-events-none absolute left-3 top-3 h-5 w-5 text-marigold" />

              {/* Hover / focus affordance */}
              <span className="reveal-pill pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-cocoa shadow-playful">
                <Heart className="h-3 w-3 text-berry" />
                {viewLabel}
              </span>

              <span className="caption-rise pointer-events-none absolute inset-x-0 bottom-0 p-2.5 sm:p-4">
                <span
                  className={`line-clamp-2 block font-display font-bold leading-snug text-cream ${
                    feature ? "text-[13px] sm:text-xl lg:text-2xl" : "text-[13px] sm:text-base"
                  }`}
                >
                  {title}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold text-cream/80">
                  {count > 0 ? (
                    <span>
                      {count} {locale === "ml" ? "ചിത്രങ്ങൾ" : "photos"}
                    </span>
                  ) : null}
                  {d.demo ? <Badge tone="marigold">{demoLabel}</Badge> : null}
                </span>
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
