import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { api, pick, type Localized } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Badge, Container } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { Float, Sparkle, Zigzag } from "@/components/Decor";

interface ProgramDoc {
  slug: string;
  title: Localized;
  summary?: Localized;
  body?: Localized;
  ageGroup?: string;
  demo?: boolean;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const res = await api.program(slug);
  const doc = res?.data as ProgramDoc | undefined;
  const title = doc ? pick(l, doc.title) : slug;
  return pageMeta(l, `/programs/${slug}`, title, doc ? pick(l, doc.summary) : "");
}

export default async function ProgramDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const res = await api.program(slug);
  const doc = res?.data as ProgramDoc | undefined;
  if (!doc) notFound();
  return (
    <main>
      <Container className="py-10 sm:py-14">
        <Reveal variant="up">
          <div className="relative">
            <Float className="pointer-events-none absolute -right-2 -top-4 hidden opacity-70 sm:block" animation="animate-twinkle">
              <Sparkle className="h-8 w-8 text-marigold" />
            </Float>
            <Badge tone="leaf">{doc.ageGroup || "Malarvadi"}</Badge>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold sm:text-4xl">{pick(locale, doc.title)}</h1>
            <Zigzag className="mt-2 h-3 w-24 text-leaf" />
            {doc.summary ? <p className="mt-3 max-w-3xl text-cocoa/75">{pick(locale, doc.summary)}</p> : null}
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
