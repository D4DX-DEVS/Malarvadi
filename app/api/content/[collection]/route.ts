import { ObjectId, type Document, type Filter } from "mongodb";
import { getDb } from "@/lib/db";
import { validateDoc } from "@/lib/content-registry";
import { resolveFacebookShareUrl } from "@/lib/video";
import { ensureVideoThumb } from "@/lib/video-thumb";
import { listDocs } from "@/lib/queries";
import { err, escapeRegex, getCollectionDef, json, nextOrder, pageParams, readJson, requireAdmin, revalidateAll, serializeDoc, uniqueSlug } from "@/lib/api";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: { collection: string } };

const SEARCHABLE = new Set(["text", "textarea", "slug"]);

export async function GET(req: Request, { params }: Ctx) {
  const def = getCollectionDef(params.collection);
  if (!def) return err("Unknown collection", 404);
  const sp = new URL(req.url).searchParams;
  const all = sp.get("all") === "1";
  const includeUnpublished = all && isAdmin();

  // Without `page` the response is the full list, as the public site expects.
  if (!sp.has("page")) {
    const items = await listDocs<Record<string, unknown>>(def.key, { includeUnpublished });
    return json({ items });
  }

  // Paginated admin listing: ?page=&limit=&q=&status=published|draft
  const { page, limit, skip } = pageParams(sp);
  const base: Filter<Document> = {};
  if (def.publishable && !includeUnpublished) base.published = { $ne: false };
  const q = (sp.get("q") || "").trim().slice(0, 100);
  if (q) {
    const rx = { $regex: escapeRegex(q), $options: "i" };
    base.$or = def.fields.filter((f) => SEARCHABLE.has(f.type)).map((f) => ({ [f.name]: rx }));
  }

  const status = sp.get("status");
  const filter: Filter<Document> = { ...base };
  if (def.publishable && status === "published") filter.published = { $ne: false };
  if (def.publishable && status === "draft" && includeUnpublished) filter.published = false;

  const db = await getDb();
  const col = db.collection(def.key);
  const sort: Document = def.sortable ? { order: 1, createdAt: 1 } : { date: -1, createdAt: -1 };
  const [docs, total, countAll, countDraft] = await Promise.all([
    col.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
    col.countDocuments(filter),
    col.countDocuments(base),
    def.publishable && includeUnpublished ? col.countDocuments({ ...base, published: false }) : Promise.resolve(0),
  ]);

  return json({
    items: docs.map((d) => serializeDoc(d)),
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
    counts: { all: countAll, published: countAll - countDraft, draft: countDraft },
  });
}

export async function POST(req: Request, { params }: Ctx) {
  const def = getCollectionDef(params.collection);
  if (!def) return err("Unknown collection", 404);
  const unauth = requireAdmin();
  if (unauth) return unauth;

  const body = await readJson(req);
  if (!body) return err("Invalid JSON body");

  const { doc, errors } = validateDoc(def, body);
  if (errors || !doc) return err(errors!.join(", "));

  // A Facebook share link cannot be embedded; store the permalink instead,
  // then grab a cover image for platforms that give us no free thumbnail.
  if (def.key === "videos" && typeof doc.url === "string" && doc.url) {
    doc.url = await resolveFacebookShareUrl(doc.url);
    await ensureVideoThumb(doc);
  }

  const db = await getDb();
  if (Object.prototype.hasOwnProperty.call(doc, "slug")) {
    doc.slug = await uniqueSlug(db, def.key, String(doc.slug || ""));
  }
  if (def.sortable && (body.order === undefined || body.order === null || body.order === "")) {
    doc.order = await nextOrder(db, def.key);
  }
  const now = new Date();
  doc.createdAt = now;
  doc.updatedAt = now;

  const res = await db.collection(def.key).insertOne(doc);
  const saved = await db.collection(def.key).findOne({ _id: res.insertedId });
  revalidateAll();
  return json({ item: serializeDoc(saved) }, 201);
}

/** Bulk delete: body { ids: string[] }. */
export async function DELETE(req: Request, { params }: Ctx) {
  const def = getCollectionDef(params.collection);
  if (!def) return err("Unknown collection", 404);
  const unauth = requireAdmin();
  if (unauth) return unauth;

  const body = await readJson(req);
  const ids = body?.ids;
  if (!Array.isArray(ids) || !ids.length || ids.length > 200 || ids.some((i) => typeof i !== "string" || !ObjectId.isValid(i))) {
    return err("ids must be a non-empty array of document ids");
  }
  const db = await getDb();
  const res = await db.collection(def.key).deleteMany({ _id: { $in: (ids as string[]).map((i) => new ObjectId(i)) } });
  revalidateAll();
  return json({ ok: true, deleted: res.deletedCount });
}
