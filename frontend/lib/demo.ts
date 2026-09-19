import type { Localized } from "./api";

/**
 * Clearly-marked DEMO fallback content for layout/QA when the API has no data.
 * Never presented as real Malarvadi information - UI shows a "Demo" badge and
 * every title carries "(demo)". Both languages are filled so the Malayalam
 * home page reviews as the reference sheet does.
 */
export interface DemoDoc {
  slug: string;
  title: Localized;
  summary?: Localized;
  excerpt?: Localized;
  /** Video running time, "mm:ss". */
  duration?: string;
  publishedAt?: string;
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
  {
    slug: "demo-rainbow-prizes",
    title: {
      en: "Rainbow children's art contest: prizes handed to the winners (demo)",
      ml: "മഴവില്ല് ബാലചിത്ര രചന: വിജയികൾക്ക് സമ്മാനം കൈമാറി (ഡെമോ)",
    },
    excerpt: {
      en: "Thalassery: Prizes for the state-level winners of the Rainbow children's drawing competition, held by Malarvadi Balasangham, were presented at Sargam Auditorium, Thalassery.",
      ml: "തലശ്ശേരി: മലർവാടി ബാലസംഘം നടത്തിയ മഴവില്ല് ബാലചിത്ര രചന മത്സരത്തിന്റെ സംസ്ഥാനതല വിജയികൾക്കുള്ള സമ്മാനദാനം തലശ്ശേരി സർഗ്ഗ ഓഡിറ്റോറിയത്തിൽ നടന്നു.",
    },
    publishedAt: "2025-06-20",
    demo: true,
  },
  {
    slug: "demo-little-scholar",
    title: {
      en: "Little Scholar 2025: district rounds begin (demo)",
      ml: "ലിറ്റിൽ സ്കോളർ 2025: ജില്ലാതല മത്സരങ്ങൾ ആരംഭിച്ചു (ഡെമോ)",
    },
    excerpt: {
      en: "The knowledge festival moves from school level to district level this month, with quiz rounds in every district of Kerala.",
      ml: "വിജ്ഞാനോത്സവം ഈ മാസം സ്കൂൾ തലത്തിൽ നിന്ന് ജില്ലാ തലത്തിലേക്ക്; കേരളത്തിലെ എല്ലാ ജില്ലകളിലും ക്വിസ് മത്സരങ്ങൾ.",
    },
    publishedAt: "2025-06-12",
    demo: true,
  },
];

export const demoAlbums: DemoDoc[] = [
  { slug: "demo-camp-memories", title: { en: "Camp memories (demo)", ml: "ക്യാമ്പ് ഓർമ്മകൾ (ഡെമോ)" }, demo: true },
  { slug: "demo-rainbow-day", title: { en: "Rainbow day (demo)", ml: "മഴവില്ല് ദിനം (ഡെമോ)" }, demo: true },
  { slug: "demo-scholar-finals", title: { en: "Little Scholar finals (demo)", ml: "ലിറ്റിൽ സ്കോളർ ഫൈനൽ (ഡെമോ)" }, demo: true },
  { slug: "demo-balolsavam-stage", title: { en: "Balolsavam on stage (demo)", ml: "ബാലോത്സവം വേദിയിൽ (ഡെമോ)" }, demo: true },
  { slug: "demo-tree-planting", title: { en: "Tree planting day (demo)", ml: "വൃക്ഷത്തൈ നടീൽ ദിനം (ഡെമോ)" }, demo: true },
  { slug: "demo-reading-corner", title: { en: "Reading corner (demo)", ml: "വായനക്കൂട്ടം (ഡെമോ)" }, demo: true },
  { slug: "demo-sports-day", title: { en: "Sports day (demo)", ml: "കായിക ദിനം (ഡെമോ)" }, demo: true },
  { slug: "demo-independence-day", title: { en: "Independence Day (demo)", ml: "സ്വാതന്ത്ര്യ ദിനം (ഡെമോ)" }, demo: true },
];

export const demoPosters: DemoDoc[] = [
  { slug: "demo-poster-rainbow", title: { en: "Rainbow 2025 poster (demo)", ml: "മഴവില്ല് 2025 പോസ്റ്റർ (ഡെമോ)" }, demo: true },
  { slug: "demo-poster-freedom-quiz", title: { en: "Freedom quiz for children poster (demo)", ml: "കുട്ടികൾക്കുള്ള ഫ്രീഡം ക്വിസ് പോസ്റ്റർ (ഡെമോ)" }, demo: true },
  { slug: "demo-poster-scholar", title: { en: "Little Scholar 2025 poster (demo)", ml: "ലിറ്റിൽ സ്കോളർ 2025 പോസ്റ്റർ (ഡെമോ)" }, demo: true },
  { slug: "demo-poster-camp", title: { en: "Summer camp poster (demo)", ml: "വേനൽ ക്യാമ്പ് പോസ്റ്റർ (ഡെമോ)" }, demo: true },
  { slug: "demo-poster-balolsavam", title: { en: "Balolsavam poster (demo)", ml: "ബാലോത്സവം പോസ്റ്റർ (ഡെമോ)" }, demo: true },
];

export const demoVideos: DemoDoc[] = [
  { slug: "demo-video-a-day", title: { en: "A day at Malarvadi (demo)", ml: "മലർവാടിയിലെ ഒരു ദിനം (ഡെമോ)" }, duration: "03:45", publishedAt: "2025-06-12", demo: true },
  { slug: "demo-video-rainbow", title: { en: "Rainbow drawing day (demo)", ml: "മഴവില്ല് ചിത്രരചനാ ദിനം (ഡെമോ)" }, duration: "02:10", publishedAt: "2025-05-21", demo: true },
  { slug: "demo-video-camp", title: { en: "Camp highlights (demo)", ml: "ക്യാമ്പ് വിശേഷങ്ങൾ (ഡെമോ)" }, duration: "04:20", publishedAt: "2025-04-15", demo: true },
  { slug: "demo-video-tree", title: { en: "Planting a thousand trees (demo)", ml: "ആയിരം മരങ്ങൾ നടാം (ഡെമോ)" }, duration: "03:05", publishedAt: "2025-06-05", demo: true },
];

export function withDemo<T extends { slug: string }>(live: T[] | undefined | null, demo: (T & { demo?: true })[] | DemoDoc[]): T[] {
  if (live && live.length > 0) return live;
  return demo as T[];
}
