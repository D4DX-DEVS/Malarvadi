"use client";

import { Container } from "@/components/ui";
import { CloudFriend } from "@/components/Decor";

/** Bilingual error state: locale props are unavailable here, so both languages are shown. */
export default function LocaleError({ reset }: { error?: Error; reset: () => void }) {
  return (
    <Container className="py-16 text-center">
      <div className="animate-pop-in mx-auto max-w-md rounded-cardLg bg-white p-8 shadow-playful">
        <CloudFriend className="mx-auto h-16 w-24 animate-float text-teal/50" />
        <h1 className="mt-3 font-display text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-cocoa/70">Please try again. / വീണ്ടും ശ്രമിക്കൂ.</p>
        <button
          onClick={reset}
          className="pop mt-4 inline-block min-h-[44px] rounded-full bg-cocoa px-6 py-2.5 text-sm font-bold text-white hover:shadow-lift"
        >
          Try again / വീണ്ടും ശ്രമിക്കുക
        </button>
      </div>
    </Container>
  );
}
