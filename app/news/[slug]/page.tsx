import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/pages/ArticleView";
import { getNews, getNewsItem } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getNewsItem(params.slug);
  if (!item) return { title: "വാർത്ത • മലർവാടി" };
  return { title: `${item.title} • മലർവാടി`, description: item.excerpt };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const [item, all] = await Promise.all([getNewsItem(params.slug), getNews()]);
  if (!item) notFound();
  const others = all.filter((n) => n.slug !== item.slug).slice(0, 3);
  return <ArticleView kind="news" post={item} others={others} />;
}
