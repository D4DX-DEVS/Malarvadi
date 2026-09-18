import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { api, pick, type Localized } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Badge, Container } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { Zigzag } from "@/components/Decor";

interface EventDoc {
  slug: string;
  title: Localized;
  description?: Localized;
  venue?: Localized;
  district?: string;
  dateStart?: string;
  timeLabel?: string;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const res = await api.event(slug);
  const doc = res?.data as EventDoc | undefined;
  return pageMeta(l, `/events/${slug}`, doc ? pick(l, doc.title) : slug, doc ? pick(l, doc.description) : "");
}

export default async function EventDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const res = await api.event(slug);
  const doc = res?.data as EventDoc | undefined;
  if (!doc) notFound();
  return (
    <main>
      <Container className="py-10 sm:py-14">
        <Reveal variant="up">
          <div>
            <Badge tone="marigold">{doc.district || "Malarvadi"}</Badge>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold sm:text-4xl">{pick(locale, doc.title)}</h1>
            <Zigzag className="mt-2 h-3 w-24 text-marigold" />
            <p className="mt-2 text-sm font-semibold text-cocoa/70">
              {[doc.dateStart ? new Date(doc.dateStart).toLocaleDateString() : "", doc.timeLabel, doc.venue ? pick(locale, doc.venue) : ""]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </div>
        </Reveal>
        {doc.description ? (
          <Reveal variant="up" delay="100ms">
            <div className="paper-lines mt-6 max-w-3xl rounded-card bg-white p-6 shadow-playful">
              <p className="whitespace-pre-line text-cocoa/85">{pick(locale, doc.description)}</p>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </main>
  );
}
