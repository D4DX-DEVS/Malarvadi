import { getDb } from "@/lib/db";
import { COLLECTIONS } from "@/lib/content-registry";
import { json, requireAdmin, serializeDoc } from "@/lib/api";

export const dynamic = "force-dynamic";

const DEFS = Object.values(COLLECTIONS);

/** Dashboard numbers: per-collection counts, recent edits and latest submissions. */
export async function GET() {
  const unauth = requireAdmin();
  if (unauth) return unauth;

  const db = await getDb();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const perCollection = await Promise.all(
    DEFS.map(async (def) => {
      const col = db.collection(def.key);
      const [total, drafts, thisMonth, recent] = await Promise.all([
        col.countDocuments({}),
        def.publishable ? col.countDocuments({ published: false }) : Promise.resolve(0),
        col.countDocuments({ createdAt: { $gte: monthStart } }),
        col
          .find({ updatedAt: { $exists: true } }, { projection: { [def.listTitle]: 1, createdAt: 1, updatedAt: 1 } })
          .sort({ updatedAt: -1 })
          .limit(6)
          .toArray(),
      ]);
      const activity = recent.map((d) => {
        const created = d.createdAt ? new Date(d.createdAt).getTime() : 0;
        const updated = new Date(d.updatedAt).getTime();
        return {
          collection: def.key,
          id: String(d._id),
          title: String(d[def.listTitle] ?? ""),
          action: Math.abs(updated - created) < 2000 ? "added" : "updated",
          at: new Date(d.updatedAt).toISOString(),
        };
      });
      return { key: def.key, counts: { total, drafts, thisMonth }, activity };
    }),
  );

  const subs = db.collection("submissions");
  const [subTotal, subUnread, latest] = await Promise.all([
    subs.countDocuments({}),
    subs.countDocuments({ read: { $ne: true } }),
    subs.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
  ]);

  return json({
    collections: Object.fromEntries(perCollection.map((c) => [c.key, c.counts])),
    activity: perCollection
      .flatMap((c) => c.activity)
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 6),
    submissions: { total: subTotal, unread: subUnread, latest: latest.map((d) => serializeDoc(d)) },
  });
}
