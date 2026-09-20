import SearchView from "@/components/pages/SearchView";
import { getBlogPosts, getNews, getPrograms } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Case-insensitive substring match over title / excerpt|desc / tags. */
function matches(q: string, fields: (string | undefined)[], tags: string[] = []) {
  const hay = [...fields, ...tags].filter(Boolean).join(" ").toLowerCase();
  return hay.includes(q);
}

export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (searchParams?.q || "").trim();
  const needle = q.toLowerCase();
  const [news, blog, programs] = await Promise.all([getNews(), getBlogPosts(), getPrograms()]);
  const results = q
    ? {
        news: news.filter((n) => matches(needle, [n.title, n.excerpt], n.tags)),
        blog: blog.filter((b) => matches(needle, [b.title, b.excerpt], b.tags)),
        programs: programs.filter((p) => matches(needle, [p.title, p.desc, p.tagline])),
      }
    : { news: [], blog: [], programs: [] };
  return <SearchView q={q} results={results} />;
}
