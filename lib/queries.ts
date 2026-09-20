// Server-only read helpers. Pages call these directly (no HTTP hop);
// the /api routes exist for admin writes and external consumers.
import { ObjectId, type Document, type Filter } from "mongodb";
import { getDb } from "./db";
import { COLLECTIONS, HOME_SECTION_DEFS } from "./content-registry";
import { DEFAULT_SETTINGS } from "./defaults";
import type {
  BlogPost, EventItem, Faq, Feature, GalleryItem, HomeData, HomeSection, Mentor, NewsItem, Poster, Program,
  SiteSettings, TimelineItem, Video,
} from "./types";

export function serialize<T>(doc: Document | null): T | null {
  if (!doc) return null;
  const out: Record<string, unknown> = { ...doc };
  if (doc._id instanceof ObjectId) out._id = doc._id.toHexString();
  for (const k of ["createdAt", "updatedAt"]) if (out[k] instanceof Date) out[k] = (out[k] as Date).toISOString();
  return out as T;
}

export async function listDocs<T>(collection: string, opts: { limit?: number; filter?: Filter<Document>; includeUnpublished?: boolean; sort?: Document } = {}): Promise<T[]> {
  const def = COLLECTIONS[collection];
  if (!def) throw new Error(`Unknown collection ${collection}`);
  const db = await getDb();
  const filter: Filter<Document> = { ...(opts.filter || {}) };
  if (def.publishable && !opts.includeUnpublished) filter.published = { $ne: false };
  const sort: Document = opts.sort || (def.sortable ? { order: 1, createdAt: 1 } : { date: -1, createdAt: -1 });
  let cursor = db.collection(collection).find(filter).sort(sort);
  if (opts.limit) cursor = cursor.limit(opts.limit);
  const docs = await cursor.toArray();
  return docs.map((d) => serialize<T>(d)!) ;
}

export async function getDocBySlug<T>(collection: string, slug: string): Promise<T | null> {
  const db = await getDb();
  return serialize<T>(await db.collection(collection).findOne({ slug, published: { $ne: false } }));
}

export async function getDocById<T>(collection: string, id: string): Promise<T | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  return serialize<T>(await db.collection(collection).findOne({ _id: new ObjectId(id) }));
}

/** Deep-merge stored settings over defaults so new fields never come back undefined. */
function mergeDeep<T>(base: T, over: unknown): T {
  if (Array.isArray(base) || Array.isArray(over)) return (over ?? base) as T;
  if (base && typeof base === "object" && over && typeof over === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(over as Record<string, unknown>)) out[k] = mergeDeep((base as Record<string, unknown>)[k], v);
    return out as T;
  }
  return (over === undefined ? base : over) as T;
}

export async function getSettings(): Promise<SiteSettings> {
  const db = await getDb();
  const stored = await db.collection("settings").findOne({ _id: "site" as unknown as ObjectId });
  const over: Record<string, unknown> = stored ? { ...stored, _id: "site" } : {};
  delete over.createdAt; delete over.updatedAt;
  return mergeDeep(DEFAULT_SETTINGS, over);
}

export async function getHomeSections(): Promise<HomeSection[]> {
  const db = await getDb();
  const stored = await db.collection("homeSections").find({}).toArray();
  const byKey = new Map(stored.map((s) => [String(s._id), s]));
  // Always return every known section so a newly added section still renders (at the end).
  const rows = HOME_SECTION_DEFS.map((d, i) => {
    const s = byKey.get(d.key);
    return {
      _id: d.key, key: d.key, enabled: s ? s.enabled !== false : true, order: s?.order ?? i,
      title: s?.title ?? d.title, subtitle: s?.subtitle ?? d.subtitle,
    } as HomeSection;
  });
  return rows.sort((a, b) => a.order - b.order);
}

export async function getHomeData(): Promise<HomeData> {
  const [settings, sections, programs, news, videos, posters, gallery, features, blog, faqs] = await Promise.all([
    getSettings(),
    getHomeSections(),
    listDocs<Program>("programs", { filter: { featured: true }, limit: 3 }),
    listDocs<NewsItem>("news", { limit: 3 }),
    listDocs<Video>("videos", { limit: 3 }),
    listDocs<Poster>("posters", { limit: 3 }),
    listDocs<GalleryItem>("gallery", { limit: 8 }),
    listDocs<Feature>("features"),
    listDocs<BlogPost>("blog", { limit: 3 }),
    listDocs<Faq>("faqs"),
  ]);
  return { settings, sections, programs, news, videos, posters, gallery, features, blog, faqs };
}

export const getPrograms = () => listDocs<Program>("programs");
export const getProgram = (slug: string) => getDocBySlug<Program>("programs", slug);
export const getNews = (limit?: number) => listDocs<NewsItem>("news", { limit });
export const getNewsItem = (slug: string) => getDocBySlug<NewsItem>("news", slug);
export const getBlogPosts = (limit?: number) => listDocs<BlogPost>("blog", { limit });
export const getBlogPost = (slug: string) => getDocBySlug<BlogPost>("blog", slug);
export const getGallery = () => listDocs<GalleryItem>("gallery");
export const getVideos = () => listDocs<Video>("videos");
export const getPosters = () => listDocs<Poster>("posters");
export const getMentors = () => listDocs<Mentor>("mentors");
export const getTimeline = () => listDocs<TimelineItem>("timeline");
export const getEvents = () => listDocs<EventItem>("events", { sort: { date: 1 } });
export const getFaqs = () => listDocs<Faq>("faqs");
