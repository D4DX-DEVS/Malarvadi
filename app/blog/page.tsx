import PostListView from "@/components/pages/PostListView";
import { getBlogPosts, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [settings, posts] = await Promise.all([getSettings(), getBlogPosts()]);
  return <PostListView kind="blog" page={settings.pages.blog} posts={posts} />;
}
