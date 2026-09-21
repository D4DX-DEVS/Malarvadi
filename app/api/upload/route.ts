import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { err, json, requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: Request) {
  const unauth = requireAdmin();
  if (unauth) return unauth;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) return err("No file uploaded");

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return err("Unsupported file type. Use JPG, PNG, WEBP, GIF or SVG.");
  if (file.size > MAX_BYTES) return err("File too large (max 8MB)");

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });

  const name = `${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), bytes);

  return json({ url: `/uploads/${name}` }, 201);
}
