import { Router } from "express";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { uploadRequestSchema } from "shared";
import { env, spacesConfigured } from "../config/env.js";
import { validate } from "../middlewares/validate.js";
import { uploadLimiter } from "../middlewares/ratelimit.js";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { MediaAsset } from "../models/index.js";
import { dbReady } from "../config/db.js";
import type { Response } from "express";

const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"];
const DOC_MIMES = ["application/pdf", ...IMAGE_MIMES];

function spaces(): S3Client {
  return new S3Client({
    endpoint: env.spacesEndpoint,
    region: env.spacesRegion || "blr1",
    credentials: { accessKeyId: env.spacesKey, secretAccessKey: env.spacesSecret },
    forcePathStyle: false,
  });
}

function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9.\-]+/g, "-").replace(/-+/g, "-").slice(0, 120);
}

export const uploadRouter = Router();
uploadRouter.use(requireAuth, uploadLimiter);

uploadRouter.post("/request-url", validate(uploadRequestSchema), async (req: AuthRequest, res: Response) => {
  const { filename, mime, size, folder } = req.body as z.infer<typeof uploadRequestSchema>;
  const allowed = folder === "publications" ? DOC_MIMES : IMAGE_MIMES;
  if (!allowed.includes(mime)) {
    res.status(400).json({ error: { code: "BAD_MIME", message: `Allowed types: ${allowed.join(", ")}` } });
    return;
  }
  const max = folder === "publications" ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
  if (size > max) {
    res.status(400).json({ error: { code: "FILE_TOO_LARGE", message: `Max size is ${max / 1024 / 1024}MB` } });
    return;
  }
  if (!spacesConfigured()) {
    res.status(501).json({
      error: { code: "SPACES_NOT_CONFIGURED", message: "Media storage is not configured yet" },
    });
    return;
  }
  const now = new Date();
  const key = `${folder}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${randomUUID()}-${sanitizeFilename(filename)}`;
  const url = await getSignedUrl(
    spaces(),
    new PutObjectCommand({ Bucket: env.spacesBucket, Key: key, ContentType: mime, ContentLength: size }),
    { expiresIn: 900 }
  );
  const cdnUrl = env.cdnBaseUrl ? `${env.cdnBaseUrl.replace(/\/$/, "")}/${key}` : "";
  res.json({ data: { key, uploadUrl: url, cdnUrl } });
});

uploadRouter.post(
  "/complete",
  validate(z.object({ key: z.string().min(1).max(500), mime: z.string().min(3).max(100), size: z.number().int().positive(), altEn: z.string().max(200).default(""), tags: z.array(z.string().max(40)).max(10).default([]) })),
  async (req: AuthRequest, res: Response) => {
    if (!dbReady()) {
      res.status(503).json({ error: { code: "DB_NOT_CONFIGURED", message: "Database not configured" } });
      return;
    }
    const { key, mime, size, altEn, tags } = req.body as { key: string; mime: string; size: number; altEn: string; tags: string[] };
    const cdnUrl = env.cdnBaseUrl ? `${env.cdnBaseUrl.replace(/\/$/, "")}/${key}` : "";
    const doc = await MediaAsset.create({
      key,
      cdnUrl,
      mime,
      size,
      alt: { en: altEn, ml: "" },
      tags,
      uploadedBy: req.admin!.email,
    });
    res.status(201).json({ data: doc });
  }
);

export const mediaAdmin = Router();
mediaAdmin.use(requireAuth);
mediaAdmin.get("/", async (req: AuthRequest, res: Response) => {
  if (!dbReady()) {
    res.status(503).json({ error: { code: "DB_NOT_CONFIGURED", message: "Database not configured" } });
    return;
  }
  const page = Math.max(1, Number(req.query.page ?? 1) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 24) || 24));
  const q = String(req.query.q ?? "").trim();
  const filter: Record<string, unknown> = {};
  if (q) filter.$or = [{ key: { $regex: q, $options: "i" } }, { "alt.en": { $regex: q, $options: "i" } }];
  const [total, data] = await Promise.all([
    MediaAsset.countDocuments(filter),
    MediaAsset.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
  ]);
  res.json({ data, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
});
