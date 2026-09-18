import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Book, Flower, KidsGroup, Kite, Sprout, Star } from "@/components/Decor";
import { GardenAmbience } from "@/components/GardenAmbience";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const dict = getDictionary(l);
  return pageMeta(l, "/history", dict.history.title, dict.history.sub);
}

interface HEvent {
  year: string;
  title: string;
  text: string;
}

const MILESTONE_ICONS = [Book, Sprout, Star, Kite, Flower];

/**
 * History gets a proper "garden path" timeline: a dotted vertical trail with
 * small milestone icons in place of plain dots, and each stop reveals as the
 * page scrolls.
 */
export default async function HistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const events = dict.history.events as HEvent[];
  return (
    <main className="relative">
      <GardenAmbience />
      <Container className="relative py-10 sm:py-14">
        <PageHero badge={dict.nav.history} badgeTone="plum" title={dict.history.title} sub={dict.history.sub} tint="from-plum/25 to-cream" mascot={<KidsGroup className="h-16 w-40" />} />
        <ol className="dotted-path section-gap space-y-0 pl-6 sm:pl-8">
          {events.map((e, i) => {
            const Icon = MILESTONE_ICONS[i % MILESTONE_ICONS.length];
            return (
              <Reveal key={i} delay={`${i * 120}ms`} variant={i % 2 ? "right" : "left"}>
                <li className="relative grid gap-2 pb-8 sm:grid-cols-[90px_1fr]">
                  <span className="font-display text-xl font-bold leading-snug text-leaf">{e.year}</span>
                  <div className="pop rounded-card bg-white p-5 shadow-playful hover:shadow-soft">
                    <h3 className="t-h3">{e.title}</h3>
                    <p className="t-meta mt-1.5">{e.text}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute -left-6 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-marigold text-cocoa shadow-playful ring-4 ring-marigold/25 sm:-left-8"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </main>
  );
}
