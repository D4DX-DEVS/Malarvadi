// Single source of truth for every editable collection: field definitions
// drive both server-side validation (app/api) and the generic admin form.

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "image" | "tags" | "date" | "slug" | "icon" | "color";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
}

export interface CollectionDef {
  key: string; // mongo collection name
  label: string;
  singular: string;
  fields: FieldDef[];
  sortable: boolean; // has `order`
  publishable: boolean; // has `published`
  slugFrom?: string; // field to derive slug from when slug empty
  listTitle: string; // field shown as row title in admin
}

export const ICON_OPTIONS = [
  "Rainbow", "GraduationCap", "PartyPopper", "Sprout", "Microscope", "HeartHandshake", "Palette", "BookOpen", "Heart",
  "UsersRound", "TentTree", "Trophy", "Star", "Sparkles", "Building2", "Camera", "Flower2", "TreePine", "Leaf", "Sun",
  "Baby", "UserRound", "Megaphone", "CalendarDays", "Pencil", "CircleHelp", "Music", "Drama", "Globe", "Bike",
] as const;

const iconOptions = ICON_OPTIONS.map((v) => ({ value: v, label: v }));

const article = (): FieldDef[] => [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "slug", help: "URL id, auto-filled from title if empty" },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "image", label: "Image URL", type: "image", required: true },
  { name: "tags", label: "Tags", type: "tags", help: "comma separated" },
  { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
  { name: "body", label: "Body", type: "textarea", required: true, help: "Blank line = new paragraph" },
];

export const COLLECTIONS: Record<string, CollectionDef> = {
  news: { key: "news", label: "News", singular: "News item", fields: article(), sortable: false, publishable: true, slugFrom: "title", listTitle: "title" },
  blog: { key: "blog", label: "Blog", singular: "Blog post", fields: article(), sortable: false, publishable: true, slugFrom: "title", listTitle: "title" },
  programs: {
    key: "programs", label: "Programs", singular: "Program", sortable: true, publishable: true, slugFrom: "title", listTitle: "title",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "tagline", label: "Tagline", type: "text", required: true, help: "Short line on the home card, e.g. SCHOLARSHIP EXAM • 2025" },
      { name: "meta", label: "Meta", type: "text", required: true, help: "e.g. Class 3–7 • September" },
      { name: "icon", label: "Icon", type: "icon", required: true, options: iconOptions },
      { name: "color", label: "Card colour", type: "color", required: true },
      { name: "image", label: "Image URL", type: "image" },
      { name: "featured", label: "Show on home strip", type: "boolean", help: "First 3 featured (by order) appear on the home page" },
      { name: "desc", label: "Short description", type: "textarea", required: true },
      { name: "body", label: "Full description", type: "textarea", required: true },
    ],
  },
  gallery: {
    key: "gallery", label: "Gallery", singular: "Photo", sortable: true, publishable: true, listTitle: "caption",
    fields: [
      { name: "src", label: "Image URL", type: "image", required: true },
      { name: "category", label: "Category", type: "select", required: true, options: [{ value: "photos", label: "Photos" }, { value: "events", label: "Events" }, { value: "posters", label: "Posters" }] },
      { name: "caption", label: "Caption", type: "text" },
    ],
  },
  videos: {
    key: "videos", label: "Videos", singular: "Video", sortable: true, publishable: true, listTitle: "title",
    fields: [
      { name: "youtubeId", label: "YouTube ID", type: "text", required: true, help: "The part after v= in the URL" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "meta", label: "Meta", type: "text", help: "e.g. YouTube • 02:45" },
      { name: "featured", label: "Featured (large card)", type: "boolean" },
    ],
  },
  posters: {
    key: "posters", label: "Posters", singular: "Poster", sortable: true, publishable: true, listTitle: "title",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "kicker", label: "Kicker", type: "text", required: true },
      { name: "note", label: "Note", type: "text", help: "e.g. September 14 • Online • Free" },
      { name: "cta", label: "Button label", type: "text" },
      { name: "ctaHref", label: "Button link", type: "text" },
      { name: "image", label: "Poster image URL", type: "image", help: "If set, the image is shown instead of the styled card" },
      { name: "tone", label: "Style", type: "select", required: true, options: [{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }, { value: "gradient", label: "Gradient" }] },
      { name: "icon", label: "Icon", type: "icon", options: iconOptions },
    ],
  },
  mentors: {
    key: "mentors", label: "Mentors", singular: "Mentor", sortable: true, publishable: true, listTitle: "name",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "photo", label: "Photo URL", type: "image", required: true },
      { name: "shape", label: "Shape", type: "select", required: true, options: [{ value: "scallop", label: "Scallop" }, { value: "star", label: "Star" }] },
      { name: "tone", label: "Colour", type: "select", required: true, options: [{ value: "m-teal", label: "Teal" }, { value: "m-orange", label: "Orange" }, { value: "m-purple", label: "Purple" }, { value: "m-green", label: "Green" }] },
    ],
  },
  timeline: {
    key: "timeline", label: "Timeline", singular: "Milestone", sortable: true, publishable: true, listTitle: "title",
    fields: [
      { name: "year", label: "Year", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "desc", label: "Description", type: "textarea", required: true },
      { name: "icon", label: "Icon", type: "icon", required: true, options: iconOptions },
    ],
  },
  faqs: {
    key: "faqs", label: "FAQs", singular: "FAQ", sortable: true, publishable: true, listTitle: "q",
    fields: [
      { name: "q", label: "Question", type: "text", required: true },
      { name: "a", label: "Answer", type: "textarea", required: true },
    ],
  },
  features: {
    key: "features", label: "Why Malarvadi", singular: "Feature", sortable: true, publishable: true, listTitle: "title",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "icon", label: "Icon", type: "icon", required: true, options: iconOptions },
      { name: "tone", label: "Colour", type: "select", required: true, options: ["f-blue", "f-pink", "f-mint", "f-cream", "f-lav", "f-peach"].map((v) => ({ value: v, label: v.slice(2) })) },
    ],
  },
  events: {
    key: "events", label: "Calendar", singular: "Event", sortable: true, publishable: true, listTitle: "title",
    fields: [
      { name: "date", label: "Date", type: "date", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "note", label: "Note", type: "text" },
    ],
  },
};

