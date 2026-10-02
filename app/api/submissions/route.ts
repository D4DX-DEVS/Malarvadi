import type { Document, Filter } from "mongodb";
import { getDb } from "@/lib/db";
import { serialize } from "@/lib/queries";
import { err, escapeRegex, getClientIp, json, pageParams, rateLimit, readJson, requireAdmin, revalidateAll } from "@/lib/api";
import { notifySubmission } from "@/lib/mail";
import type { SubmissionKind } from "@/lib/types";

export const dynamic = "force-dynamic";

const KINDS: SubmissionKind[] = ["contact", "join", "newsletter"];
const REQUIRED: Record<SubmissionKind, string[]> = {
  contact: ["name", "phone"],
  join: ["name", "phone"],
  newsletter: ["email"],
};

const SEARCH_KEYS = ["name", "phone", "email", "place", "subject", "message", "district", "unit", "grade"];

/** Admin inbox: ?page=&limit=&kind=&q=&status=unread */
export async function GET(req: Request) {
  const unauth = requireAdmin();
  if (unauth) return unauth;
  const sp = new URL(req.url).searchParams;
  const { page, limit, skip } = pageParams(sp);

  const search: Filter<Document> = {};
  const q = (sp.get("q") || "").trim().slice(0, 100);
  if (q) {
    const rx = { $regex: escapeRegex(q), $options: "i" };
    search.$or = SEARCH_KEYS.map((k) => ({ [`data.${k}`]: rx }));
  }

  const filter: Filter<Document> = { ...search };
  const kind = sp.get("kind");
  if (kind) {
    if (!KINDS.includes(kind as SubmissionKind)) return err("Unknown kind");
    filter.kind = kind;
  }
  if (sp.get("status") === "unread") filter.read = { $ne: true };

  const db = await getDb();
  const col = db.collection("submissions");
  const [docs, total, byKind, unread] = await Promise.all([
    col.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    col.countDocuments(filter),
    col.aggregate<{ _id: string; n: number }>([{ $match: search }, { $group: { _id: "$kind", n: { $sum: 1 } } }]).toArray(),
    col.countDocuments({ read: { $ne: true } }),
  ]);
  const counts: Record<string, number> = { all: 0, contact: 0, join: 0, newsletter: 0, unread };
  for (const row of byKind) {
    counts[row._id] = row.n;
    counts.all += row.n;
  }

  return json({
    items: docs.map((d) => serialize<Record<string, unknown>>(d)!),
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
    counts,
  });
}

/** Mark every submission (optionally of one kind) as read. */
export async function PATCH(req: Request) {
  const unauth = requireAdmin();
  if (unauth) return unauth;
  const body = await readJson(req);
  const filter: Filter<Document> = { read: { $ne: true } };
  if (typeof body?.kind === "string" && body.kind) {
    if (!KINDS.includes(body.kind as SubmissionKind)) return err("Unknown kind");
    filter.kind = body.kind;
  }
  const db = await getDb();
  const res = await db.collection("submissions").updateMany(filter, { $set: { read: true } });
  return json({ ok: true, updated: res.modifiedCount });
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
  const createdAt = new Date();
  await db.collection("submissions").insertOne({ kind, data, createdAt });
  revalidateAll();
  await notifySubmission(kind as SubmissionKind, data, createdAt);
  return json({ ok: true }, 201);
}
