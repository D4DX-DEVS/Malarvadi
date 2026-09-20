import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/pages/ArticleView";
import { getBlogPost, getBlogPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getBlogPost(params.slug);
  if (!item) return { title: "ബ്ലോഗ് • മലർവാടി" };
  return { title: `${item.title} • മലർവാടി`, description: item.excerpt };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [item, all] = await Promise.all([getBlogPost(params.slug), getBlogPosts()]);
  if (!item) notFound();
  const others = all.filter((b) => b.slug !== item.slug).slice(0, 3);
  return <ArticleView kind="blog" post={item} others={others} />;
}
