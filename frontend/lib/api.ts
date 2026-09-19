// Server-side only: React Server Components fetch the Express API directly, so
// this needs an absolute origin. Browser code uses relative /api/v1/* paths
// instead, which next.config.ts rewrites to the same API.
const API = process.env.API_ORIGIN ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export interface ApiList<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; pages: number };
}

export interface Localized {
  en: string;
  ml: string;
}

export function pick(locale: string, text: Localized | undefined): string {
  if (!text) return "";
  if (locale === "ml" && text.ml) return text.ml;
  return text.en;
}

async function get<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { ...init, next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const api = {
  programs: (params = "") =>
    get<ApiList<unknown>>(`/api/v1/programs${params}`),
  program: (slug: string) => get<{ data: unknown }>(`/api/v1/programs/${slug}`),
  events: (params = "") => get<ApiList<unknown>>(`/api/v1/events${params}`),
  event: (slug: string) => get<{ data: unknown }>(`/api/v1/events/${slug}`),
  news: (params = "") => get<ApiList<unknown>>(`/api/v1/news${params}`),
  newsOne: (slug: string) => get<{ data: unknown }>(`/api/v1/news/${slug}`),
  leaders: (group = "") => get<{ data: unknown[] }>(`/api/v1/leaders${group ? `?group=${group}` : ""}`),
  gallery: (params = "") => get<ApiList<unknown>>(`/api/v1/gallery${params}`),
  album: (slug: string) => get<{ data: unknown }>(`/api/v1/gallery/${slug}`),
  page: (slug: string) => get<{ data: unknown }>(`/api/v1/pages/${slug}`),
  /** Posters, magazines and videos all live in the publications collection,
      separated by `kind` - the home page pulls `notice` and `video` from it. */
  publications: (params = "") => get<ApiList<unknown>>(`/api/v1/publications${params}`),
};
