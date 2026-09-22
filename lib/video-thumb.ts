/**
 * Server-only: give a video a durable cover image of our own.
 *
 * Facebook and Instagram expose a thumbnail through og:image, but those URLs
 * are signed and expire, so we copy the bytes into our own storage (the same
 * place the admin uploader writes to) and store that URL instead.
 */
import { fetchOgImage, videoThumbnail, type EmbeddableVideo } from "./video";
import { saveUpload } from "./storage";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 8 * 1024 * 1024;

/** Download `src` into our storage and return its public URL, or null. */
async function saveRemoteImage(src: string, timeoutMs = 12000): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(src, { signal: ctrl.signal, headers: { "user-agent": "facebookexternalhit/1.1" } });
    clearTimeout(timer);
    if (!res.ok) return null;
    const type = (res.headers.get("content-type") || "").split(";")[0]!.trim();
    const ext = EXT_BY_TYPE[type];
    if (!ext) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.length || buf.length > MAX_BYTES) return null;
    return saveUpload(buf, ext, type);
  } catch {
    return null;
  }
}

/**
 * Fill in `thumb` when the platform gives us no usable poster image.
 * Best effort: any failure leaves the doc untouched.
 */
export async function ensureVideoThumb(doc: EmbeddableVideo & Record<string, unknown>): Promise<void> {
  if (doc.thumb) return;                 // admin uploaded one - respect it
  if (videoThumbnail(doc)) return;       // YouTube already has a free thumbnail
  const url = typeof doc.url === "string" ? doc.url : "";
  if (!url) return;
  const og = await fetchOgImage(url);
  if (!og) return;
  const stored = await saveRemoteImage(og);
  if (stored) doc.thumb = stored;
}
