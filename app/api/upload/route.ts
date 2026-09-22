import { err, json, requireAdmin } from "@/lib/api";
import { saveUpload } from "@/lib/storage";

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

  const bytes = Buffer.from(await file.arrayBuffer());
  try {
    const url = await saveUpload(bytes, ext, file.type);
    return json({ url }, 201);
  } catch (e) {
    console.error("upload failed", e);
    return err("Could not store the file. Check the storage settings.", 500);
  }
}
