import type { Localized } from "./api";

/**
 * Clearly-marked DEMO fallback content for layout/QA when the API has no data.
 * Never presented as real Malarvadi information - UI shows a "Demo" badge.
 */
export interface DemoDoc {
  slug: string;
  title: Localized;
  summary?: Localized;
  excerpt?: Localized;
  demo: true;
}

export const demoPrograms: DemoDoc[] = [
  { slug: "demo-orumayude-punchiri", title: { en: "Orumayude Punchiri (demo)", ml: "" }, summary: { en: "Sample program card for layout review.", ml: "" }, demo: true },
  { slug: "demo-kalimuttam", title: { en: "Kalimuttam (demo)", ml: "" }, summary: { en: "Arts and creativity gatherings for children.", ml: "" }, demo: true },
  { slug: "demo-rainbow", title: { en: "Rainbow drawing contest (demo)", ml: "" }, summary: { en: "Structured drawing competition held since 2009.", ml: "" }, demo: true },
];

export const demoEvents: (DemoDoc & { district?: string; dateStart?: string })[] = [
  { slug: "demo-green-kerala", title: { en: "Green Kerala Campaign (demo)", ml: "" }, summary: { en: "Sample upcoming event for layout review.", ml: "" }, district: "Demo District", demo: true },
  { slug: "demo-summer-camp", title: { en: "Summer friendship camp (demo)", ml: "" }, summary: { en: "Camps, games and nature activities.", ml: "" }, district: "Demo District", demo: true },
];

export const demoNews: DemoDoc[] = [
  { slug: "demo-welcome", title: { en: "Welcome to the new Malarvadi website (demo)", ml: "" }, excerpt: { en: "Sample news card for layout review.", ml: "" }, demo: true },
  { slug: "demo-little-scholar", title: { en: "Little Scholar quiz season (demo)", ml: "" }, excerpt: { en: "Knowledge program from school level to state level.", ml: "" }, demo: true },
];

export const demoAlbums: DemoDoc[] = [
  { slug: "demo-camp-memories", title: { en: "Camp memories (demo)", ml: "" }, demo: true },
  { slug: "demo-rainbow-day", title: { en: "Rainbow day (demo)", ml: "" }, demo: true },
];

export function withDemo<T extends { slug: string }>(live: T[] | undefined | null, demo: (T & { demo?: true })[] | DemoDoc[]): T[] {
  if (live && live.length > 0) return live;
  return demo as T[];
}
