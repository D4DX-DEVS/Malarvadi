import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { api, pick, type Localized } from "@/lib/api";
import { demoNews, withDemo } from "@/lib/demo";
import { pageMeta } from "@/lib/seo";
import { Container, EmptyState, CircleArrow, Badge } from "@/components/ui";
import { PageHero } from "@/components/PageHero";
import { NewsRow } from "@/components/NewsRow";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { KidWaving } from "@/components/Decor";
import Link from "next/link";
import { GardenAmbience } from "@/components/GardenAmbience";

interface Doc {
  slug: string;
  title: Localized;
  excerpt?: Localized;
  publishedAt?: string;
  featured?: boolean;
  demo?: boolean;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const dict = getDictionary(l);
  return pageMeta(l, "/news", dict.nav.news, dict.sections.newsTitle);
}

/**
 * News follows the reference panel: one wide lead story, then a single column
 * of thumbnail rows underneath.
 */
export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const res = await api.news("?limit=24");
  const items = withDemo<Doc>(res?.data as Doc[], demoNews);
  const [lead, ...rest] = items;
  const featuredLabel = locale === "ml" ? "പ്രത്യേക വാർത്ത" : "Featured story";

  const leadDate = lead?.publishedAt ? new Date(lead.publishedAt) : null;
  const leadLabel =
    leadDate && !isNaN(leadDate.getTime())
      ? leadDate.toLocaleDateString(locale === "ml" ? "ml-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })
      : null;

  return (
    <main className="relative">
      <GardenAmbience />
      <Container className="relative py-10 sm:py-14">
        <PageHero
          badge={dict.nav.news}
          badgeTone="teal"
          title={dict.sections.newsTitle}
          tint="from-teal/25 to-cream"
          mascot={<KidWaving className="h-28 w-20" />}
        />

        {items.length ? (
          <div className="section-gap grid gap-4 sm:gap-5">
            {/* Lead story */}
            <Reveal variant="pop">
              <Link
                href={`/${locale}/news/${lead.slug}`}
                className="group grid gap-5 rounded-cardXl bg-white p-4 shadow-playful transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:grid-cols-[minmax(0,18rem)_1fr] sm:p-5"
              >
                <Photo
                  name="news-1"
                  alt={pick(locale, lead.title)}
                  scene="learning"
                  zoom
                  className="aspect-[4/3]"
                  rounded="rounded-cardLg"
                  sizes="(max-width: 640px) 100vw, 18rem"
                />
                <div className="flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="plum">{featuredLabel}</Badge>
                    {lead.demo ? <Badge tone="marigold">{dict.common.demo}</Badge> : null}
                  </div>
                  <h2 className="t-h2 mt-2 group-hover:underline">{pick(locale, lead.title)}</h2>
                  {lead.excerpt ? <p className="t-body mt-2 line-clamp-3">{pick(locale, lead.excerpt)}</p> : null}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    {leadLabel ? <span className="text-xs font-semibold text-cocoa/60">{leadLabel}</span> : <span />}
                    <CircleArrow as="span" label={pick(locale, lead.title)} tone={0} />
                  </div>
                </div>
              </Link>
            </Reveal>

            {rest.map((d, i) => (
              <Reveal key={d.slug} delay={`${(i % 8) * 120}ms`} variant="up">
                <NewsRow locale={locale} doc={d} index={i + 1} demoLabel={dict.common.demo} featuredLabel={featuredLabel} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="block-gap">
            <EmptyState text={dict.common.empty} />
          </div>
        )}
      </Container>
    </main>
  );
}
