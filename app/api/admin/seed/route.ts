import { getDb } from "@/lib/db";
import { runSeed } from "@/lib/seed";
import { json, readJson, requireAdmin, revalidateAll } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const unauth = requireAdmin();
  if (unauth) return unauth;

  const body = await readJson(req);
  const reset = body?.reset === true;

  const db = await getDb();
  const counts = await runSeed(db, { reset });
  revalidateAll();
  return json({ ok: true, counts });
}
