import Image from "next/image";
import Link from "next/link";
import { Reveal } from "../Reveal";

/**
 * The six things Malarvadi does, as a pastel card each on the pale blue band.
 *
 * These are the objectives page's headings, brought forward so the home page
 * answers "what actually happens here?" before it asks anyone to join. Each
 * card links into the objectives page rather than inventing a destination of
 * its own, so the grid stays a summary and never becomes a second navigation.
 *
 * The pictures are the reference sheet's own illustrations, extracted as
 * `public/images/focus-<n>.png` cut-outs: a full colour illustration on each
 * card, exactly as the reference draws it.
 */
const LOOKS = [
  { wash: "bg-[#DDEEFB]", text: "text-[#1E63B0]", img: "/images/focus-1.png", size: [224, 170] as const },
  { wash: "bg-[#FBE0EA]", text: "text-[#C2185B]", img: "/images/focus-2.png", size: [207, 165] as const },
  { wash: "bg-[#E3F4E1]", text: "text-[#2E7D46]", img: "/images/focus-3.png", size: [222, 166] as const },
  { wash: "bg-[#FDEBD8]", text: "text-[#B5561D]", img: "/images/focus-4.png", size: [272, 175] as const },
  { wash: "bg-[#EBE3F7]", text: "text-[#6B3FA0]", img: "/images/focus-5.png", size: [175, 199] as const },
  { wash: "bg-[#FDF3D4]", text: "text-[#8A6100]", img: "/images/focus-6.png", size: [276, 173] as const },
];

export function FocusGrid({ locale, title, sub, items }: { locale: string; title: string; sub: string; items: string[] }) {
  if (!items.length) return null;

  return (
    <section className="bg-sky-soft py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal variant="up">
          <div className="text-center">
            <h2 className="font-display text-xl font-bold text-berry sm:text-2xl">{title}</h2>
            <p className="sr-only">{sub}</p>
          </div>
        </Reveal>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((label, i) => {
            const look = LOOKS[i % LOOKS.length];
            return (
              <Reveal key={label} delay={`${(i % 3) * 120}ms`} variant="pop" className="h-full">
                <Link
                  href={`/${locale}/objectives`}
                  className={`squish group flex h-full min-h-[11rem] flex-col items-center justify-center gap-3 rounded-[1.75rem] px-5 py-8 text-center shadow-[0_6px_0_rgba(43,33,23,0.06)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${look.wash}`}
                >
                  <span aria-hidden="true" className="hop-on-hover block select-none">
                    <Image src={look.img} alt="" width={look.size[0]} height={look.size[1]} className="h-20 w-auto object-contain sm:h-24" />
                  </span>
                  <span className={`font-display text-lg font-bold leading-snug ${look.text}`}>{label}</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
