import { ObjectId, type AnyBulkWriteOperation, type Document } from "mongodb";
import { getDb } from "@/lib/db";
import { err, getCollectionDef, json, readJson, requireAdmin, revalidateAll } from "@/lib/api";

export const dynamic = "force-dynamic";

type Ctx = { params: { collection: string } };

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

  const ops: AnyBulkWriteOperation<Document>[] = (ids as string[]).map((id, index) => ({
    updateOne: { filter: { _id: new ObjectId(id) }, update: { $set: { order: index, updatedAt: new Date() } } },
  }));
  const db = await getDb();
  await db.collection(def.key).bulkWrite(ops);
  revalidateAll();
  return json({ ok: true });
}
