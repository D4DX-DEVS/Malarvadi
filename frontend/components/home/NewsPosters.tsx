import Link from "next/link";
import { pick, type Localized } from "@/lib/api";
import { Carousel } from "../Carousel";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { Badge } from "../ui";
import { Megaphone, PaperPlane, PictureFrame, Star } from "../Decor";
import { PanelHead } from "./PanelHead";

export interface NewsDoc {
  slug: string;
  title: Localized;
  excerpt?: Localized;
  summary?: Localized;
  coverImage?: string;
  publishedAt?: string;
  demo?: boolean;
}

export interface PosterDoc {
  slug: string;
  title: Localized;
  coverImage?: string;
  fileUrl?: string;
  demo?: boolean;
}

const ARROW = (
  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

/**
 * The news-and-posters row on its pale yellow band: two panels of unequal
 * weight, the way the reference sets them - stories on the left at roughly
 * three-fifths because they carry text, the poster shelf on the right because
 * a poster is read as an image and needs only its own height.
 *
 * They are a single section rather than two so the two headings sit on one
 * line; at tablet width and below the panels stack and each keeps its own
 * heading and "view all" link.
 */
export function NewsPosters({
  locale,
  news,
  posters,
  newsTitle,
  postersTitle,
  viewAll,
  readMore,
  demoLabel,
  prevLabel,
  nextLabel,
}: {
  locale: string;
  news: NewsDoc[];
  posters: PosterDoc[];
  newsTitle: string;
  postersTitle: string;
  viewAll: string;
  readMore: string;
  demoLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  return (
    <section className="relative overflow-hidden bg-butter py-12 sm:py-16">
      <PaperPlane className="pointer-events-none absolute right-[5%] top-[52%] hidden h-9 w-14 -rotate-[24deg] animate-float text-blossom/80 lg:block" />
      <Star className="pointer-events-none absolute -left-5 bottom-12 hidden h-16 w-16 animate-twinkle text-marigold/60 lg:block" />
      <Star className="pointer-events-none absolute right-[3%] top-6 hidden h-8 w-8 animate-twinkle text-marigold lg:block" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
        {/* ---- Stories ------------------------------------------------ */}
        <div className="min-w-0">
          <PanelHead
            title={newsTitle}
            href={`/${locale}/news`}
            linkLabel={viewAll}
            icon={<Megaphone className="h-7 w-7" />}
            tone="text-[#F26B3A]"
            titleTone="text-berry"
          />

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {news.slice(0, 2).map((d, i) => {
              const text = pick(locale, d.excerpt ?? d.summary);
              return (
                <Reveal key={d.slug} delay={`${i * 120}ms`} variant="up" className="h-full">
                  <Link
                    href={`/${locale}/news/${d.slug}`}
                    className="squish group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-[0_8px_24px_-16px_rgba(43,33,23,0.35)] ring-1 ring-cocoa/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
                  >
                    <Photo
                      name={`news-${i + 1}`}
                      src={d.coverImage}
                      alt={pick(locale, d.title)}
                      tone={i}
                      zoom
                      className="aspect-[16/10]"
                      rounded="rounded-2xl"
                      sizes="(max-width: 640px) 100vw, 30vw"
                    />
                    <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3.5">
                      {d.demo ? (
                        <span className="mb-1.5">
                          <Badge tone="marigold">{demoLabel}</Badge>
                        </span>
                      ) : null}
                      <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-berry group-hover:underline sm:text-[17px]">
                        {pick(locale, d.title)}
                      </h3>
                      {text ? <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-cocoa/70">{text}</p> : null}
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-3.5 text-xs font-bold text-[#2E8B4A]">
                        {readMore}
                        <span className="transition-transform duration-200 group-hover:translate-x-1">{ARROW}</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* ---- Posters ------------------------------------------------ */}
        <div className="min-w-0">
          <PanelHead
            title={postersTitle}
            href={`/${locale}/gallery`}
            linkLabel={viewAll}
            icon={<PictureFrame className="h-7 w-7" />}
            tone="text-[#2E8B4A]"
          />

          <Reveal variant="up" className="mt-5">
            <Carousel
              label={postersTitle}
              prevLabel={prevLabel}
              nextLabel={nextLabel}
              className="rounded-[1.75rem] bg-white/70 p-3 ring-1 ring-cocoa/5"
              itemClassName="w-[62%] sm:w-[56%]"
              trackClassName="gap-3 px-[19%] py-1 sm:px-[22%]"
              snap="center"
              persistent
              tone="bg-white text-cocoa"
            >
              {posters.slice(0, 8).map((d, i) => {
                const href = d.fileUrl || d.coverImage || `/${locale}/gallery`;
                const external = /^https?:\/\//.test(href);
                return (
                  <Link
                    key={d.slug}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    aria-label={pick(locale, d.title)}
                    className="group block overflow-hidden rounded-2xl shadow-playful ring-1 ring-cocoa/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
                  >
                    <Photo
                      name={`poster-${i + 1}`}
                      src={d.coverImage}
                      alt={pick(locale, d.title)}
                      tone={i + 2}
                      zoom
                      className="aspect-[3/4]"
                      rounded="rounded-2xl"
                      sizes="(max-width: 640px) 60vw, 14rem"
                    />
                  </Link>
                );
              })}
            </Carousel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
