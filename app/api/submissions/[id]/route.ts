import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { err, json, requireAdmin, revalidateAll } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const unauth = requireAdmin();
  if (unauth) return unauth;
  if (!ObjectId.isValid(params.id)) return err("Not found", 404);
  const db = await getDb();
  const res = await db.collection("submissions").deleteOne({ _id: new ObjectId(params.id) });
  if (!res.deletedCount) return err("Not found", 404);
  revalidateAll();
  return json({ ok: true });
}
