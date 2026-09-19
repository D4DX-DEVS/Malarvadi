import Image from "next/image";
import { Reveal } from "../Reveal";
import { Button } from "../ui";
import { Flower, Leaf, Sun } from "../Decor";

/**
 * The closing invitation: one wide rose band with a child at each end, the
 * single button the whole page has been building towards, and a handwritten
 * aside beside the girl.
 *
 * It carries exactly one action. Everything above offers somewhere else to go;
 * this is the only place that asks for something, so a second link here would
 * cost it the ask.
 *
 * The section pulls the footer up underneath itself, so the band sits on the
 * footer's green hills the way the reference draws it.
 */
export function JoinBand({ locale, title, sub, cta }: { locale: string; title: string; sub: string; cta: string }) {
  return (
    <section className="relative z-10 -mb-20 bg-transparent pt-6 sm:-mb-[6.5rem] sm:pt-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal variant="pop">
          <div className="relative rounded-[3rem] bg-rose px-6 py-10 shadow-[0_18px_40px_-24px_rgba(43,33,23,0.35)] sm:px-12 sm:py-12 md:pl-40 md:pr-56 lg:pr-72">
            {/* A child stands at each end, spilling over the band's edge. */}
            <Image
              src="/images/join-boy.png"
              alt=""
              aria-hidden="true"
              width={260}
              height={208}
              className="pointer-events-none absolute -top-8 left-3 hidden h-44 w-auto animate-float-slow select-none object-contain md:block"
            />
            <Image
              src="/images/join-girl.png"
              alt=""
              aria-hidden="true"
              width={230}
              height={208}
              className="pointer-events-none absolute -top-6 right-[12%] hidden h-44 w-auto animate-float select-none object-contain md:block lg:right-[16%]"
            />

            <Sun face className="pointer-events-none absolute -top-7 right-4 hidden h-16 w-16 animate-float-slow text-marigold sm:block" />
            <Leaf className="pointer-events-none absolute -left-3 bottom-6 hidden h-8 w-8 -rotate-[30deg] text-leaf md:block" />
            <Leaf className="pointer-events-none absolute -right-2 top-1/2 hidden h-8 w-8 rotate-[40deg] text-leaf md:block" />
            <Flower className="pointer-events-none absolute -bottom-2 left-[30%] hidden h-8 w-8 animate-float text-blossom sm:block" />
            <Flower className="pointer-events-none absolute -bottom-1 right-[30%] hidden h-7 w-7 animate-float-slow text-marigold sm:block" />

            <div className="relative mx-auto max-w-lg text-center">
              <h2 className="font-display text-2xl font-bold text-cocoa sm:text-3xl">{title}</h2>
              <p className="mt-2 text-sm text-cocoa/70 lg:hidden">{sub}</p>
              <div className="mt-5 flex justify-center">
                <Button href={`/${locale}/contact`} variant="berry">
                  {cta}
                </Button>
              </div>
            </div>

            {/* The handwritten aside beside the girl, desktop only. */}
            <p className="pointer-events-none absolute right-3 top-1/2 hidden w-36 -translate-y-1/2 -rotate-[8deg] font-display text-lg font-bold italic leading-snug text-[#1F6B3A] lg:block">
              {sub}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
