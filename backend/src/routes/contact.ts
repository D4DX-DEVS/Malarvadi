import { Router } from "express";
import { z } from "zod";
import { contactSchema } from "shared";
import { ContactMessage } from "../models/index.js";
import { validate } from "../middlewares/validate.js";
import { contactLimiter } from "../middlewares/ratelimit.js";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { dbReady } from "../config/db.js";
import type { Response } from "express";

export const contactPublic = Router();

contactPublic.post("/", contactLimiter, validate(contactSchema), async (req, res: Response) => {
  if (!dbReady()) {
    res.status(503).json({ error: { code: "DB_NOT_CONFIGURED", message: "Database not configured" } });
    return;
  }
  const doc = await ContactMessage.create(req.body);
  res.status(201).json({ data: { id: String(doc._id), received: true } });
});

export const contactAdmin = Router();
contactAdmin.use(requireAuth);

contactAdmin.get("/", async (req: AuthRequest, res: Response) => {
  if (!dbReady()) {
    res.status(503).json({ error: { code: "DB_NOT_CONFIGURED", message: "Database not configured" } });
    return;
  }
  const page = Math.max(1, Number(req.query.page ?? 1) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20) || 20));
  const status = String(req.query.status ?? "");
  const filter: Record<string, unknown> = {};
  if (["new", "read", "replied", "spam"].includes(status)) filter.status = status;
  const [total, data] = await Promise.all([
    ContactMessage.countDocuments(filter),
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
  ]);
  res.json({ data, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
});

contactAdmin.patch(
  "/:id",
  validate(z.object({ status: z.enum(["new", "read", "replied", "spam"]) })),
  async (req: AuthRequest, res: Response) => {
    if (!dbReady()) {
      res.status(503).json({ error: { code: "DB_NOT_CONFIGURED", message: "Database not configured" } });
      return;
    }
    const doc = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!doc) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
      return;
    }
    res.json({ data: doc });
  }
);
