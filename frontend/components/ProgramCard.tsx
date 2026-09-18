import Link from "next/link";
import { pick, type Localized } from "@/lib/api";
import { Badge, CircleArrow } from "./ui";
import { BookBuddy, FlowerFriend, PencilPal, StarBuddy, CloudFriend } from "./Decor";

/**
 * Program tiles in the reference's style: a soft pastel card per program type
 * with a character illustration sitting on it, the title, and a one-line
 * description. Type styling is driven by the real program types only.
 */
const TYPE_STYLE: Record<
  string,
  { buddy: typeof BookBuddy; card: string; chip: "leaf" | "plum" | "teal" | "marigold"; label: string }
> = {
  little_scholar: { buddy: BookBuddy, card: "bg-plum/10", chip: "plum", label: "Quiz" },
  rainbow: { buddy: PencilPal, card: "bg-blossom/15", chip: "marigold", label: "Arts" },
  balolsavam: { buddy: StarBuddy, card: "bg-marigold/25", chip: "marigold", label: "Festival" },
  general: { buddy: FlowerFriend, card: "bg-leaf/15", chip: "leaf", label: "Club" },
  other: { buddy: CloudFriend, card: "bg-sky/15", chip: "teal", label: "Activity" },
};

export interface ProgramCardDoc {
  slug: string;
  title: Localized;
  summary?: Localized;
  type?: string;
  ageGroup?: string;
  demo?: boolean;
}

export function ProgramCard({
  locale,
  doc,
  cta,
  typeLabel,
  demoLabel,
  index = 0,
}: {
  locale: string;
  doc: ProgramCardDoc;
  cta: string;
  /** Localized type label (falls back to the English default). */
  typeLabel?: string;
  demoLabel?: string;
  index?: number;
}) {
  const style = TYPE_STYLE[doc.type ?? "general"] ?? TYPE_STYLE.general;
  const Buddy = style.buddy;
  const summary = doc.summary ? pick(locale, doc.summary) : "";

  return (
    <Link
      href={`/${locale}/programs/${doc.slug}`}
      aria-label={`${pick(locale, doc.title)} - ${cta}`}
      className={`shine-on-hover squish group flex h-full flex-col rounded-cardXl p-6 shadow-playful transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${style.card}`}
    >
      <span
        aria-hidden="true"
        className="flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-playful transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
      >
        <Buddy className="hop-on-hover h-12 w-12 animate-float-slow" />
      </span>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <Badge tone={style.chip}>{typeLabel ?? style.label}</Badge>
        {doc.ageGroup ? <Badge tone="teal">{doc.ageGroup}</Badge> : null}
        {doc.demo ? <Badge tone="marigold">{demoLabel ?? "Demo"}</Badge> : null}
      </div>

      <h3 className="t-h3 mt-2">{pick(locale, doc.title)}</h3>
      {summary ? <p className="t-meta mt-1.5 line-clamp-2">{summary}</p> : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="text-sm font-bold text-cocoa/70 group-hover:underline">{cta}</span>
        <CircleArrow as="span" label={pick(locale, doc.title)} tone={index} />
      </div>
    </Link>
  );
}
