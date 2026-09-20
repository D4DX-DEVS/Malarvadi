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

/** Programs. `featured` ones (max 3) drive the home strip cards. */
export interface Program extends BaseDoc {
  title: string;
  slug: string;
  tagline: string; // short english/ml line under the title on the card
  desc: string; // one paragraph for list cards
  body: string; // long text for /programs/[slug]
  meta: string; // e.g. "Class 3–7 • September"
  icon: string; // lucide icon name, see components/icons.tsx
  color: string; // card bg hex e.g. #fff3c4
  image?: string;
  featured: boolean;
}

export type GalleryCategory = "photos" | "events" | "posters";

export interface GalleryItem extends BaseDoc {
  src: string;
  category: GalleryCategory;
  caption?: string;
}

export interface Video extends BaseDoc {
  youtubeId: string;
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
  shape: "scallop" | "star";
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
  icon: string;
  tone: "f-blue" | "f-pink" | "f-mint" | "f-cream" | "f-lav" | "f-peach";
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
  tone: "s-blue" | "s-green" | "s-red";
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
  phone: string;
  phoneNote: string;
  whatsapp: string;
  email: string;
  hours: string;
  pincode: string;
}

/** Singleton site settings document (collection `settings`, _id "site"). */
export interface SiteSettings {
  _id: "site";
  siteName: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  hero: { over: string; under: string; badges: string[] };
  ticker: string[];
  about: { kicker: string; title: string; body: string; badge: string; image: string; chips: string[] };
  stats: Stat[];
  contact: ContactInfo;
  social: SocialLinks;
  app: { eyebrow: string; title: string; highlight: string; body: string; appStore: string; playStore: string };
  join: { eyebrow: string; title: string; formTitle: string };
  popup: { enabled: boolean; eyebrow: string; title: string; body: string };
  cta: { kicker: string; title: string; button: string };
  footer: { blurb: string; copyright: string };
  pages: {
    about: { kicker: string; title: string; sub: string; story: string[]; sundayNote: string; sundayLine: string; image: string; mentorsTitle: string; mentorsSub: string };
    programs: { kicker: string; title: string; sub: string };
    gallery: { kicker: string; title: string; sub: string };
    contact: { kicker: string; title: string; sub: string };
    news: { kicker: string; title: string; sub: string };
    blog: { kicker: string; title: string; sub: string };
  };
}

export type HomeSectionKey =
  | "hero" | "programs" | "about" | "stats" | "news" | "videos" | "posters"
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
  news: NewsItem[];
  videos: Video[];
  posters: Poster[];
  gallery: GalleryItem[];
  features: Feature[];
  blog: BlogPost[];
  faqs: Faq[];
}
