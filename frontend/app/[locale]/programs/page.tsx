import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { api, type Localized } from "@/lib/api";
import { demoPrograms, withDemo } from "@/lib/demo";
import { pageMeta } from "@/lib/seo";
import { Container, EmptyState, FilterChip } from "@/components/ui";
import { PageHero } from "@/components/PageHero";
import { ProgramCard } from "@/components/ProgramCard";
import { Reveal } from "@/components/Reveal";
import { Crayons, Float, KidGardener } from "@/components/Decor";
import { GardenAmbience } from "@/components/GardenAmbience";

interface Doc {
  slug: string;
  title: Localized;
  summary?: Localized;
  type?: string;
  ageGroup?: string;
  demo?: boolean;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const dict = getDictionary(l);
  return pageMeta(l, "/programs", dict.nav.programs, dict.sections.programsSub);
}

const CATEGORY_INFO: { type: string; en: string; ml: string }[] = [
  { type: "general", en: "Clubs, camps, arts, environment and values", ml: "ക്ലബ്ബുകൾ, ക്യാമ്പുകൾ, കല, പരിസ്ഥിതി, മൂല്യങ്ങൾ" },
  { type: "little_scholar", en: "Knowledge and quiz program, school to state level", ml: "സ്കൂൾ തലം മുതൽ സംസ്ഥാന തലം വരെയുള്ള വിജ്ഞാന പരിപാടി" },
  { type: "rainbow", en: "Structured drawing competition since 2009", ml: "2009 മുതലുള്ള ചിത്രരചനാ മത്സരം" },
  { type: "balolsavam", en: "Summer festival of creativity and friendship", ml: "സർഗാത്മകതയുടെയും സൗഹൃദത്തിന്റെയും വേനൽക്കാല ഉത്സവം" },
];

/**
 * Programs gets a "clubhouse noticeboard" treatment: pill filters styled
 * like sticker tabs, plus a small crayon flourish and staggered pop-in
 * cards so switching categories feels alive.
 */
export default async function ProgramsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const sp = await searchParams;
  const type = sp.type ?? "";
  const res = await api.programs(`?limit=24${type ? `&type=${type}` : ""}`);
  const items = withDemo<Doc>(res?.data as Doc[], type ? [] : demoPrograms);

  /* Cards carry the short category name. The long CATEGORY_INFO sentence
     belongs to the filter chip and the description line under it - stamped on
     every card as a badge it repeated as duplicated copy. */
  const shortTypeLabel = (type: string | undefined) =>
    dict.categories.items.find((c: { type: string }) => c.type === (type ?? "general"))?.label;

  return (
    <main className="relative">
      <GardenAmbience />
      <Container className="relative py-10 sm:py-14">
        <PageHero
          badge={dict.nav.programs}
          badgeTone="leaf"
          title={dict.sections.programsTitle}
          sub={dict.sections.programsSub}
          tint="from-leaf/25 to-cream"
          mascot={<KidGardener className="h-28 w-20" />}
        />
        <div className="section-gap relative flex flex-wrap items-center gap-2">
          <Float className="pointer-events-none absolute -top-7 left-1/2 hidden h-8 w-8 -translate-x-1/2 opacity-70 sm:block" animation="animate-sway">
            <Crayons className="h-full w-full text-plum/70" />
          </Float>
          <FilterChip href={`/${locale}/programs`} active={!type}>
            {dict.common.all}
          </FilterChip>
          {CATEGORY_INFO.map((c) => (
            <FilterChip key={c.type} href={`/${locale}/programs?type=${c.type}`} active={type === c.type}>
              {locale === "ml" ? c.ml : c.en}
            </FilterChip>
          ))}
        </div>
        {type ? (
          <Reveal variant="up">
          <p className="t-meta mt-4 max-w-3xl">
            {locale === "ml"
              ? CATEGORY_INFO.find((c) => c.type === type)?.ml
              : CATEGORY_INFO.find((c) => c.type === type)?.en}
          </p>
          </Reveal>
        ) : null}
        {items.length ? (
          <div className="card-grid block-gap sm:grid-cols-2 lg:grid-cols-3">
            {items.map((d, i) => (
              <Reveal key={`${type}-${d.slug}`} delay={`${(i % 6) * 120}ms`} variant="bounce" className="h-full">
                <ProgramCard
                  locale={locale}
                  doc={d}
                  cta={dict.common.readMore}
                  typeLabel={shortTypeLabel(d.type)}
                  demoLabel={dict.common.demo}
                  index={i}
                />
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
