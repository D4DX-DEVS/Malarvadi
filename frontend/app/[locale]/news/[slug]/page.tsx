import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { api, pick, type Localized } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Badge, Container } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { Zigzag } from "@/components/Decor";

interface NewsDoc {
  slug: string;
  title: Localized;
  excerpt?: Localized;
  body?: Localized;
  publishedAt?: string;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const res = await api.newsOne(slug);
  const doc = res?.data as NewsDoc | undefined;
  return pageMeta(l, `/news/${slug}`, doc ? pick(l, doc.title) : slug, doc ? pick(l, doc.excerpt) : "");
}

export default async function NewsDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const res = await api.newsOne(slug);
  const doc = res?.data as NewsDoc | undefined;
  if (!doc) notFound();
  return (
    <main>
      <Container className="py-10 sm:py-14">
        <Reveal variant="up">
          <div>
            <Badge tone="teal">{doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString() : "Malarvadi"}</Badge>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold sm:text-4xl">{pick(locale, doc.title)}</h1>
            <Zigzag className="mt-2 h-3 w-24 text-teal" />
            {doc.excerpt ? <p className="mt-3 max-w-3xl font-semibold text-cocoa/75">{pick(locale, doc.excerpt)}</p> : null}
          </div>
        </Reveal>
        {doc.body ? (
          <Reveal variant="up" delay="100ms">
            <div className="paper-lines mt-6 max-w-3xl rounded-card bg-white p-6 shadow-playful">
              <p className="whitespace-pre-line text-cocoa/85">{pick(locale, doc.body)}</p>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </main>
  );
}
