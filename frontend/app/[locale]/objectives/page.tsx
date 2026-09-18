import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta } from "@/lib/seo";
import { Card, Container } from "@/components/ui";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { KidReading } from "@/components/Decor";
import { GardenAmbience } from "@/components/GardenAmbience";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const dict = getDictionary(l);
  return pageMeta(l, "/objectives", dict.objectives.title, dict.objectives.intro);
}

/**
 * Objectives: the banner states the aim, then the numbered cards list the ways
 * Malarvadi works towards it.
 */
export default async function ObjectivesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <main className="relative">
      <GardenAmbience />
      <Container className="relative py-10 sm:py-14">
        <PageHero
          badge={dict.nav.objectives}
          badgeTone="teal"
          title={dict.objectives.title}
          sub={dict.objectives.intro}
          tint="from-teal/25 to-cream"
          mascot={<KidReading className="h-28 w-20" />}
        />
        <Reveal variant="up">
          <p className="t-h3 section-gap">{dict.objectives.lead}</p>
        </Reveal>
        <div className="card-grid mt-5 sm:grid-cols-2">
          {dict.objectives.items.map((item: string, i: number) => (
            <Reveal key={i} delay={`${(i % 8) * 120}ms`} variant="bounce" className="h-full">
              <Card className="group flex h-full items-start gap-4">
                <span
                  aria-hidden="true"
                  className="badge-pop flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf/12 font-display text-sm font-bold text-leaf ring-1 ring-leaf/25"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-semibold leading-relaxed">{item}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </main>
  );
}