export const COLLECTION_KEYS = Object.keys(COLLECTIONS);

export function slugify(s: string): string {
  const base = s.toLowerCase().trim().replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
  return base || Math.random().toString(36).slice(2, 8);
}

/** Validate + coerce a payload against a collection definition. Returns clean doc or error list. */
export function validateDoc(def: CollectionDef, input: Record<string, unknown>): { doc?: Record<string, unknown>; errors?: string[] } {
  const errors: string[] = [];
  const doc: Record<string, unknown> = {};
  for (const f of def.fields) {
    let v = input[f.name];
    switch (f.type) {
      case "number": v = v === "" || v == null ? undefined : Number(v); if (v != null && Number.isNaN(v)) errors.push(`${f.label} must be a number`); break;
      case "boolean": v = v === true || v === "true" || v === "on" || v === 1; break;
      case "tags": v = Array.isArray(v) ? v.map(String) : typeof v === "string" ? v.split(",").map((s) => s.trim()).filter(Boolean) : []; break;
      case "select": case "icon": if (v != null && v !== "" && f.options && !f.options.some((o) => o.value === v)) errors.push(`${f.label} has an invalid value`); break;
      case "slug": v = typeof v === "string" && v.trim() ? slugify(v) : (def.slugFrom && typeof input[def.slugFrom] === "string" ? slugify(input[def.slugFrom] as string) : ""); break;
      default: v = v == null ? "" : String(v).trim();
    }
    if (f.required && (v === "" || v == null || (Array.isArray(v) && !v.length))) errors.push(`${f.label} is required`);
    doc[f.name] = v;
  }
  if (def.sortable) doc.order = Number(input.order ?? 0) || 0;
  if (def.publishable) doc.published = input.published === undefined ? true : (input.published === true || input.published === "true" || input.published === "on");
  return errors.length ? { errors } : { doc };
}

export const HOME_SECTION_DEFS: { key: string; label: string; title: string; subtitle: string; fixedTitle?: boolean }[] = [
  { key: "hero", label: "Hero banner", title: "", subtitle: "", fixedTitle: true },
  { key: "programs", label: "Program strip", title: "", subtitle: "", fixedTitle: true },
  { key: "about", label: "About", title: "", subtitle: "", fixedTitle: true },
  { key: "stats", label: "Stats", title: "", subtitle: "", fixedTitle: true },
  { key: "news", label: "News", title: "വാർത്തകളും വിശേഷങ്ങളും", subtitle: "മലർവാടിയിലെ പുതിയ വാർത്തകളും വിശേഷങ്ങളും എല്ലാം ഒരിടത്ത്" },
  { key: "videos", label: "Videos", title: "വീഡിയോകൾ", subtitle: "YouTube-ൽ നിന്നുള്ള മലർവാടി വിശേഷങ്ങൾ..." },
  { key: "posters", label: "Posters", title: "പോസ്റ്ററുകൾ", subtitle: "" },
  { key: "gallery", label: "Photo gallery", title: "നമ്മുടെ ചിത്രങ്ങൾ", subtitle: "കളികളും ചിരികളും നിറഞ്ഞ നിമിഷങ്ങൾ..." },
  { key: "features", label: "Why Malarvadi", title: "കളിയിലൂടെ പഠനം, സ്നേഹത്തിലൂടെ വളർച്ച", subtitle: "എന്തുകൊണ്ട് മലർവാടി?" },
  { key: "app", label: "App promo", title: "", subtitle: "", fixedTitle: true },
  { key: "blog", label: "Blog", title: "ബ്ലോഗ്", subtitle: "കുട്ടികൾക്കും മാതാപിതാക്കൾക്കും ഉപകാരപ്രദമായ അറിവുകളും പ്രവർത്തനങ്ങളും" },
  { key: "join", label: "Join form + FAQ", title: "മലർവാടിയിൽ അംഗമാവാം", subtitle: "ചേരാം • Join Us" },
];
