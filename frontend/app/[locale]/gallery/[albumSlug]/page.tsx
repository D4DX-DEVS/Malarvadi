import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { api, pick, type Localized } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Badge, Container } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { Zigzag } from "@/components/Decor";
import { AlbumGrid, type AlbumImage } from "./AlbumGrid";

interface AlbumDoc {
  slug: string;
  title: Localized;
  description?: Localized;
  images?: AlbumImage[];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; albumSlug: string }> }) {
  const { locale, albumSlug } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const res = await api.album(albumSlug);
  const doc = res?.data as AlbumDoc | undefined;
  return pageMeta(l, `/gallery/${albumSlug}`, doc ? pick(l, doc.title) : albumSlug, doc ? pick(l, doc.description) : "");
}

export default async function AlbumDetail({ params }: { params: Promise<{ locale: string; albumSlug: string }> }) {
  const { locale, albumSlug } = await params;
  if (!isValidLocale(locale)) notFound();
  const res = await api.album(albumSlug);
  const doc = res?.data as AlbumDoc | undefined;
  if (!doc) notFound();
  return (
    <main>
      <Container className="py-10 sm:py-14">
        <Reveal variant="up">
          <div>
            <Badge tone="leaf">{locale === "ml" ? "ആൽബം" : "Album"}</Badge>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold sm:text-4xl">{pick(locale, doc.title)}</h1>
            <Zigzag className="mt-2 h-3 w-24 text-leaf" />
            {doc.description ? <p className="mt-2 max-w-3xl text-cocoa/75">{pick(locale, doc.description)}</p> : null}
          </div>
        </Reveal>
        <AlbumGrid images={doc.images ?? []} locale={locale} />
      </Container>
    </main>
  );
}
