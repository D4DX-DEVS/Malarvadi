// Shared content types. Every collection document gets a string `_id`
// once it leaves the DB layer (see lib/queries.ts → serialize()).

export type Tone = "teal" | "orange" | "purple" | "green" | "pink" | "blue" | "yellow";

export interface BaseDoc {
  _id: string;
  order?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** News / announcements. Shown on home "news" section and /news. */
export interface NewsItem extends BaseDoc {
  title: string;
  slug: string;
  excerpt: string;
  body: string; // plain text, paragraphs separated by blank lines
  image: string;
  tags: string[];
  date: string; // ISO yyyy-mm-dd
}

/** Blog posts. Shown on home "blog" section and /blog. */
export interface BlogPost extends BaseDoc {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image: string;
  tags: string[];
  date: string;
}

/** Programs. Featured ones drive the scrollable home strip rail. */
export interface Program extends BaseDoc {
  title: string;
  slug: string;
  tagline: string; // short english/ml line under the title on the card
  desc: string; // one paragraph for list cards
  body: string; // long text for /programs/[slug]
  meta: string; // e.g. "Class 3–7 • September"
  icon: string; // lucide icon name, see components/icons.tsx
  color: string; // card bg hex e.g. #fff3c4
  image?: string; // programme logo - home rail + detail hero
  photo?: string; // supporting photo on the detail hero
  slogan?: string; // handwritten note, top right of the detail hero
  slogan2?: string; // handwritten note, lower left of the detail hero
  featured: boolean;
}

export type GalleryCategory = "photos" | "events" | "posters";

export interface GalleryItem extends BaseDoc {
  src: string;
  category: GalleryCategory;
  caption?: string;
}

export interface Video extends BaseDoc {
  /** "youtube" | "facebook" | "instagram" - see lib/video.ts */
  platform?: string;
  /** Share URL for the video on that platform. */
  url?: string;
  /** Legacy: bare YouTube id, still honoured when `url` is empty. */
  youtubeId?: string;
  /** Optional cover image. Required in practice for Facebook/Instagram,
   *  which expose no public thumbnail without an API token. */
  thumb?: string;
  title: string;
  meta: string;
  featured?: boolean;
}

export type PosterTone = "dark" | "light" | "gradient";

export interface Poster extends BaseDoc {
  title: string;
  kicker: string; // small label on top
  note: string; // e.g. date / place
  cta?: string; // button label
  ctaHref?: string;
  image?: string; // when set, poster renders this image
  tone: PosterTone;
  icon?: string;
}

export interface Mentor extends BaseDoc {
  name: string;
  role: string;
  photo: string;
  tone: "m-teal" | "m-orange" | "m-purple" | "m-green";
}

export interface TimelineItem extends BaseDoc {
  year: string;
  title: string;
  desc: string;
  icon: string;
}

export interface Faq extends BaseDoc {
  q: string;
  a: string;
}

export interface Feature extends BaseDoc {
  title: string;
  slug?: string; // its own page at /why/<slug>
  desc?: string; // optional line under the title on the marquee card
  body?: string; // rich text for the item's own page
  image?: string;
  icon: string;
  tone: "f-blue" | "f-pink" | "f-mint" | "f-cream" | "f-lav" | "f-peach";
}

/** Monthly program spotlight. Shown on home "monthlyPrograms" section (3 cards)
 *  and its own /monthly-programs archive + detail pages. */
export interface MonthlyProgram extends BaseDoc {
  title: string;
  slug: string;
  desc: string;
  body?: string;
  image: string;
  month: string;
  year: string;
}

/** Calendar entries shown on /programs. */
export interface EventItem extends BaseDoc {
  date: string; // ISO yyyy-mm-dd
  title: string;
  note?: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  tone: "s-blue" | "s-green" | "s-red" | "s-cream";
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  whatsapp: string;
}

export interface ContactInfo {
  orgName: string;
  address: string;
  email: string;
  pincode: string;
}

/** Singleton site settings document (collection `settings`, _id "site"). */
export interface SiteSettings {
  _id: "site";
  siteName: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  hero: { over: string; under: string; badges: string[]; image: string };
  ticker: string[];
  about: { kicker: string; title: string; body: string; badge: string; image: string; chips: string[] };
  stats: Stat[];
  contact: ContactInfo;
  social: SocialLinks;
  app: { eyebrow: string; title: string; highlight: string; body: string; appStore: string; playStore: string; image: string };
  join: { eyebrow: string; title: string; formTitle: string };
  popup: { enabled: boolean; eyebrow: string; title: string; body: string; image: string };
  cta: { kicker: string; title: string; button: string };
  footer: { blurb: string; copyright: string };
  pages: {
    about: {
      kicker: string; title: string; sub: string; story: string[]; blocks?: AboutBlock[];
      sundayNote: string; sundayLine: string; image: string;
      /** About hero: the floating bubble, the handwritten note and the call to action. */
      heroBubble: string; heroNote: string; heroCta: string; heroCtaHref: string;
      /** Short line under the hero title. Blank by default - the long copy
       *  lives in the intro card, not the hero. */
      heroSub: string;
      /** Line under the heading in the blue intro card. */
      introSub: string;
      /** Section link labels, and the "Our Objectives" strap line. */
      objectivesSub: string;
      objectivesLink: string; objectivesLinkHref: string;
      globalLink: string; globalLinkHref: string;
      /** Pins on the world map as "x y" pairs in a 200x104 viewBox. */
      globalMarkers: string;
      /** Figures beside the map. Empty falls back to the site-wide stats. */
      globalStats: Stat[];
      /** Short callouts shown beside the history section, set as the
       *  handwritten note next to the hero copy. */
      historyCards: { note: string }[];
      /** History hero: button label and target, and an optional picture. */
      historyCta: string; historyCtaHref: string; historyImage: string;
    };
    programs: { kicker: string; title: string; sub: string };
    gallery: { kicker: string; title: string; sub: string };
    contact: { kicker: string; title: string; sub: string };
    news: { kicker: string; title: string; sub: string };
    blog: { kicker: string; title: string; sub: string };
    /** State committee page. `title` carries a {highlight} placeholder. */
    leaders: { kicker: string; title: string; highlight: string; sub: string };
  };
}

/** One piece of the long-form About page copy. */
export interface AboutBlock {
  type: "h2" | "h3" | "p" | "ul" | "quote";
  text?: string;
  items?: string[];
  /** Optional short heading per list item, matched by index. Blank entries
   *  simply render no heading, so the slot can be filled in later. */
  titles?: string[];
}

export type HomeSectionKey =
  | "hero" | "programs" | "about" | "stats" | "monthlyPrograms" | "news" | "videos" | "posters"
  | "gallery" | "features" | "app" | "blog" | "join";

/** One row per home section; the page renders them sorted by `order`. */
export interface HomeSection {
  _id: string; // same as key
  key: HomeSectionKey;
  enabled: boolean;
  order: number;
  title: string; // section heading shown to users (some sections ignore it, e.g. hero)
  subtitle: string;
}

export type SubmissionKind = "contact" | "join" | "newsletter";

export interface Submission extends BaseDoc {
  kind: SubmissionKind;
  data: Record<string, string>;
}

/** Everything the home page needs, fetched once on the server. */
export interface HomeData {
  settings: SiteSettings;
  sections: HomeSection[];
  programs: Program[]; // featured only
  monthlyPrograms: MonthlyProgram[];
  news: NewsItem[];
  videos: Video[];
  posters: Poster[];
  gallery: GalleryItem[];
  features: Feature[];
  blog: BlogPost[];
  faqs: Faq[];
}
