import Link from "next/link";
import { pick, type Localized } from "@/lib/api";
import { Photo } from "../Photo";
import type { SceneName } from "../Illustrations";
import { Reveal } from "../Reveal";
import { Button, CircleArrow } from "../ui";
import { Sparkle } from "../Decor";

/* One distinct picture per highlight slot, in the reference's order. */
const HIGHLIGHT_SCENES: SceneName[] = ["planting", "trophy", "camp"];

/* Each card carries its own accent so the row reads as three different days
   out rather than three copies of one card. */
const ACCENTS = [
  { tag: "bg-leaf/15 text-[#1e7a4e]", ring: "hover:ring-leaf/40" },
  { tag: "bg-marigold/35 text-cocoa", ring: "hover:ring-marigold/50" },
  { tag: "bg-blossom/20 text-berry", ring: "hover:ring-blossom/40" },
];

export interface HighlightDoc {
  slug: string;
  title: Localized;
  /** Whichever date the source collection carries. */
  dateStart?: string;
  publishedAt?: string;
  /** Section this item came from, used to build the link. */
  kind: "events" | "news" | "gallery";
}

/**
 * "Recent Highlights": three wide picture cards, each with a date pill sitting
 * on the artwork like a stamp on a photo print, a category tag, and a coloured
 * round arrow. Photos come from `public/images` (`highlight-1..3`) and fall
 * back to the illustrated scenes.
 */
export function Highlights({
  locale,
  title,
  sub,
  viewAll,
  items,
}: {
  locale: string;
  title: string;
  sub: string;
  viewAll: string;
  items: HighlightDoc[];
}) {
  if (!items.length) return null;

  const kindLabel = (k: HighlightDoc["kind"]) => {
    if (locale === "ml") return k === "events" ? "പരിപാടി" : k === "news" ? "വാർത്ത" : "ഗാലറി";
    return k === "events" ? "Event" : k === "news" ? "Story" : "Album";
  };

  return (
    <section className="bg-sand pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <Reveal variant="up">
            <div>
              <span className="t-micro badge-wrap inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-berry shadow-playful">
                <Sparkle className="h-3.5 w-3.5" />
                {locale === "ml" ? "പുതിയത്" : "Latest"}
              </span>
              <h2 className="t-h2 mt-3">
                <span className="crayon-underline text-berry">{title}</span>
              </h2>
              <p className="t-body mt-3 max-w-lg">{sub}</p>
            </div>
          </Reveal>
          <Button href={`/${locale}/news`} variant="soft">
            {viewAll}
          </Button>
        </div>

        <div className="card-grid block-gap sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((d, i) => {
            const raw = d.dateStart ?? d.publishedAt;
            const parsed = raw ? new Date(raw) : null;
            const valid = parsed && !isNaN(parsed.getTime()) ? parsed : null;
            const intl = locale === "ml" ? "ml-IN" : "en-IN";
            const accent = ACCENTS[i % ACCENTS.length];

            return (
              <Reveal key={`${d.kind}-${d.slug}`} delay={`${i * 120}ms`} variant="up" className="h-full">
                <Link
                  href={`/${locale}/${d.kind}/${d.slug}`}
                  className={`squish group flex h-full flex-col overflow-hidden rounded-cardXl bg-white p-3 shadow-playful ring-1 ring-cocoa/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${accent.ring}`}
                >
                  <div className="relative">
                    <Photo
                      name={`highlight-${i + 1}`}
                      alt={pick(locale, d.title)}
                      scene={HIGHLIGHT_SCENES[i % HIGHLIGHT_SCENES.length]}
                      zoom
                      className="aspect-[4/3]"
                      rounded="rounded-cardLg"
                    />

                    {/* Category always; the date stamp only when there is one,
                        so an undated item shows a clean picture rather than an
                        empty chip. */}
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] shadow-playful ${accent.tag}`}
                    >
                      {kindLabel(d.kind)}
                    </span>

                    {valid ? (
                      <span
                        aria-hidden="true"
                        className="tilt-on-hover absolute right-3 top-3 flex h-14 w-12 flex-col items-center justify-center rounded-2xl bg-white/95 shadow-playful"
                      >
                        <span className="font-display text-xl font-bold leading-none text-berry">
                          {valid.toLocaleDateString(intl, { day: "numeric" })}
                        </span>
                        <span className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-cocoa/60">
                          {valid.toLocaleDateString(intl, { month: "short" })}
                        </span>
                      </span>
                    ) : null}

                    <Sparkle className="spark-on-hover pointer-events-none absolute bottom-3 right-3 h-6 w-6 text-marigold" />
                  </div>

                  <div className="flex flex-1 items-end justify-between gap-3 px-2 pb-1 pt-4">
                    <h3 className="t-h4 group-hover:underline">
                      {pick(locale, d.title)}
                    </h3>
                    <CircleArrow as="span" label={pick(locale, d.title)} tone={i} />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
