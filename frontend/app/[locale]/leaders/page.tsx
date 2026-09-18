import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { api, pick, type Localized } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Container, EmptyState, FilterChip } from "@/components/ui";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { photoSrc } from "@/lib/photos";
import { ScenePortrait } from "@/components/Illustrations";
import { KidsGroup, Star } from "@/components/Decor";
import Image from "next/image";
import { GardenAmbience } from "@/components/GardenAmbience";

interface LeaderDoc {
  name: Localized;
  role: Localized;
  group: string;
  district?: string;
  bio?: Localized;
}

const GROUPS = ["state", "district", "advisor"] as const;

const GROUP_LABELS: Record<string, { en: string; ml: string }> = {
  state: { en: "State Committee", ml: "സംസ്ഥാന കമ്മിറ്റി" },
  district: { en: "District Leaders", ml: "ജില്ലാ നേതാക്കൾ" },
  advisor: { en: "Advisors", ml: "ഉപദേശകർ" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const dict = getDictionary(l);
  return pageMeta(l, "/leaders", dict.sections.leadersTitle, dict.sections.leadersSub);
}

/**
 * Leaders follows the reference panel: group tabs over a row of portrait
 * cards, each with the child's name, role and a quiet star medal.
 */
export default async function LeadersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ group?: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const sp = await searchParams;
  const group = sp.group ?? "state";
  const res = await api.leaders(group);
  const items = (res?.data as LeaderDoc[] | undefined) ?? [];

  return (
    <main className="relative">
      <GardenAmbience />
      <Container className="relative py-10 sm:py-14">
        <PageHero
          badge={dict.nav.leaders}
          badgeTone="plum"
          title={dict.sections.leadersTitle}
          sub={dict.sections.leadersSub}
          tint="from-plum/20 to-cream"
          mascot={<KidsGroup className="h-16 w-40" />}
        />

        <div className="section-gap flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <FilterChip key={g} href={`/${locale}/leaders?group=${g}`} active={group === g}>
              {locale === "ml" ? GROUP_LABELS[g].ml : GROUP_LABELS[g].en}
            </FilterChip>
          ))}
        </div>

        {items.length ? (
          <div className="card-grid block-gap sm:grid-cols-2 lg:grid-cols-4">
            {items.map((d, i) => {
              const src = photoSrc(`leader-${i + 1}`);
              return (
                <Reveal key={i} delay={`${(i % 8) * 120}ms`} variant="bounce" className="h-full">
                  <div className="pop group relative flex h-full flex-col items-center rounded-cardXl bg-white p-5 text-center shadow-playful hover:shadow-soft">
                    <Star className="badge-pop absolute right-4 top-4 h-4 w-4 text-marigold" />
                    <div className="zoom-frame relative h-28 w-28 rounded-full ring-4 ring-cream transition-shadow duration-300 group-hover:ring-leaf/20">
                      {src ? (
                        <Image src={src} alt={pick(locale, d.name)} fill sizes="112px" className="zoom-target object-cover" />
                      ) : (
                        <ScenePortrait index={i} className="zoom-target h-full w-full" />
                      )}
                    </div>
                    <h2 className="t-h4 mt-4">{pick(locale, d.name)}</h2>
                    <p className="mt-1 text-sm font-semibold text-berry">{pick(locale, d.role)}</p>
                    {d.district ? <p className="mt-1 text-xs text-cocoa/60">{d.district}</p> : null}
                    {d.bio ? <p className="t-meta mt-2 line-clamp-3">{pick(locale, d.bio)}</p> : null}
                  </div>
                </Reveal>
              );
            })}
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
