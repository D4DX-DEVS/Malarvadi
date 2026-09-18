import Link from "next/link";
import { Book, Flower, Heart, Kite, Leaf, Sprout, Star, Sun } from "../Decor";
import { Reveal } from "../Reveal";
import { CountUp } from "../CountUp";
import { GardenAmbience } from "../GardenAmbience";

/** One interest chip, linked to a real program `type` filter. */
export interface CategoryItem {
  type: string;
  label: string;
  hint: string;
}

/** One milestone fact shown in the "Together We Grow" card. */
export interface ImpactItem {
  big: string;
  title: string;
  text: string;
}

/**
 * The sand band: interest tiles on the left, the "Together We Grow" facts card
 * on the right.
 *
 * The tiles are full cards rather than bare icons - each one is a real doorway
 * into the Programs page, so it is given a card's weight and its own colour.
 * Laid out three-up they fill the column to the height of the facts card, which
 * is what keeps the band from opening a hole under the icons.
 */
const ICONS = [Star, Book, Flower, Sun, Sprout, Kite];

/** Each interest keeps one colour across icon, card wash and hover ring. */
const TILES = [
  { wash: "bg-leaf/15 hover:bg-leaf/25", ring: "ring-leaf/25", icon: "bg-leaf text-white" },
  { wash: "bg-plum/10 hover:bg-plum/20", ring: "ring-plum/25", icon: "bg-plum text-white" },
  { wash: "bg-blossom/15 hover:bg-blossom/25", ring: "ring-blossom/30", icon: "bg-berry text-white" },
  { wash: "bg-sky/15 hover:bg-sky/25", ring: "ring-sky/30", icon: "bg-ink-blue text-white" },
  { wash: "bg-marigold/25 hover:bg-marigold/40", ring: "ring-marigold/40", icon: "bg-marigold text-cocoa" },
  { wash: "bg-teal/15 hover:bg-teal/25", ring: "ring-teal/30", icon: "bg-teal text-white" },
];

const STAT_ICONS = [Star, Flower, Leaf, Heart];
const STAT_TINTS = ["text-berry", "text-leaf", "text-ink-blue", "text-coral"];

export function GrowBand({
  locale,
  categories,
  growTitle,
  growSub,
  stats,
}: {
  locale: string;
  categories: { title: string; sub: string; items: CategoryItem[] };
  growTitle: string;
  growSub: string;
  /** Real milestone facts, reused from the impact dictionary. */
  stats: ImpactItem[];
}) {
  return (
    <section aria-label={categories.title} className="relative bg-sand">
      <GardenAmbience />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
          <div className="min-w-0">
            <Reveal variant="up">
              <div>
                <span className="t-micro badge-wrap inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-leaf shadow-playful">
                  <Sprout className="h-3.5 w-3.5" />
                  {locale === "ml" ? "പരിപാടികൾ" : "Programs"}
                </span>
                <h2 className="t-h2 mt-3">
                  <span className="crayon-underline text-leaf">{categories.title}</span>
                </h2>
                <p className="t-body mt-3 max-w-lg">{categories.sub}</p>
              </div>
            </Reveal>

            <div className="block-gap grid grid-cols-2 gap-4 sm:grid-cols-3">
              {categories.items.map((item, i) => {
                const Icon = ICONS[i % ICONS.length];
                const tile = TILES[i % TILES.length];
                const href = item.type ? `/${locale}/programs?type=${item.type}` : `/${locale}/programs`;
                return (
                  <Reveal key={item.type || "all"} delay={`${(i % 6) * 120}ms`} variant="pop" className="h-full">
                    <Link
                      href={href}
                      className={`squish group flex h-full flex-col items-start gap-3 rounded-cardXl p-4 ring-1 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf sm:p-5 ${tile.wash} ${tile.ring}`}
                    >
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-playful transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 sm:h-14 sm:w-14 ${tile.icon}`}
                        aria-hidden="true"
                      >
                        <span className="bloom-on-hover animate-float-slow" style={{ animationDelay: `${i * 0.35}s` }}>
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className="t-h4 block group-hover:underline">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-xs font-semibold leading-snug text-cocoa/60">
                          {item.hint}
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* "Together We Grow!" - real milestones only, no invented figures. */}
          <Reveal variant="right">
            <div className="relative h-full overflow-hidden rounded-cardXl bg-gradient-to-b from-marigold/45 to-marigold/25 p-6 shadow-playful ring-1 ring-marigold/50 sm:p-7">
              <Sun className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 animate-ray-turn text-white/40" />
              <div className="relative">
                <h2 className="t-h3 text-cocoa">{growTitle}</h2>
                <p className="mt-1 text-xs font-semibold text-cocoa/60">{growSub}</p>

                <ul className="mt-5 grid gap-4">
                  {stats.slice(0, 4).map((s, i) => {
                    const Icon = STAT_ICONS[i % STAT_ICONS.length];
                    return (
                      <li key={i} className="flex items-start gap-3.5">
                        <span
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-playful ${STAT_TINTS[i % STAT_TINTS.length]}`}
                          aria-hidden="true"
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <CountUp value={s.big} className="t-stat block text-2xl" />
                          <span className="mt-1 block text-sm font-semibold leading-snug text-cocoa/75">{s.title}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
