import Image from "next/image";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { Button } from "../ui";
import { Heart, Leaf, Pot, Sprout } from "../Decor";

/**
 * The introduction band: a photograph in a soft cloud-shaped frame on the
 * left, and on the right the movement's name, a two-line display heading, its
 * own description and the green "know more" pill.
 *
 * The green wash behind the picture, the leaves, the potted plant and the big
 * pale-blue heart are the reference's furniture for this band and nothing
 * else on the page repeats them, which is what keeps the section reading as
 * the quiet, wordy one between two busy strips.
 */
export function AboutIntro({
  locale,
  badge,
  line1,
  line2,
  body,
  cta,
}: {
  locale: string;
  badge: string;
  line1: string;
  line2: string;
  body: string;
  cta: string;
}) {
  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Leaf className="absolute left-[3%] top-8 h-9 w-9 rotate-[25deg] animate-sway text-leaf/70" />
        <Leaf className="absolute bottom-8 left-[42%] hidden h-8 w-8 -rotate-[40deg] animate-sway-slow text-leaf/60 md:block" />
        <Sprout className="absolute bottom-4 right-[30%] hidden h-10 w-10 animate-float-slow text-leaf/60 lg:block" />
        <Pot className="absolute right-[6%] top-6 hidden h-24 w-20 lg:block" />
        {/* The big soft heart parked to the right of the text. */}
        <Heart className="absolute right-[2%] top-1/2 hidden h-44 w-44 -translate-y-1/2 rotate-[14deg] animate-float text-[#D6EAF7] xl:block" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.15fr] lg:gap-14">
          <Reveal variant="left">
            <div className="group relative mx-auto max-w-md md:max-w-none">
              {/* Green wash sitting a little off the picture, as in the reference. */}
              <span aria-hidden="true" className="absolute -bottom-6 -left-6 right-8 top-6 -z-10 animate-blob rounded-blob bg-[#D9F0DB]" />
              <Photo
                name="intro"
                alt={`${line1} ${line2}`}
                scene="learning"
                zoom
                className="aspect-[4/3] shadow-soft ring-[6px] ring-white"
                rounded="rounded-blob"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </Reveal>

          <Reveal variant="right">
            <div className="lg:pr-24 xl:pr-40">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa/70">
                <Image src="/icons/icon-32x32.png" alt="" width={16} height={16} aria-hidden="true" className="h-4 w-4 rounded-sm" />
                {badge}
              </span>

              <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-ink-blue sm:text-3xl">
                <span className="block">{line1}</span>
                <span className="block">{line2}</span>
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-cocoa/75 sm:text-[15px]">{body}</p>

              <div className="mt-5">
                <Button href={`/${locale}/about`} variant="leaf">
                  {cta}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
