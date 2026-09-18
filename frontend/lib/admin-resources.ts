export type FieldType =
  | "slug"
  | "text"
  | "bilingual"
  | "bilingual-text"
  | "select"
  | "date"
  | "image"
  | "boolean"
  | "tags";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
}

export interface ResourceDef {
  resource: string;
  title: string;
  listColumns: { key: string; label: string }[];
  fields: FieldDef[];
  readonly?: boolean;
}

const statusOpts = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

export const RESOURCES: Record<string, ResourceDef> = {
  programs: {
    resource: "programs",
    title: "Programs",
    listColumns: [{ key: "slug", label: "Slug" }, { key: "type", label: "Type" }, { key: "status", label: "Status" }],
    fields: [
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "type", label: "Type", type: "select", options: [
        { value: "general", label: "General" },
        { value: "little_scholar", label: "Little Scholar" },
        { value: "rainbow", label: "Rainbow" },
        { value: "balolsavam", label: "Balolsavam" },
        { value: "other", label: "Other" },
      ]},
      { key: "title", label: "Title (EN | മലയാളം required EN)", type: "bilingual", required: true },
      { key: "summary", label: "Summary", type: "bilingual", required: true },
      { key: "body", label: "Body", type: "bilingual-text", required: true },
      { key: "ageGroup", label: "Age group", type: "text" },
      { key: "coverImage", label: "Cover image URL", type: "image" },
      { key: "status", label: "Status", type: "select", options: statusOpts },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "order", label: "Order", type: "text" },
    ],
  },
  events: {
    resource: "events",
    title: "Events",
    listColumns: [{ key: "slug", label: "Slug" }, { key: "status", label: "Status" }],
    fields: [
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "title", label: "Title (EN | മലയാളം)", type: "bilingual", required: true },
      { key: "description", label: "Description", type: "bilingual-text", required: true },
      { key: "venue", label: "Venue", type: "bilingual", required: true },
      { key: "district", label: "District", type: "text" },
      { key: "dateStart", label: "Start date", type: "date", required: true },
      { key: "timeLabel", label: "Time label", type: "text" },
      { key: "coverImage", label: "Cover image URL", type: "image" },
      { key: "status", label: "Status", type: "select", options: statusOpts },
      { key: "featured", label: "Featured", type: "boolean" },
    ],
  },
  news: {
    resource: "news",
    title: "News",
    listColumns: [{ key: "slug", label: "Slug" }, { key: "status", label: "Status" }],
    fields: [
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "title", label: "Title (EN | മലയാളം)", type: "bilingual", required: true },
      { key: "excerpt", label: "Excerpt", type: "bilingual", required: true },
      { key: "body", label: "Body", type: "bilingual-text", required: true },
      { key: "coverImage", label: "Cover image URL", type: "image" },
      { key: "tags", label: "Tags (comma separated)", type: "tags" },
      { key: "status", label: "Status", type: "select", options: statusOpts },
      { key: "featured", label: "Featured", type: "boolean" },
    ],
  },
  leaders: {
    resource: "leaders",
    title: "Leaders",
    listColumns: [{ key: "group", label: "Group" }],
    fields: [
      { key: "name", label: "Name (EN | മലയാളം)", type: "bilingual", required: true },
      { key: "role", label: "Role (EN | മലയാളം)", type: "bilingual", required: true },
      { key: "group", label: "Group", type: "select", options: [
        { value: "state", label: "State Committee" },
        { value: "district", label: "District" },
        { value: "advisor", label: "Advisors" },
      ]},
      { key: "district", label: "District", type: "text" },
      { key: "photo", label: "Photo URL", type: "image" },
      { key: "bio", label: "Bio", type: "bilingual-text" },
      { key: "order", label: "Order", type: "text" },
      { key: "active", label: "Active", type: "boolean" },
    ],
  },
  gallery: {
    resource: "gallery",
    title: "Gallery albums",
    listColumns: [{ key: "slug", label: "Slug" }, { key: "status", label: "Status" }],
    fields: [
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "title", label: "Title (EN | മലയാളം)", type: "bilingual", required: true },
      { key: "description", label: "Description", type: "bilingual-text" },
      { key: "coverImage", label: "Cover image URL", type: "image" },
      { key: "status", label: "Status", type: "select", options: statusOpts },
    ],
  },
  pages: {
    resource: "pages",
    title: "Pages",
    listColumns: [{ key: "slug", label: "Slug" }, { key: "status", label: "Status" }],
    fields: [
      { key: "slug", label: "Slug (about, objectives, history, …)", type: "text", required: true },
      { key: "title", label: "Title (EN | മലയാളം)", type: "bilingual", required: true },
      { key: "status", label: "Status", type: "select", options: statusOpts },
    ],
  },
  publications: {
    resource: "publications",
    title: "Publications (Phase 2 ready)",
    listColumns: [{ key: "slug", label: "Slug" }, { key: "kind", label: "Kind" }, { key: "status", label: "Status" }],
    fields: [
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "kind", label: "Kind", type: "select", options: [
        { value: "magazine", label: "Magazine" },
        { value: "book", label: "Book" },
        { value: "notice", label: "Notice" },
        { value: "video", label: "Video (YouTube link in fileUrl)" },
        { value: "audio", label: "Audio" },
        { value: "other", label: "Other" },
      ]},
      { key: "title", label: "Title (EN | മലയാളം)", type: "bilingual", required: true },
      { key: "description", label: "Description", type: "bilingual-text" },
      { key: "coverImage", label: "Cover image URL", type: "image" },
      { key: "fileUrl", label: "File URL (CDN / YouTube embed)", type: "text" },
      { key: "issueNo", label: "Issue no.", type: "text" },
      { key: "status", label: "Status", type: "select", options: statusOpts },
    ],
  },
};

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  ...Object.values(RESOURCES).map((r) => ({ href: `/admin/${r.resource}`, label: r.title })),
  { href: "/admin/contact-messages", label: "Messages" },
  { href: "/admin/media", label: "Media Library" },
];
