import Link from "next/link";
import { pick, type Localized } from "@/lib/api";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { sceneFor } from "../Illustrations";
import { Camera, Leaf, PaperPlane, PlayCircle } from "../Decor";
import { PanelHead } from "./PanelHead";

export interface AlbumDoc {
  slug: string;
  title: Localized;
  coverImage?: string;
  images?: Array<{ cdnUrl?: string }>;
  demo?: boolean;
}

export interface VideoDoc {
  slug: string;
  title: Localized;
  coverImage?: string;
  /** Where the video lives (a YouTube link); the tile opens it in a new tab. */
  fileUrl?: string;
  /** Running time as "mm:ss"; shown when a document carries one. */
  duration?: string;
  publishedAt?: string;
  demo?: boolean;
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

/** White disc with a red triangle - the reference's play button. */
function PlayButton({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center justify-center rounded-full bg-white/95 shadow-soft ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-[45%] w-[45%] translate-x-[6%] text-berry" fill="currentColor">
        <path d="M7 4.8v14.4c0 .8.9 1.3 1.6.9l11-7.2c.6-.4.6-1.3 0-1.7l-11-7.2C7.9 3.5 7 4 7 4.8Z" />
      </svg>
    </span>
  );
}

/**
 * Pictures and videos, side by side: a four-by-two wall of album covers on a
 * mint panel, and a player-shaped feature with its up-next list on a pale blue
 * one, each closing on a short handwritten line.
 *
 * Neither panel embeds a third-party player. A video tile opens the document's
 * own link (YouTube) in a new tab, so the home page stays free of external
 * scripts and cookies.
 */
export function PhotosVideos({
  locale,
  albums,
  videos,
  photosTitle,
  photosSub,
  photosFootnote,
  videosTitle,
  videosSub,
  videosFootnote,
  playLabel,
  viewAll,
}: {
  locale: string;
  albums: AlbumDoc[];
  videos: VideoDoc[];
  photosTitle: string;
  photosSub: string;
  photosFootnote: string;
  videosTitle: string;
  videosSub: string;
  videosFootnote: string;
  playLabel: string;
  viewAll: string;
}) {
  const [feature, ...rest] = videos;
  const intl = locale === "ml" ? "ml-IN" : "en-IN";

  const dateOf = (raw?: string) => {
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d.toLocaleDateString(intl, { day: "numeric", month: "short", year: "numeric" });
  };
  const coverOf = (a: AlbumDoc) => a.coverImage || a.images?.[0]?.cdnUrl;
  const hrefOf = (v: VideoDoc) => v.fileUrl || `/${locale}/gallery`;
  const isExternal = (href: string) => /^https?:\/\//.test(href);

  const Meta = ({ v, className = "" }: { v: VideoDoc; className?: string }) => {
    const date = dateOf(v.publishedAt);
    if (!v.duration && !date) return null;
    return (
      <span className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] font-semibold ${className}`}>
        {v.duration ? (
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            {v.duration}
          </span>
        ) : null}
        {date ? (
          <span className="inline-flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            {date}
          </span>
        ) : null}
      </span>
    );
  };

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.08fr_1fr]">
        {/* ---- Picture wall ------------------------------------------- */}
        <Reveal variant="left">
          <div className="relative h-full overflow-hidden rounded-[2.75rem] bg-mint-soft p-5 ring-1 ring-leaf/15 sm:p-6">
            <Leaf className="pointer-events-none absolute -bottom-2 left-[38%] h-10 w-10 rotate-[35deg] text-leaf/60" />
            <Leaf className="pointer-events-none absolute -bottom-3 right-[28%] h-8 w-8 -rotate-[20deg] text-leaf/50" />

            <PanelHead
              title={photosTitle}
              sub={photosSub}
              href={`/${locale}/gallery`}
              linkLabel={viewAll}
              titleTone="text-berry"
              icon={
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-blue shadow-sm">
                  <Camera className="h-5 w-5" />
                </span>
              }
            />

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {albums.slice(0, 8).map((d, i) => (
                <Link
                  key={d.slug}
                  href={`/${locale}/gallery/${d.slug}`}
                  className="group relative block overflow-hidden rounded-xl shadow-playful transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
                >
                  <Photo
                    name={`gallery-${i + 1}`}
                    src={coverOf(d)}
                    alt={pick(locale, d.title)}
                    scene={sceneFor(i)}
                    zoom
                    className="aspect-[4/3]"
                    rounded="rounded-xl"
                    sizes="(max-width: 640px) 45vw, 12rem"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cocoa/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="reveal-pill pointer-events-none absolute inset-x-1.5 bottom-1.5 line-clamp-2 text-center text-[10px] font-bold leading-tight text-cream">
                    {pick(locale, d.title)}
                  </span>
                </Link>
              ))}
            </div>

            <p className="mt-5 flex items-center gap-2 pl-1 font-display text-sm font-bold italic text-[#245C3A]">
              <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-coral ring-2 ring-coral/70">
                <Camera className="h-4 w-4" />
              </span>
              {photosFootnote}
            </p>
          </div>
        </Reveal>

        {/* ---- Videos -------------------------------------------------- */}
        <Reveal variant="right">
          <div className="relative h-full overflow-hidden rounded-[2.75rem] bg-sky-soft p-5 ring-1 ring-sky/25 sm:p-6">
            <PaperPlane className="pointer-events-none absolute -right-1 top-3 h-9 w-14 -rotate-[28deg] animate-float text-blossom" />

            <PanelHead
              title={videosTitle}
              sub={videosSub}
              href={`/${locale}/gallery`}
              linkLabel={viewAll}
              icon={<PlayCircle className="h-8 w-8" />}
              tone="text-berry"
              titleTone="text-ink-blue"
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
              {feature ? (
                <Link
                  href={hrefOf(feature)}
                  target={isExternal(hrefOf(feature)) ? "_blank" : undefined}
                  rel={isExternal(hrefOf(feature)) ? "noreferrer" : undefined}
                  aria-label={`${playLabel}: ${pick(locale, feature.title)}`}
                  className="group relative block overflow-hidden rounded-2xl shadow-playful focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
                >
                  <Photo
                    name="video-feature"
                    src={feature.coverImage}
                    alt={pick(locale, feature.title)}
                    scene="cheer"
                    zoom
                    className="aspect-[4/3]"
                    rounded="rounded-2xl"
                    sizes="(max-width: 640px) 100vw, 26rem"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-cocoa/20 transition-colors duration-300 group-hover:bg-cocoa/10" />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <PlayButton className="h-14 w-14 transition-transform duration-300 group-hover:scale-110" />
                  </span>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa/85 to-transparent px-3 pb-2.5 pt-8">
                    <span className="line-clamp-2 block font-display text-sm font-bold leading-snug text-white">{pick(locale, feature.title)}</span>
                    <Meta v={feature} className="mt-1 text-white/80" />
                  </span>
                </Link>
              ) : null}

              <ul className="grid content-start gap-2">
                {rest.slice(0, 3).map((d, i) => {
                  const href = hrefOf(d);
                  return (
                    <li key={d.slug}>
                      <Link
                        href={href}
                        target={isExternal(href) ? "_blank" : undefined}
                        rel={isExternal(href) ? "noreferrer" : undefined}
                        className="row-hover group flex items-center gap-2.5 rounded-xl bg-white p-1.5 ring-1 ring-cocoa/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
                      >
                        <span className="relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-lg">
                          <Photo name={`video-${i + 1}`} src={d.coverImage} alt="" scene={sceneFor(i + 1)} className="h-full w-full" rounded="rounded-lg" sizes="72px" />
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-cocoa/20">
                            <PlayButton className="h-5 w-5" />
                          </span>
                        </span>
                        <span className="min-w-0">
                          <span className="line-clamp-2 block text-xs font-bold leading-snug text-cocoa group-hover:underline">{pick(locale, d.title)}</span>
                          <Meta v={d} className="mt-0.5 text-cocoa/55" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-4 text-right font-display text-sm font-bold italic text-[#245C3A]">{videosFootnote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
