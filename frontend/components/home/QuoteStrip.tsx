import { Heart, Sparkle } from "../Decor";
import { Reveal } from "../Reveal";

/**
 * The closing line of the home page, given a card of its own so it lands as a
 * statement rather than a caption. Sits on the sand band and carries the same
 * playful marks as the rest of the garden.
 */
export function QuoteStrip({ text }: { text: string }) {
  return (
    <section className="bg-sand pb-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <Reveal variant="pop">
          <figure className="relative overflow-hidden rounded-cardXl bg-white px-6 py-9 text-center shadow-playful ring-1 ring-cocoa/5 sm:px-12 sm:py-12">
            {/* Quiet marks in the corners, so the card reads as a keepsake. */}
            {/* The delay lives on a wrapper span: the Decor icons take a
                className only, not a style. */}
            <span aria-hidden="true" className="pointer-events-none absolute left-6 top-6 animate-twinkle text-marigold/70">
              <Sparkle className="h-4 w-4" />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-7 top-8 animate-twinkle text-blossom/60"
              style={{ animationDelay: "1.1s" }}
            >
              <Sparkle className="h-5 w-5" />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-7 left-10 hidden animate-twinkle text-leaf/60 sm:block"
              style={{ animationDelay: "2s" }}
            >
              <Sparkle className="h-3.5 w-3.5" />
            </span>

            <span aria-hidden="true" className="block font-display text-5xl leading-none text-berry/25">&ldquo;</span>

            <blockquote className="relative mt-1">
              <p className="mx-auto max-w-2xl font-display text-xl font-bold italic leading-relaxed text-cocoa/85 sm:text-2xl">
                {text}
              </p>
            </blockquote>

            <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-2">
              <span className="h-px w-8 rounded-full bg-cocoa/15" />
              <Heart className="h-4 w-4 animate-float text-berry/70" />
              <span className="h-px w-8 rounded-full bg-cocoa/15" />
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
