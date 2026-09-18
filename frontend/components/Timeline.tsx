import { Reveal } from "./Reveal";

export interface TimelineItem {
  year: string;
  title: string;
  text?: string;
}

/**
 * Horizontal milestone rail from the reference's About panel: a colored dot
 * per year on a single line, stacking into a vertical list on small screens.
 */
const DOTS = ["bg-berry", "bg-marigold", "bg-leaf", "bg-sky", "bg-plum", "bg-coral"];

export function Timeline({ title, items }: { title: string; items: TimelineItem[] }) {
  return (
    <section aria-label={title} className="section-gap">
      <h2 className="t-h2">{title}</h2>

      <div className="relative block-gap">
        {/* The rail itself - horizontal on desktop, vertical on mobile. */}
        <span aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-0.5 rounded-full bg-leaf/25 md:left-0 md:top-[7px] md:h-0.5 md:w-full" />

        <ol className="grid gap-7 md:grid-cols-5 md:gap-4">
          {items.map((it, i) => (
            <Reveal key={`${it.year}-${i}`} delay={`${i * 120}ms`} variant="up">
              <li className="relative pl-8 md:pl-0 md:pt-8">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1.5 h-4 w-4 origin-bottom animate-sprout-grow rounded-full ring-4 ring-cream md:left-1/2 md:top-0 md:-translate-x-1/2 ${DOTS[i % DOTS.length]}`}
                  style={{ animationDelay: `${i * 90}ms` }}
                />
                <p className="font-display text-xl font-bold leading-none text-leaf md:text-center">{it.year}</p>
                <p className="t-h4 mt-2 md:text-center">{it.title}</p>
                {it.text ? <p className="t-meta mt-1 md:text-center">{it.text}</p> : null}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
