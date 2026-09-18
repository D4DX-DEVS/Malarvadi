import Link from "next/link";
import { pick, type Localized } from "@/lib/api";
import { Badge, CircleArrow } from "./ui";
import { Photo } from "./Photo";
import { sceneFor } from "./Illustrations";

export interface NewsRowDoc {
  slug: string;
  title: Localized;
  excerpt?: Localized;
  publishedAt?: string;
  featured?: boolean;
  demo?: boolean;
}

/**
 * News list row from the reference: a square picture on the left, the story
 * title and date on the right, the whole row one link.
 */
export function NewsRow({
  locale,
  doc,
  index = 0,
  demoLabel,
  featuredLabel,
}: {
  locale: string;
  doc: NewsRowDoc;
  index?: number;
  demoLabel?: string;
  featuredLabel?: string;
}) {
  const parsed = doc.publishedAt ? new Date(doc.publishedAt) : null;
  const date = parsed && !isNaN(parsed.getTime()) ? parsed : null;
  const label = date
    ? date.toLocaleDateString(locale === "ml" ? "ml-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;
  const excerpt = doc.excerpt ? pick(locale, doc.excerpt) : "";

  return (
    <Link
      href={`/${locale}/news/${doc.slug}`}
      className="row-hover group flex items-center gap-4 rounded-cardXl bg-white p-3 shadow-playful hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:p-4"
    >
      <Photo
        name={`news-${index + 1}`}
        alt={pick(locale, doc.title)}
        scene={sceneFor(index + 3)}
        zoom
        className="aspect-square w-20 shrink-0 sm:w-24"
        rounded="rounded-2xl"
        sizes="96px"
      />

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          {doc.featured && featuredLabel ? <Badge tone="plum">{featuredLabel}</Badge> : null}
          {doc.demo ? <Badge tone="marigold">{demoLabel ?? "Demo"}</Badge> : null}
        </span>
        <span className="t-h4 mt-1 block group-hover:underline">
          {pick(locale, doc.title)}
        </span>
        {excerpt ? <span className="t-meta mt-1 line-clamp-1 block">{excerpt}</span> : null}
        {label ? <span className="mt-0.5 block text-xs font-semibold text-cocoa/60">{label}</span> : null}
      </span>

      <CircleArrow as="span" label={pick(locale, doc.title)} tone={index} />
    </Link>
  );
}
