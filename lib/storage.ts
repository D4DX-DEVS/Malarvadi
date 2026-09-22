/**
 * Server-only: where uploaded images live.
 *
 * Production stores them in a DigitalOcean Space and serves them from its CDN
 * edge; with no Space configured we fall back to writing public/uploads so a
 * local checkout keeps working with no credentials.
 */
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const trim = (v: string) => v.replace(/^\/+|\/+$/g, "");

const REGION = process.env.DO_SPACES_REGION || "blr1";
const BUCKET = process.env.DO_SPACES_BUCKET || "";
const KEY_ID = process.env.DO_SPACES_KEY || "";
const SECRET = process.env.DO_SPACES_SECRET || "";
const FOLDER = trim(process.env.DO_SPACES_FOLDER || "");
// Origin endpoint (no bucket in the host - the SDK prepends it).
const ENDPOINT = (process.env.DO_SPACES_ENDPOINT || `https://${REGION}.digitaloceanspaces.com`).replace(/\/+$/, "");
// Where browsers read the file from: a custom CDN subdomain when set,
// otherwise the Space's own CDN edge host.
const CDN_BASE = (process.env.DO_SPACES_CDN_URL || "").replace(/\/+$/, "");

/** True when uploads go to the Space instead of public/uploads. */
export const spacesEnabled = Boolean(BUCKET && KEY_ID && SECRET);

let client: S3Client | null = null;
function s3(): S3Client {
  if (!client) {
    client = new S3Client({
      region: REGION,
      endpoint: ENDPOINT,
      forcePathStyle: false,
      credentials: { accessKeyId: KEY_ID, secretAccessKey: SECRET },
    });
  }
  return client;
}

/** Public URL for an object key inside the Space. */
export function spacesUrl(key: string): string {
  const base = CDN_BASE || `https://${BUCKET}.${REGION}.cdn.digitaloceanspaces.com`;
  return `${base}/${trim(key)}`;
}

/** Object key for a file name, honouring SPACES_FOLDER. */
export function spacesKey(name: string): string {
  return FOLDER ? `${FOLDER}/${name}` : name;
}

/** Upload bytes to the Space and return the CDN URL. */
export async function putObject(name: string, body: Buffer, contentType: string): Promise<string> {
  const key = spacesKey(name);
  await s3().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: "public-read",
      // Names are random UUIDs, so a file at a given key never changes.
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return spacesUrl(key);
}

/**
 * Store an uploaded image and return the URL to save on the document:
 * an absolute CDN URL with a Space configured, else a /uploads/... path.
 */
export async function saveUpload(body: Buffer, ext: string, contentType: string): Promise<string> {
  const name = `${randomUUID()}.${ext}`;
  if (spacesEnabled) return putObject(name, body, contentType);
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), body);
  return `/uploads/${name}`;
}
