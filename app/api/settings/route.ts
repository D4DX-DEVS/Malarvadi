import type { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSettings } from "@/lib/queries";
import { err, json, mergeDeep, readJson, requireAdmin, revalidateAll } from "@/lib/api";
import { DEFAULT_SETTINGS } from "@/lib/defaults";

const DEFAULTS = DEFAULT_SETTINGS as unknown as Record<string, unknown>;
const ALLOWED_TOP = new Set(Object.keys(DEFAULTS).filter((k) => k !== "_id"));

/** Reject keys Mongo would interpret as operators or paths. */
function hasBadKey(v: unknown, depth = 0): boolean {
  if (depth > 12) return true;
  if (Array.isArray(v)) return v.some((x) => hasBadKey(x, depth + 1));
  if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
      if (k.startsWith("$") || k.includes(".") || k === "__proto__") return true;
      if (hasBadKey(x, depth + 1)) return true;
    }
  }
  return false;
}

export const dynamic = "force-dynamic";

const SITE_ID = "site" as unknown as ObjectId;

export async function GET() {
  return json({ settings: await getSettings() });
}

export async function PUT(req: Request) {
  const unauth = requireAdmin();
  if (unauth) return unauth;

  const body = await readJson(req);
  if (!body) return err("Invalid JSON body");

  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) if (ALLOWED_TOP.has(k)) patch[k] = v;
  if (hasBadKey(patch)) return err("Invalid key in settings");
  for (const k of Object.keys(patch)) {
    const want = typeof DEFAULTS[k];
    const got = Array.isArray(patch[k]) ? "array" : typeof patch[k];
    const wantKind = Array.isArray(DEFAULTS[k]) ? "array" : want;
    if (got !== wantKind) return err(`Field ${k} must be ${wantKind}`);
  }

  const db = await getDb();
  const stored = (await db.collection("settings").findOne({ _id: SITE_ID })) || {};
  const base: Record<string, unknown> = { ...stored };
  delete base._id;

  const merged = mergeDeep(base, patch) as Record<string, unknown>;
  delete merged._id;

  await db.collection("settings").updateOne({ _id: SITE_ID }, { $set: merged }, { upsert: true });
  revalidateAll();
  return json({ settings: await getSettings() });
}
