import { getDb } from "@/lib/db";
import { serialize } from "@/lib/queries";
import { err, getClientIp, json, rateLimit, readJson, requireAdmin, revalidateAll } from "@/lib/api";
import type { SubmissionKind } from "@/lib/types";

export const dynamic = "force-dynamic";

const KINDS: SubmissionKind[] = ["contact", "join", "newsletter"];
const REQUIRED: Record<SubmissionKind, string[]> = {
  contact: ["name", "phone"],
  join: ["name", "phone"],
  newsletter: ["email"],
};

export async function GET(req: Request) {
  const unauth = requireAdmin();
  if (unauth) return unauth;
  const kind = new URL(req.url).searchParams.get("kind");
  const filter: Record<string, unknown> = {};
  if (kind) {
    if (!KINDS.includes(kind as SubmissionKind)) return err("Unknown kind");
    filter.kind = kind;
  }
  const db = await getDb();
  const docs = await db.collection("submissions").find(filter).sort({ createdAt: -1 }).toArray();
  return json({ items: docs.map((d) => serialize<Record<string, unknown>>(d)!) });
}

export async function POST(req: Request) {
  if (!rateLimit(`sub:${getClientIp(req)}`)) return err("Too many submissions, please try again later", 429);

  const len = Number(req.headers.get("content-length") || 0);
  if (len > 64 * 1024) return err("Payload too large", 413);

  const body = await readJson(req);
  if (!body) return err("Invalid JSON body");

  const kind = body.kind;
  if (typeof kind !== "string" || !KINDS.includes(kind as SubmissionKind)) return err("Invalid kind");

  const raw = body.data;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return err("data must be an object");

  const entries = Object.entries(raw as Record<string, unknown>);
  if (entries.length > 20) return err("Too many fields");

  const data: Record<string, string> = {};
  for (const [k, v] of entries) {
    if (k.length > 40) return err("Field name too long");
    if (typeof v !== "string") return err(`Field "${k}" must be a string`);
    if (v.length > 2000) return err(`Field "${k}" is too long`);
    data[k] = v.trim();
  }

  for (const field of REQUIRED[kind as SubmissionKind]) {
    if (!data[field]) return err(`${field} is required`);
  }

  const db = await getDb();
  await db.collection("submissions").insertOne({ kind, data, createdAt: new Date() });
  revalidateAll();
  return json({ ok: true }, 201);
}
