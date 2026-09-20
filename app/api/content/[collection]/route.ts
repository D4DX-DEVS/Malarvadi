import { getDb } from "@/lib/db";
import { validateDoc } from "@/lib/content-registry";
import { listDocs } from "@/lib/queries";
import { err, getCollectionDef, json, nextOrder, readJson, requireAdmin, revalidateAll, serializeDoc, uniqueSlug } from "@/lib/api";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: { collection: string } };

export async function GET(req: Request, { params }: Ctx) {
  const def = getCollectionDef(params.collection);
  if (!def) return err("Unknown collection", 404);
  const all = new URL(req.url).searchParams.get("all") === "1";
  const includeUnpublished = all && isAdmin();
  const items = await listDocs<Record<string, unknown>>(def.key, { includeUnpublished });
  return json({ items });
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
