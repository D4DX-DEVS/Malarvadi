import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { err, json, readJson, requireAdmin, revalidateAll, serializeDoc } from "@/lib/api";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const unauth = requireAdmin();
  if (unauth) return unauth;
  if (!ObjectId.isValid(params.id)) return err("Not found", 404);
  const db = await getDb();
  const doc = await db.collection("submissions").findOne({ _id: new ObjectId(params.id) });
  if (!doc) return err("Not found", 404);
  return json({ item: serializeDoc(doc) });
}

/** Body { read: boolean } - toggles the inbox read state. */
export async function PATCH(req: Request, { params }: Ctx) {
  const unauth = requireAdmin();
  if (unauth) return unauth;
  if (!ObjectId.isValid(params.id)) return err("Not found", 404);
  const body = await readJson(req);
  if (typeof body?.read !== "boolean") return err("read must be a boolean");
  const db = await getDb();
  const res = await db.collection("submissions").updateOne({ _id: new ObjectId(params.id) }, { $set: { read: body.read } });
  if (!res.matchedCount) return err("Not found", 404);
  return json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const unauth = requireAdmin();
  if (unauth) return unauth;
  if (!ObjectId.isValid(params.id)) return err("Not found", 404);
  const db = await getDb();
  const res = await db.collection("submissions").deleteOne({ _id: new ObjectId(params.id) });
  if (!res.deletedCount) return err("Not found", 404);
  revalidateAll();
  return json({ ok: true });
}
