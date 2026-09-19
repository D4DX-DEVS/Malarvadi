import Image from "next/image";
import Link from "next/link";
import { photoSrc } from "@/lib/photos";
import { Carousel } from "../Carousel";
import { Mascot } from "../Mascot";
import { Book, Butterfly, MusicNote, Rainbow } from "../Decor";

/** One campaign badge in the strip, linked to its programs filter. */
export interface CampaignItem {
  type: string;
  label: string;
  sub: string;
}

/* Each campaign keeps its own shell colour - sampled from the reference ovals:
   cream, pale blue and pink. The extracted oval artwork carries the same field
   colour, so card and shell read as one surface. */
const LOOKS = [
  { shell: "bg-[#fff2cc] ring-marigold/40", label: "text-cocoa", Emblem: Rainbow, emblem: "h-9 w-16" },
  { shell: "bg-[#d6f0fe] ring-sky/40", label: "text-[#1e7a4e]", Emblem: Book, emblem: "h-8 w-11 text-leaf" },
  { shell: "bg-[#fee7f1] ring-blossom/40", label: "text-berry", Emblem: MusicNote, emblem: "h-9 w-8 text-berry" },
];

/**
 * The campaign shelf directly under the banner: the three programmes children
 * recognise by their logo, each on its own oval, with an illustrated child
 * standing at either end of the row the way the reference sheet draws it.
 *
 * The shelf is a scroll-snap row with a round arrow at each end, exactly like
 * the reference - on wide screens all three ovals sit side by side and the
 * arrows rest dimmed, on narrow screens they page between the cards.
 *
 * Each oval is a picture slot. Drop `public/images/campaign-<type>.png` (the
 * campaign's real logo on a transparent background) and it fills the oval;
 * until then a drawn emblem and the campaign's name stand in.
 */
export function CampaignStrip({
  locale,
  title,
  sub,
  items,
  prevLabel,
  nextLabel,
}: {
  locale: string;
  title: string;
  sub: string;
  items: CampaignItem[];
  prevLabel: string;
  nextLabel: string;
}) {
  if (!items.length) return null;

  return (
    <section aria-label={title} className="relative pb-12 sm:pb-16">
      <p className="sr-only">{sub}</p>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="relative flex items-center justify-center gap-2 sm:gap-4 lg:gap-6">
          <Mascot name="boy" drawn="waving" colors={{ shirt: "#5AB6E8" }} className="hidden h-40 w-auto shrink-0 animate-float-slow md:block" />

          <Carousel
            label={title}
            prevLabel={prevLabel}
            nextLabel={nextLabel}
            persistent
            tone="bg-white text-berry"
            className="w-full min-w-0 max-w-4xl"
            itemClassName="w-[78%] sm:w-[46%] lg:w-[31.5%]"
            trackClassName="gap-4 px-[11%] py-2 sm:gap-5 sm:px-[2%] lg:px-[1%]"
            snap="center"
          >
            {items.slice(0, 3).map((item, i) => {
              const look = LOOKS[i % LOOKS.length];
              const { Emblem } = look;
              const logo = photoSrc(`campaign-${item.type || i + 1}`);
              const href = item.type ? `/${locale}/programs?type=${item.type}` : `/${locale}/programs`;
              return (
                <Link
                  key={item.type || item.label}
                  href={href}
                  className={`squish group relative block aspect-[2.3/1] w-full overflow-hidden rounded-[46%/52%] ring-1 shadow-playful transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${look.shell}`}
                >
                  {logo ? (
                    <Image
                      src={logo}
                      alt={item.label}
                      fill
                      sizes="(max-width: 640px) 80vw, 22rem"
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105 sm:p-5"
                    />
                  ) : (
                    <span className="flex h-full flex-col items-center justify-center gap-1 px-4 text-center">
                      <Emblem className={`${look.emblem} transition-transform duration-300 group-hover:scale-110`} />
                      <span className={`font-display text-xl font-bold leading-tight sm:text-2xl ${look.label}`}>{item.label}</span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-cocoa/55">{item.sub}</span>
                    </span>
                  )}
                </Link>
              );
            })}
          </Carousel>

          <Mascot name="girl" drawn="kite" colors={{ shirt: "#F2789F", hair: "#241812" }} className="hidden h-40 w-auto shrink-0 animate-float md:block" />

          {/* The two butterflies the reference lets loose over the shelf. */}
          <Butterfly className="pointer-events-none absolute -top-6 left-[10%] hidden h-6 w-7 animate-float text-marigold lg:block" />
          <Butterfly className="pointer-events-none absolute -bottom-4 right-[9%] hidden h-5 w-6 animate-float-slow text-blossom lg:block" />
        </div>
      </div>
    </section>
  );
}
