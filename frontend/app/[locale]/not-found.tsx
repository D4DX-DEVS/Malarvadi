import Link from "next/link";
import { Container } from "@/components/ui";
import { Cloud, Float, StarBuddy } from "@/components/Decor";

/** Bilingual 404: locale is unknown here, so both languages are shown. */
export default function NotFound() {
  return (
    <Container className="py-16 text-center">
      <div className="animate-pop-in relative mx-auto max-w-md overflow-hidden rounded-cardLg bg-white p-8 shadow-playful">
        <Float className="absolute left-4 top-4 opacity-70" animation="animate-drift">
          <Cloud className="h-8 w-16 text-teal/40" />
        </Float>
        <StarBuddy className="mx-auto h-14 w-14 animate-float text-marigold" />
        <p className="mt-3 font-display text-5xl font-bold">404</p>
        <p className="mt-2 text-cocoa/70">This page could not be found.</p>
        <p className="mt-1 text-cocoa/70">ഈ പേജ് കണ്ടെത്താനായില്ല.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href="/en" className="pop inline-block rounded-full bg-cocoa px-6 py-2.5 text-sm font-bold text-white hover:shadow-lift">
            Home
          </Link>
          <Link href="/ml" className="pop inline-block rounded-full bg-cocoa px-6 py-2.5 text-sm font-bold text-white hover:shadow-lift">
            ഹോം
          </Link>
        </div>
      </div>
    </Container>
  );
}
