import { Router } from "express";
import { eventSchema, newsSchema, programSchema } from "shared";
import { Event, Leader, News, Program, GalleryAlbum, Page, Publication } from "../models/index.js";
import { leaderSchema, galleryAlbumSchema, pageSchema, publicationSchema } from "shared";
import { adminRouter, publicGetBySlug, publicList } from "../utils/crud.js";

export const programPublic = Router();
programPublic.get("/", publicList(Program, { searchFields: ["title.en", "title.ml"], exactFilters: ["type", "featured"] }));
programPublic.get("/:slug", publicGetBySlug(Program));
export const programAdmin = adminRouter(Program, {
  createSchema: programSchema,
  updateSchema: programSchema.partial(),
  searchFields: ["title.en", "title.ml", "slug"],
  exactFilters: ["type", "status"],
});

export const newsPublic = Router();
newsPublic.get("/", publicList(News, { searchFields: ["title.en", "title.ml", "tags"], exactFilters: ["featured"] }));
newsPublic.get("/:slug", publicGetBySlug(News));
export const newsAdmin = adminRouter(News, {
  createSchema: newsSchema,
  updateSchema: newsSchema.partial(),
  searchFields: ["title.en", "title.ml", "slug"],
  exactFilters: ["status"],
});

export const leaderPublic = Router();
leaderPublic.get("/", async (req, res) => {
  const { Leader: L } = await import("../models/index.js");
  const group = typeof req.query.group === "string" ? req.query.group : "";
  const { dbReady } = await import("../config/db.js");
  if (!dbReady()) {
    res.status(503).json({ error: { code: "DB_NOT_CONFIGURED", message: "Database not configured" } });
    return;
  }
  const filter: Record<string, unknown> = { active: true };
  if (["state", "district", "advisor"].includes(group)) filter.group = group;
  const data = await L.find(filter).sort({ order: 1, createdAt: 1 }).lean();
  res.json({ data });
});
export const leaderAdmin = adminRouter(Leader, {
  createSchema: leaderSchema,
  updateSchema: leaderSchema.partial(),
  searchFields: ["name.en", "name.ml"],
  exactFilters: ["group"],
});

export const galleryPublic = Router();
galleryPublic.get("/", publicList(GalleryAlbum, { searchFields: ["title.en", "title.ml"] }));
galleryPublic.get("/:slug", publicGetBySlug(GalleryAlbum));
export const galleryAdmin = adminRouter(GalleryAlbum, {
  createSchema: galleryAlbumSchema,
  updateSchema: galleryAlbumSchema.partial(),
  searchFields: ["title.en", "title.ml", "slug"],
  exactFilters: ["status"],
});

export const pagePublic = Router();
pagePublic.get("/:slug", async (req, res) => {
  const { dbReady } = await import("../config/db.js");
  if (!dbReady()) {
    res.status(503).json({ error: { code: "DB_NOT_CONFIGURED", message: "Database not configured" } });
    return;
  }
  const doc = await Page.findOne({ slug: req.params.slug, status: "published" }).lean();
  if (!doc) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
    return;
  }
  res.json({ data: doc });
});
export const pageAdmin = adminRouter(Page, {
  createSchema: pageSchema,
  updateSchema: pageSchema.partial(),
  searchFields: ["title.en", "title.ml", "slug"],
  exactFilters: ["status"],
});

export const publicationPublic = Router();
publicationPublic.get("/", publicList(Publication, { searchFields: ["title.en", "title.ml"], exactFilters: ["kind"] }));
publicationPublic.get("/:slug", publicGetBySlug(Publication));
export const publicationAdmin = adminRouter(Publication, {
  createSchema: publicationSchema,
  updateSchema: publicationSchema.partial(),
  searchFields: ["title.en", "title.ml", "slug"],
  exactFilters: ["kind", "status"],
});

export const eventPublic = Router();
eventPublic.get("/", async (req, res) => {
  const { dbReady } = await import("../config/db.js");
  if (!dbReady()) {
    res.status(503).json({ error: { code: "DB_NOT_CONFIGURED", message: "Database not configured" } });
    return;
  }
  const page = Math.max(1, Number(req.query.page ?? 1) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 12) || 12));
  const q = String(req.query.q ?? "").trim();
  const scope = String(req.query.scope ?? "all");
  const district = String(req.query.district ?? "");
  const now = new Date();
  const filter: Record<string, unknown> = { status: "published" };
  if (scope === "upcoming") filter.dateStart = { $gte: now };
  if (scope === "past") filter.dateStart = { $lt: now };
  if (district) filter.district = district;
  if (q) filter.$or = [{ "title.en": { $regex: q, $options: "i" } }, { "title.ml": { $regex: q, $options: "i" } }];
  const sort = scope === "past" ? "-dateStart" : "dateStart";
  const [total, data] = await Promise.all([
    Event.countDocuments(filter),
    Event.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
  ]);
  res.json({ data, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
});
eventPublic.get("/:slug", publicGetBySlug(Event));
export const eventAdmin = adminRouter(Event, {
  createSchema: eventSchema,
  updateSchema: eventSchema.partial(),
  searchFields: ["title.en", "title.ml", "slug"],
  exactFilters: ["status"],
});
