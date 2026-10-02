import { ObjectId, type AnyBulkWriteOperation, type Document } from "mongodb";
import { getDb } from "@/lib/db";
import { err, getCollectionDef, json, readJson, requireAdmin, revalidateAll } from "@/lib/api";

export const dynamic = "force-dynamic";

type Ctx = { params: { collection: string } };

/**
 * Body { ids, offset? }. Without `offset`, `ids` is the whole collection in its
 * new order. With `offset`, `ids` is one page of a paginated list starting at
 * that position: it is spliced into the full order before renumbering.
 */
export async function POST(req: Request, { params }: Ctx) {
  const def = getCollectionDef(params.collection);
  if (!def) return err("Unknown collection", 404);
  const unauth = requireAdmin();
  if (unauth) return unauth;

  const body = await readJson(req);
  const ids = body?.ids;
  if (!Array.isArray(ids) || ids.some((i) => typeof i !== "string" || !ObjectId.isValid(i))) {
    return err("ids must be an array of document ids");
  }
  if (!ids.length) return json({ ok: true });

  const db = await getDb();
  let ordered = ids as string[];
  if (body?.offset !== undefined) {
    const offset = Math.max(0, Math.floor(Number(body.offset) || 0));
    const all = await db.collection(def.key).find({}, { projection: { _id: 1 } }).sort({ order: 1, createdAt: 1 }).toArray();
    const moving = new Set(ordered);
    const rest = all.map((d) => String(d._id)).filter((id) => !moving.has(id));
    ordered = [...rest.slice(0, offset), ...ordered, ...rest.slice(offset)];
  }

  const ops: AnyBulkWriteOperation<Document>[] = ordered.map((id, index) => ({
    updateOne: { filter: { _id: new ObjectId(id) }, update: { $set: { order: index } } },
  }));
  await db.collection(def.key).bulkWrite(ops);
  revalidateAll();
  return json({ ok: true });
}
