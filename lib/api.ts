// Shared helpers for the /api route handlers.
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ObjectId, type Db, type Document } from "mongodb";
import { isAdmin } from "./auth";
import { COLLECTIONS, type CollectionDef } from "./content-registry";
import { serialize } from "./queries";

export function json<T>(body: T, status = 200) {
  return NextResponse.json(body, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Returns an error response when the caller is not an admin, otherwise null. */
export function requireAdmin(): NextResponse | null {
  return isAdmin() ? null : err("Unauthorized", 401);
}

export function getCollectionDef(key: string): CollectionDef | null {
  return COLLECTIONS[key] ?? null;
}

/** Best-effort client IP from proxy headers. */
export function getClientIp(req: Request): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") || h.get("cf-connecting-ip") || "unknown";
}

/** Revalidate the whole app after a successful write. */
export function revalidateAll() {
  try {
    revalidatePath("/", "layout");
  } catch {
    /* outside a request scope (e.g. scripts) — ignore */
  }
}

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * Ensure `slug` is unique inside `collection`, appending -2, -3 … when taken.
 * `excludeId` skips the document being updated.
 */
export async function uniqueSlug(db: Db, collection: string, slug: string, excludeId?: ObjectId): Promise<string> {
  if (!slug) return slug;
  let candidate = slug;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const filter: Document = { slug: candidate };
    if (excludeId) filter._id = { $ne: excludeId };
    const hit = await db.collection(collection).findOne(filter, { projection: { _id: 1 } });
    if (!hit) return candidate;
    n += 1;
    candidate = `${slug}-${n}`;
  }
}

/** max(order) + 1 for a sortable collection. */
export async function nextOrder(db: Db, collection: string): Promise<number> {
  const top = await db.collection(collection).find({}).sort({ order: -1 }).limit(1).toArray();
  const cur = top[0]?.order;
  return typeof cur === "number" ? cur + 1 : 0;
}

export const serializeDoc = serialize;

/** Deep merge with the same semantics as lib/queries mergeDeep: arrays replaced wholesale. */
export function mergeDeep<T>(base: T, over: unknown): T {
  if (Array.isArray(base) || Array.isArray(over)) return (over ?? base) as T;
  if (base && typeof base === "object" && over && typeof over === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(over as Record<string, unknown>)) {
      out[k] = mergeDeep((base as Record<string, unknown>)[k], v);
    }
    return out as T;
  }
  return (over === undefined ? base : over) as T;
}

/* ------------------------------------------------------------------ */
/* Tiny in-memory rate limiter (per process). 20 hits / 10 min per key. */
/* ------------------------------------------------------------------ */

declare global {
  // eslint-disable-next-line no-var
  var __mvRate: Map<string, number[]> | undefined;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 20;

export function rateLimit(key: string, max = MAX_HITS, windowMs = WINDOW_MS): boolean {
  if (!global.__mvRate) global.__mvRate = new Map();
  const store = global.__mvRate;
  const now = Date.now();
  const hits = (store.get(key) || []).filter((t: number) => now - t < windowMs);
  if (hits.length >= max) {
    store.set(key, hits);
    return false;
  }
  hits.push(now);
  store.set(key, hits);
  if (store.size > 5000) {
    const stale: string[] = [];
    store.forEach((v, k) => {
      if (!v.some((t) => now - t < windowMs)) stale.push(k);
    });
    stale.forEach((k) => store.delete(k));
  }
  return true;
}
