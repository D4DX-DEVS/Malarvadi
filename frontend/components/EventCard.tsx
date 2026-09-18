import Link from "next/link";
import { pick, type Localized } from "@/lib/api";
import { Badge, CircleArrow } from "./ui";
import { Photo } from "./Photo";
import { sceneFor } from "./Illustrations";
import { Sparkle } from "./Decor";

export interface EventCardDoc {
  slug: string;
  title: Localized;
  description?: Localized;
  summary?: Localized;
  district?: string;
  dateStart?: string;
  timeLabel?: string;
  demo?: boolean;
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

/** Splits a date into the pieces the chip needs. */
function dateParts(raw: string | undefined, locale: string) {
  const parsed = raw ? new Date(raw) : null;
  const date = parsed && !isNaN(parsed.getTime()) ? parsed : null;
  const intl = locale === "ml" ? "ml-IN" : "en-IN";
  return {
    day: date ? date.toLocaleDateString(intl, { day: "numeric" }) : null,
    month: date ? date.toLocaleDateString(intl, { month: "short" }) : null,
    full: date ? date.toLocaleDateString(intl, { day: "numeric", month: "long", year: "numeric" }) : null,
  };
}

/**
 * The date block that overlaps the picture. Renders nothing when the record has
 * no usable date - an empty chip reads as a broken tile.
 */
function DateChip({ day, month, large = false }: { day: string | null; month: string | null; large?: boolean }) {
  if (!day || !month) return null;
  return (
    <span
      aria-hidden="true"
      className={`tilt-on-hover lean-on-hover flex shrink-0 flex-col items-center justify-center rounded-2xl bg-white shadow-playful ring-1 ring-cocoa/10 ${
        large ? "h-20 w-[4.5rem]" : "h-16 w-14"
      }`}
    >
      <span className={`font-display font-bold leading-none text-berry ${large ? "text-3xl" : "text-2xl"}`}>{day}</span>
      <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-cocoa/60">{month}</span>
    </span>
  );
}

/**
 * Standard event tile: picture on top, the date chip overlapping its lower
 * edge, then title and details. Hovering zooms the picture, tilts the chip and
 * nudges the arrow.
 */
export function EventCard({
  locale,
  doc,
  index = 0,
  cta,
  demoLabel,
}: {
  locale: string;
  doc: EventCardDoc;
  index?: number;
  cta: string;
  demoLabel?: string;
}) {
  const { day, month } = dateParts(doc.dateStart, locale);
  const excerpt = pick(locale, doc.description) || pick(locale, doc.summary);

  return (
    <Link
      href={`/${locale}/events/${doc.slug}`}
      className="squish group flex h-full flex-col rounded-cardXl bg-white p-3 shadow-playful transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <div className="relative">
        <Photo
          name={`event-${index + 1}`}
          alt={pick(locale, doc.title)}
          scene={sceneFor(index)}
          zoom
          className="aspect-[16/10]"
          rounded="rounded-cardLg"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute -bottom-6 left-4">
          <DateChip day={day} month={month} />
        </span>
        <Sparkle className="spark-on-hover pointer-events-none absolute right-3 top-3 h-5 w-5 text-marigold" />
      </div>

      <div className="flex flex-1 flex-col px-2 pb-1 pt-9">
        <div className="flex flex-wrap items-center gap-1.5">
          {doc.demo ? <Badge tone="marigold">{demoLabel ?? "Demo"}</Badge> : null}
        </div>
        <h3 className="t-h3 mt-1.5 group-hover:underline">{pick(locale, doc.title)}</h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-cocoa/60">
          {doc.district ? (
            <span className="inline-flex items-center gap-1.5">
              <PinIcon className="h-3.5 w-3.5 text-berry" />
              {doc.district}
            </span>
          ) : null}
          {doc.timeLabel ? (
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5 text-leaf" />
              {doc.timeLabel}
            </span>
          ) : null}
        </div>

        {excerpt ? <p className="t-meta mt-2 line-clamp-2">{excerpt}</p> : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-sm font-bold text-cocoa/70">{cta}</span>
          <CircleArrow as="span" label={pick(locale, doc.title)} tone={index} />
        </div>
      </div>
    </Link>
  );
}

/**
 * The next event, given room to breathe: a wide picture beside larger type.
 * Used once at the top of the upcoming list.
 */
export function FeaturedEvent({
  locale,
  doc,
  cta,
  nextLabel,
  demoLabel,
}: {
  locale: string;
  doc: EventCardDoc;
  cta: string;
  /** Localized "next up" ribbon label. */
  nextLabel: string;
  demoLabel?: string;
}) {
  const { day, month, full } = dateParts(doc.dateStart, locale);
  const excerpt = pick(locale, doc.description) || pick(locale, doc.summary);

  return (
    <Link
      href={`/${locale}/events/${doc.slug}`}
      className="group grid gap-5 rounded-cardXl bg-white p-4 shadow-playful transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:p-5 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-7"
    >
      <Photo
        name="event-1"
        alt={pick(locale, doc.title)}
        scene="camp"
        zoom
        className="aspect-[4/3]"
        rounded="rounded-cardLg"
        sizes="(max-width: 1024px) 100vw, 22rem"
      />

      <div className="flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-berry/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-berry">
            {nextLabel}
          </span>
          {doc.demo ? <Badge tone="marigold">{demoLabel ?? "Demo"}</Badge> : null}
        </div>

        <div className="mt-3 flex items-start gap-4">
          <DateChip day={day} month={month} large />
          <div className="min-w-0">
            <h2 className="t-h2 group-hover:underline">{pick(locale, doc.title)}</h2>
            {full ? <p className="mt-1 text-sm font-semibold text-cocoa/60">{full}</p> : null}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-cocoa/60">
          {doc.district ? (
            <span className="inline-flex items-center gap-1.5">
              <PinIcon className="h-4 w-4 text-berry" />
              {doc.district}
            </span>
          ) : null}
          {doc.timeLabel ? (
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4 text-leaf" />
              {doc.timeLabel}
            </span>
          ) : null}
        </div>

        {excerpt ? <p className="t-body mt-3 line-clamp-3">{excerpt}</p> : null}

        <div className="mt-5 flex items-center gap-3">
          <span className="inline-flex min-h-[44px] items-center rounded-full bg-berry px-6 text-sm font-bold text-white shadow-playful transition-transform duration-200 group-hover:-translate-y-0.5">
            {cta}
          </span>
          <CircleArrow as="span" label={pick(locale, doc.title)} tone={3} />
        </div>
      </div>
    </Link>
  );
}
