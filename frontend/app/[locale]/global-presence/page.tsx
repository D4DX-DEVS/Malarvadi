import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta } from "@/lib/seo";
import { Card, Container } from "@/components/ui";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { Float, KidWithKite, Bird } from "@/components/Decor";
import { GardenAmbience } from "@/components/GardenAmbience";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const dict = getDictionary(l);
  return pageMeta(l, "/global-presence", dict.globalPresence.title, dict.globalPresence.intro);
}

/**
 * Our Global Presence: the same banner-then-photo-band shape as About, so the
 * three chapters of the About group read as one set.
 */
export default async function GlobalPresencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main className="relative">
      <GardenAmbience />
      <Container className="relative py-10 sm:py-14">
        <PageHero
          badge={dict.nav.globalPresence}
          badgeTone="plum"
          title={dict.globalPresence.title}
          sub={dict.globalPresence.intro}
          tint="from-teal/25 to-cream"
          mascot={<KidWithKite className="h-28 w-20" />}
        />

        <div className="section-gap grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal variant="left">
            <Card className="relative overflow-hidden">
              <Float className="pointer-events-none absolute -right-2 -top-2 opacity-25" animation="animate-drift" duration="18s">
                <Bird className="h-14 w-14 text-teal" />
              </Float>
              <div className="t-body space-y-4">
                {dict.globalPresence.body.map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Card>
          </Reveal>
          <Reveal variant="right">
            <div className="group">
              <Photo
                name="global-presence"
                alt={dict.globalPresence.title}
                className="aspect-[4/3] shadow-playful transition-shadow duration-300 group-hover:shadow-lift"
                rounded="rounded-cardXl"
                tone={1}
                zoom
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
