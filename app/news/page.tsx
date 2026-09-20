import PostListView from "@/components/pages/PostListView";
import { getNews, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const [settings, news] = await Promise.all([getSettings(), getNews()]);
  return <PostListView kind="news" page={settings.pages.news} posts={news} />;
}
