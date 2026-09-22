import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WhyDetailView from "@/components/pages/WhyDetailView";
import { getFeature, getFeatures } from "@/lib/queries";
import { htmlToText } from "@/lib/richtext";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getFeature(params.slug);
  if (!item) return { title: "എന്തുകൊണ്ട് മലർവാടി • മലർവാടി" };
  return { title: `${item.title} • മലർവാടി`, description: item.desc || htmlToText(item.body).slice(0, 160) };
}

export default async function WhyDetailPage({ params }: { params: { slug: string } }) {
  const [item, all] = await Promise.all([getFeature(params.slug), getFeatures()]);
  if (!item) notFound();
  const others = all.filter((f) => f.slug && f.slug !== item.slug).slice(0, 3);
  return <WhyDetailView item={item} others={others} />;
}
