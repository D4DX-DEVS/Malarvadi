import { Router, type Request, type Response } from "express";
import type { Model } from "mongoose";
import type { ZodSchema } from "zod";
import { validate } from "../middlewares/validate.js";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { dbReady } from "../config/db.js";

// Mongoose models are created without TS interfaces in this phase;
// treat documents generically to avoid over-constraining shared CRUD.
type AnyModel = Model<Record<string, unknown>>;

function needDb(res: Response): boolean {
  if (!dbReady()) {
    res.status(503).json({ error: { code: "DB_NOT_CONFIGURED", message: "Database not configured" } });
    return true;
  }
  return false;
}

interface CrudOptions {
  createSchema: ZodSchema;
  updateSchema: ZodSchema;
  /** dot-paths searched with q, e.g. ["title.en", "title.ml"] */
  searchFields?: string[];
  /** query param -> mongoose path passthrough */
  exactFilters?: string[];
}

export function publicList(model: AnyModel, opts: { searchFields?: string[]; exactFilters?: string[] } = {}) {
  return async (req: Request, res: Response) => {
    if (needDb(res)) return;
    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 12) || 12));
    const q = String(req.query.q ?? "").trim();
    const filter: Record<string, unknown> = { status: "published" };
    for (const key of opts.exactFilters ?? []) {
      const v = req.query[key];
      if (typeof v === "string" && v) filter[key] = v;
    }
    if (q && opts.searchFields?.length) {
      filter.$or = opts.searchFields.map((f) => ({ [f]: { $regex: q, $options: "i" } }));
    }
    const [total, data] = await Promise.all([
      model.countDocuments(filter),
      model
        .find(filter)
        .sort({ featured: -1, order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);
    res.json({ data, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
  };
}

export function publicGetBySlug(model: AnyModel) {
  return async (req: Request, res: Response) => {
    if (needDb(res)) return;
    const doc = await model.findOne({ slug: req.params.slug, status: "published" }).lean();
    if (!doc) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
      return;
    }
    res.json({ data: doc });
  };
}

export function adminRouter(model: AnyModel, opts: CrudOptions): Router {
  const r = Router();
  r.use(requireAuth);

  r.get("/", async (req: AuthRequest, res: Response) => {
    if (needDb(res)) return;
    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20) || 20));
    const q = String(req.query.q ?? "").trim();
    const filter: Record<string, unknown> = {};
    const status = req.query.status;
    if (status === "draft" || status === "published") filter.status = status;
    for (const key of opts.exactFilters ?? []) {
      const v = req.query[key];
      if (typeof v === "string" && v) filter[key] = v;
    }
    if (q && opts.searchFields?.length) {
      filter.$or = opts.searchFields.map((f) => ({ [f]: { $regex: q, $options: "i" } }));
    }
    const [total, data] = await Promise.all([
      model.countDocuments(filter),
      model
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);
    res.json({ data, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
  });

  r.post("/", validate(opts.createSchema), async (req: AuthRequest, res: Response) => {
    if (needDb(res)) return;
    try {
      const doc = await model.create(req.body);
      res.status(201).json({ data: doc });
    } catch (e: unknown) {
      if ((e as { code?: number }).code === 11000) {
        res.status(409).json({ error: { code: "SLUG_EXISTS", message: "Slug already exists" } });
        return;
      }
      throw e;
    }
  });

  r.get("/:id", async (req: AuthRequest, res: Response) => {
    if (needDb(res)) return;
    const doc = await model.findById(req.params.id).lean();
    if (!doc) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
      return;
    }
    res.json({ data: doc });
  });

  r.patch("/:id", validate(opts.updateSchema), async (req: AuthRequest, res: Response) => {
    if (needDb(res)) return;
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
      return;
    }
    res.json({ data: doc });
  });

  r.delete("/:id", async (req: AuthRequest, res: Response) => {
    if (needDb(res)) return;
    const doc = await model.findByIdAndDelete(req.params.id);
    if (!doc) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
      return;
    }
    res.json({ data: { deleted: true } });
  });

  return r;
}
