import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { api, type Localized } from "@/lib/api";
import { demoAlbums, withDemo } from "@/lib/demo";
import { pageMeta } from "@/lib/seo";
import { Container, EmptyState } from "@/components/ui";
import { PageHero } from "@/components/PageHero";
import { GalleryWall } from "@/components/GalleryWall";
import { Float, Butterfly, KidWithKite } from "@/components/Decor";
import { GardenAmbience } from "@/components/GardenAmbience";

interface Doc {
  slug: string;
  title: Localized;
  images?: Array<unknown>;
  demo?: boolean;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const dict = getDictionary(l);
  return pageMeta(l, "/gallery", dict.nav.gallery, dict.sections.galleryTitle);
}

/**
 * Gallery: a banner, then the arranged picture wall. The wall itself lives in
 * GalleryWall so the layout rhythm and hover behaviour stay in one place.
 */
export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const res = await api.gallery("?limit=24");
  const items = withDemo<Doc>(res?.data as Doc[], demoAlbums);

  return (
    <main className="relative">
      <GardenAmbience />
      <Container className="relative py-10 sm:py-14">
        <PageHero
          badge={dict.nav.gallery}
          badgeTone="marigold"
          title={dict.sections.galleryTitle}
          sub={dict.highlights.sub}
          tint="from-blossom/20 to-cream"
          mascot={<KidWithKite className="h-28 w-20" />}
        />

        {items.length ? (
          <div className="section-gap relative">
            <Float className="pointer-events-none absolute -top-4 right-4 hidden h-10 w-14 opacity-70 md:block" animation="animate-drift">
              <Butterfly className="h-full w-full text-plum/50" />
            </Float>
            <GalleryWall
              locale={locale}
              items={items}
              viewLabel={locale === "ml" ? "ആൽബം കാണുക" : "View album"}
              demoLabel={dict.common.demo}
            />
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
