import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { validateDoc } from "@/lib/content-registry";
import { err, getCollectionDef, json, readJson, requireAdmin, revalidateAll, serializeDoc, uniqueSlug } from "@/lib/api";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: { collection: string; id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const def = getCollectionDef(params.collection);
  if (!def) return err("Unknown collection", 404);
  if (!ObjectId.isValid(params.id)) return err("Not found", 404);
  const db = await getDb();
  const doc = await db.collection(def.key).findOne({ _id: new ObjectId(params.id) });
  if (!doc) return err("Not found", 404);
  if (def.publishable && doc.published === false && !isAdmin()) return err("Not found", 404);
  return json({ item: serializeDoc(doc) });
}

export async function PUT(req: Request, { params }: Ctx) {
  const def = getCollectionDef(params.collection);
  if (!def) return err("Unknown collection", 404);
  const unauth = requireAdmin();
  if (unauth) return unauth;
  if (!ObjectId.isValid(params.id)) return err("Not found", 404);

  const body = await readJson(req);
  if (!body) return err("Invalid JSON body");

  const { doc, errors } = validateDoc(def, body);
  if (errors || !doc) return err(errors!.join(", "));

  const db = await getDb();
  const _id = new ObjectId(params.id);
  const existing = await db.collection(def.key).findOne({ _id });
  if (!existing) return err("Not found", 404);

  if (Object.prototype.hasOwnProperty.call(doc, "slug")) {
    doc.slug = await uniqueSlug(db, def.key, String(doc.slug || ""), _id);
  }
  doc.createdAt = existing.createdAt ?? new Date();
  doc.updatedAt = new Date();

  await db.collection(def.key).replaceOne({ _id }, doc);
  const saved = await db.collection(def.key).findOne({ _id });
  revalidateAll();
  return json({ item: serializeDoc(saved) });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const def = getCollectionDef(params.collection);
  if (!def) return err("Unknown collection", 404);
  const unauth = requireAdmin();
  if (unauth) return unauth;
  if (!ObjectId.isValid(params.id)) return err("Not found", 404);

  const db = await getDb();
  const res = await db.collection(def.key).deleteOne({ _id: new ObjectId(params.id) });
  if (!res.deletedCount) return err("Not found", 404);
  revalidateAll();
  return json({ ok: true });
}
