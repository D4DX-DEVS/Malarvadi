import { z } from "zod";

export const localeSchema = z.enum(["en", "ml"]);

/** Bilingual text foundation: { en, ml } - ml may be empty in draft, fallback to en. */
export const localizedStringSchema = z.object({
  en: z.string().trim().min(1, "English text is required"),
  ml: z.string().trim().default(""),
});

export const localizedOptionalSchema = z.object({
  en: z.string().trim().default(""),
  ml: z.string().trim().default(""),
});

export type Locale = z.infer<typeof localeSchema>;
export type LocalizedString = z.infer<typeof localizedStringSchema>;

export function pickLocale(text: LocalizedString | undefined, locale: Locale): string {
  if (!text) return "";
  if (locale === "ml" && text.ml) return text.ml;
  return text.en;
}

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");

export const statusSchema = z.enum(["draft", "published"]);
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  q: z.string().trim().max(120).default(""),
});

export const PROGRAM_TYPES = [
  "general",
  "little_scholar",
  "rainbow",
  "balolsavam",
  "other",
] as const;
export const programTypeSchema = z.enum(PROGRAM_TYPES);

export const LEADER_GROUPS = ["state", "district", "advisor"] as const;
export const leaderGroupSchema = z.enum(LEADER_GROUPS);

export const PUBLICATION_KINDS = ["magazine", "book", "notice", "video", "audio", "other"] as const;
export const publicationKindSchema = z.enum(PUBLICATION_KINDS);

const baseContentSchema = z.object({
  slug: slugSchema,
  title: localizedStringSchema,
  status: statusSchema.default("draft"),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  coverImage: z.string().trim().max(500).default(""),
});

export const programSchema = baseContentSchema.extend({
  type: programTypeSchema.default("general"),
  summary: localizedStringSchema,
  body: localizedStringSchema,
  ageGroup: z.string().trim().max(60).default(""),
  gallery: z.array(z.string().trim().max(500)).max(30).default([]),
  seoTitle: z.string().trim().max(160).default(""),
  seoDescription: z.string().trim().max(300).default(""),
});
export type ProgramInput = z.infer<typeof programSchema>;

export const eventSchema = baseContentSchema.extend({
  description: localizedStringSchema,
  venue: localizedStringSchema,
  district: z.string().trim().max(80).default(""),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date().optional(),
  timeLabel: z.string().trim().max(80).default(""),
  images: z.array(z.string().trim().max(500)).max(30).default([]),
  programSlug: z.string().trim().max(120).default(""),
});
export type EventInput = z.infer<typeof eventSchema>;

export const newsSchema = baseContentSchema.extend({
  excerpt: localizedStringSchema,
  body: localizedStringSchema,
  tags: z.array(z.string().trim().min(1).max(40)).max(15).default([]),
  publishedAt: z.coerce.date().optional(),
});
export type NewsInput = z.infer<typeof newsSchema>;

export const leaderSchema = z.object({
  name: localizedStringSchema,
  role: localizedStringSchema,
  group: leaderGroupSchema.default("state"),
  district: z.string().trim().max(80).default(""),
  photo: z.string().trim().max(500).default(""),
  bio: localizedOptionalSchema.default({ en: "", ml: "" }),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});
export type LeaderInput = z.infer<typeof leaderSchema>;

export const galleryImageSchema = z.object({
  key: z.string().trim().max(500),
  cdnUrl: z.string().trim().max(800),
  caption: localizedOptionalSchema.default({ en: "", ml: "" }),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const galleryAlbumSchema = z.object({
  slug: slugSchema,
  title: localizedStringSchema,
  description: localizedOptionalSchema.default({ en: "", ml: "" }),
  coverImage: z.string().trim().max(500).default(""),
  images: z.array(galleryImageSchema).max(200).default([]),
  eventSlug: z.string().trim().max(120).default(""),
  takenAt: z.coerce.date().optional(),
  status: statusSchema.default("draft"),
});
export type GalleryAlbumInput = z.infer<typeof galleryAlbumSchema>;

export const pageBlockSchema = z.object({
  type: z.enum(["hero", "text", "stats", "timeline", "faq", "cta", "media"]),
  heading: localizedOptionalSchema.default({ en: "", ml: "" }),
  body: localizedOptionalSchema.default({ en: "", ml: "" }),
  image: z.string().trim().max(500).default(""),
});

export const pageSchema = z.object({
  slug: z.string().trim().min(2).max(80),
  title: localizedStringSchema,
  blocks: z.array(pageBlockSchema).max(30).default([]),
  seoTitle: z.string().trim().max(160).default(""),
  seoDescription: z.string().trim().max(300).default(""),
  status: statusSchema.default("published"),
});
export type PageInput = z.infer<typeof pageSchema>;

export const publicationSchema = z.object({
  slug: slugSchema,
  kind: publicationKindSchema.default("magazine"),
  title: localizedStringSchema,
  description: localizedOptionalSchema.default({ en: "", ml: "" }),
  coverImage: z.string().trim().max(500).default(""),
  fileKey: z.string().trim().max(500).default(""),
  fileUrl: z.string().trim().max(800).default(""),
  issueNo: z.string().trim().max(40).default(""),
  publishedAt: z.coerce.date().optional(),
  status: statusSchema.default("draft"),
});
export type PublicationInput = z.infer<typeof publicationSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(20).default(""),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(5).max(5000),
  locale: localeSchema.default("en"),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const uploadRequestSchema = z.object({
  filename: z.string().trim().min(1).max(160),
  mime: z.string().trim().min(3).max(100),
  size: z.number().int().positive().max(100 * 1024 * 1024),
  folder: z.enum(["events", "news", "gallery", "leaders", "programs", "pages", "publications", "misc"]),
});
export type UploadRequestInput = z.infer<typeof uploadRequestSchema>;
