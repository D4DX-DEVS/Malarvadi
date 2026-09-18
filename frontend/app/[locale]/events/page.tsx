import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { api, type Localized } from "@/lib/api";
import { demoEvents, withDemo } from "@/lib/demo";
import { pageMeta } from "@/lib/seo";
import { Container, EmptyState, FilterChip } from "@/components/ui";
import { PageHero } from "@/components/PageHero";
import { EventCard, FeaturedEvent } from "@/components/EventCard";
import { Reveal } from "@/components/Reveal";
import { Bird, Float, KidReading } from "@/components/Decor";
import { GardenAmbience } from "@/components/GardenAmbience";

interface Doc {
  slug: string;
  title: Localized;
  description?: Localized;
  district?: string;
  dateStart?: string;
  timeLabel?: string;
  demo?: boolean;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const dict = getDictionary(l);
  return pageMeta(l, "/events", dict.nav.events, dict.sections.eventsTitle);
}

/**
 * Events: a banner, upcoming/past tabs, then the next event given feature
 * treatment above a grid of the rest. The tabs stay plain links so the scope
 * lives in the URL and remains shareable and crawlable.
 */
export default async function EventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ scope?: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const sp = await searchParams;
  const scope = sp.scope === "past" ? "past" : "upcoming";
  const res = await api.events(`?limit=24&scope=${scope}`);
  const items = withDemo<Doc>(res?.data as Doc[], scope === "upcoming" ? demoEvents : []);

  /* Only the upcoming list gets a feature card - "next up" is meaningless
     when looking backwards. */
  const feature = scope === "upcoming" && items.length > 1 ? items[0] : null;
  const rest = feature ? items.slice(1) : items;

  const nextLabel = locale === "ml" ? "അടുത്തത്" : "Next up";

  return (
    <main className="relative">
      <GardenAmbience />
      <Container className="relative py-10 sm:py-14">
        <PageHero
          badge={dict.nav.events}
          badgeTone="marigold"
          title={dict.sections.eventsTitle}
          tint="from-marigold/30 to-cream"
          mascot={<KidReading className="h-28 w-20" />}
        />

        <div className="section-gap relative flex flex-wrap items-center gap-2">
          <Float className="pointer-events-none absolute -top-7 right-2 hidden h-6 w-12 opacity-60 sm:block" animation="animate-drift">
            <Bird className="h-full w-full text-cocoa/35" />
          </Float>
          {(["upcoming", "past"] as const).map((s) => (
            <FilterChip key={s} href={`/${locale}/events?scope=${s}`} active={scope === s}>
              {dict.common[s]}
            </FilterChip>
          ))}
        </div>

        {items.length ? (
          <>
            {feature ? (
              <Reveal variant="pop" className="block-gap block">
                <FeaturedEvent
                  locale={locale}
                  doc={feature}
                  cta={dict.common.readMore}
                  nextLabel={nextLabel}
                  demoLabel={dict.common.demo}
                />
              </Reveal>
            ) : null}

            {rest.length ? (
              <div
                className={`card-grid block-gap ${
                  /* Match the column count to what there is to show, so one or
                     two events fill the row instead of leaving empty cells. A
                     lone card keeps an ordinary card's width rather than
                     stretching to half the page. */
                  rest.length === 1 ? "max-w-sm" : rest.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {rest.map((d, i) => (
                  <Reveal key={d.slug} delay={`${(i % 6) * 120}ms`} variant="up" className="h-full">
                    <EventCard
                      locale={locale}
                      doc={d}
                      index={feature ? i + 1 : i}
                      cta={dict.common.readMore}
                      demoLabel={dict.common.demo}
                    />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="block-gap">
            <EmptyState text={dict.common.empty} />
          </div>
        )}
      </Container>
    </main>
  );
}
