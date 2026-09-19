import { CountUp } from "../CountUp";
import { Reveal } from "../Reveal";
import { Star } from "../Decor";

/** One figure in the reach bar. */
export interface StatItem {
  value: string;
  label: string;
}

/* Line-drawn emblems rather than the filled garden icons used elsewhere: this
   bar states facts, and the outline weight keeps it from reading as another
   playful strip. Each sits inside a thin ring of its own colour. */
function UnitsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 27V11l7-5 7 5v16" />
      <path d="M19 27V15l8-3v15" />
      <path d="M10 27v-6h4v6" />
      <path d="M23 19h1M23 23h1" />
    </svg>
  );
}

function StudentsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="11" r="4.5" />
      <circle cx="23" cy="13" r="3.5" />
      <path d="M4 26c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5" />
      <path d="M21 19.2c3.5.2 6 3 6 6.8" />
    </svg>
  );
}

function MentorsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="16" cy="9" r="4.5" />
      <path d="M7 27c0-5 4-9 9-9s9 4 9 9" />
      <path d="M16 18v9" />
      <path d="M5 13c1.6-1.6 3.2-1.6 4.8 0M22.2 13c1.6-1.6 3.2-1.6 4.8 0" />
    </svg>
  );
}

const ICONS = [UnitsIcon, StudentsIcon, MentorsIcon];
/* Blue, green, red - one colour per figure, carried by the ring, the number
   and the label alike, as the reference sets them. */
const TINTS = ["text-ink-blue", "text-[#2E8B4A]", "text-berry"];

/**
 * The reach bar: one long grey-blue pill under the introduction carrying the
 * movement's three headline figures side by side.
 *
 * Each figure counts up as it arrives, which is the only motion in the band.
 */
export function StatsBar({ items }: { items: StatItem[] }) {
  if (!items.length) return null;

  return (
    <section className="bg-white pb-12 sm:pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal variant="pop">
          <div className="relative">
            <Star className="pointer-events-none absolute -bottom-5 -right-3 hidden h-12 w-12 animate-twinkle text-marigold sm:block" />

            <dl className="grid grid-cols-1 gap-5 rounded-[2.5rem] bg-sky-soft px-6 py-7 shadow-[0_10px_30px_-18px_rgba(43,33,23,0.35)] ring-1 ring-sky/25 sm:grid-cols-3 sm:gap-2 sm:rounded-full sm:px-10 sm:py-6">
              {items.slice(0, 3).map((s, i) => {
                const Icon = ICONS[i % ICONS.length];
                const tint = TINTS[i % TINTS.length];
                return (
                  <div key={s.label} className={`flex items-center justify-center gap-4 ${tint}`}>
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-2 ring-current sm:h-16 sm:w-16">
                      <Icon className="h-8 w-8 sm:h-9 sm:w-9" />
                    </span>
                    <div className="min-w-0">
                      <dt className="sr-only">{s.label}</dt>
                      <dd>
                        <CountUp value={s.value} className="block font-display text-3xl font-bold leading-none sm:text-4xl" />
                        <span className="mt-1 block font-display text-lg font-bold leading-none opacity-90">{s.label}</span>
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
