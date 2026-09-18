import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { api, type Localized } from "@/lib/api";
import { demoEvents, demoNews, withDemo } from "@/lib/demo";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { GrowBand } from "@/components/home/GrowBand";
import { Highlights, type HighlightDoc } from "@/components/home/Highlights";
import { QuoteStrip } from "@/components/home/QuoteStrip";

interface Doc {
  slug: string;
  title: Localized;
  dateStart?: string;
  publishedAt?: string;
  demo?: boolean;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale === "ml" ? "ml" : "en");
  return pageMeta(locale, "/", dict.hero.title, dict.hero.subtitle);
}

/**
 * Home follows the reference layout top to bottom: sunny hero, sand band with
 * the interest icons and the "Together We Grow" facts card, a highlights row,
 * then the closing quote.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const [e, n] = await Promise.all([api.events("?limit=3&scope=upcoming"), api.news("?limit=3")]);
  const events = withDemo<Doc>(e?.data as Doc[], demoEvents);
  const news = withDemo<Doc>(n?.data as Doc[], demoNews);

  /* Highlights mix the freshest events and stories, newest first, capped at 3. */
  const highlights: HighlightDoc[] = [
    ...events.map((d) => ({ ...d, kind: "events" as const })),
    ...news.map((d) => ({ ...d, kind: "news" as const })),
  ].slice(0, 3);

  return (
    <main>
      <Hero
        locale={locale}
        badge={dict.hero.badge}
        line1={dict.hero.line1}
        line2={dict.hero.line2}
        subtitle={dict.hero.subtitle}
        ctaPrimary={dict.hero.ctaPrimary}
        ctaSecondary={dict.hero.ctaSecondary}
        script={dict.hero.script}
        bubble={dict.hero.bubble}
      />

      <GrowBand
        locale={locale}
        categories={dict.categories}
        growTitle={dict.grow.title}
        growSub={dict.grow.sub}
        stats={dict.impact.items}
      />

      <Highlights
        locale={locale}
        title={dict.highlights.title}
        sub={dict.highlights.sub}
        viewAll={dict.common.viewAll}
        items={highlights}
      />

      <QuoteStrip text={dict.quote.text} />
    </main>
  );
}
