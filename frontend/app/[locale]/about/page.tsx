import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta } from "@/lib/seo";
import { Card, Container } from "@/components/ui";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { Tabs } from "@/components/Tabs";
import { Timeline } from "@/components/Timeline";
import { Float, KidGardener, Leaf, Sprout } from "@/components/Decor";
import { GardenAmbience } from "@/components/GardenAmbience";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const dict = getDictionary(l);
  return pageMeta(l, "/about", dict.about.title, dict.about.body[0]);
}

/**
 * About follows the reference panel: banner, a headline line with a photo,
 * pill tabs over the story and impact content, then the journey rail.
 */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const story = (
    <div className="card-grid lg:grid-cols-2">
      <Reveal variant="left">
        <Card className="relative h-full overflow-hidden">
          <Float className="pointer-events-none absolute -right-2 -top-2 opacity-25" animation="animate-sway-slow">
            <Sprout className="h-16 w-16 text-leaf" />
          </Float>
          <h3 className="t-h3">{dict.about.clubsTitle}</h3>
          <p className="t-body mt-2">{dict.about.clubsBody}</p>
        </Card>
      </Reveal>
      <Reveal variant="right">
        <Card className="relative h-full overflow-hidden bg-marigold/25">
          <Float className="pointer-events-none absolute -right-2 -top-2 opacity-25" animation="animate-sway">
            <Leaf className="h-16 w-16 text-cocoa" />
          </Float>
          <h3 className="t-h3">{dict.about.serviceTitle}</h3>
          <p className="t-body mt-2">{dict.about.serviceBody}</p>
        </Card>
      </Reveal>
    </div>
  );

  /* The journey rail below already walks through the milestone years, so the
     Impact tab drops any card whose headline is one of those years and keeps
     only the facts the rail cannot show (totals, counts, reach). */
  const railYears = new Set(dict.history.events.map((e: { year: string }) => e.year));
  const impactFacts = dict.impact.items.filter((item: { big: string }) => !railYears.has(item.big));

  const impact = (
    <div className="card-grid sm:grid-cols-2 lg:grid-cols-3">
      {impactFacts.map((item: { big: string; title: string; text: string }, i: number) => (
        <Reveal key={i} delay={`${(i % 6) * 120}ms`} variant="bounce" className="h-full">
          <Card className="h-full">
            <p className="t-stat text-berry">{item.big}</p>
            <p className="t-h4 mt-2">{item.title}</p>
            <p className="t-meta mt-1.5">{item.text}</p>
          </Card>
        </Reveal>
      ))}
    </div>
  );

  return (
    <main className="relative">
      <GardenAmbience />
      <Container className="relative py-10 sm:py-14">
        <PageHero
          badge={dict.nav.about}
          badgeTone="leaf"
          title={dict.about.title}
          sub={dict.about.heroLine}
          tint="from-leaf/25 to-cream"
          mascot={<KidGardener className="h-28 w-20" />}
        />

        {/* Photo band. The banner above already carries the page title and the
            "movement of children" line, so this side carries the longer About
            text rather than repeating either of them. */}
        <div className="section-gap grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal variant="left">
            <div className="t-lead max-w-xl space-y-4">
              {dict.about.body.map((para: string, i: number) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>
          <Reveal variant="right">
            <div className="group">
              <Photo
                name="about"
                alt={dict.about.title}
                className="aspect-[4/3] shadow-playful transition-shadow duration-300 group-hover:shadow-lift"
                rounded="rounded-cardXl"
                tone={2}
                zoom
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </Reveal>
        </div>

        <div className="section-gap">
          <Tabs
            label={dict.about.title}
            items={[
              { key: "story", label: dict.about.storyTitle, node: story },
              { key: "impact", label: dict.impact.title, node: impact },
            ]}
          />
        </div>

        <Timeline title={dict.about.journeyTitle} items={dict.history.events} />
      </Container>
    </main>
  );
}
