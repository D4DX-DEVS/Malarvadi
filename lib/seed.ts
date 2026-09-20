// Idempotent seeding of every content collection + home sections + settings.
import type { Db, ObjectId } from "mongodb";
import { COLLECTION_KEYS } from "./content-registry";
import { DEFAULT_SETTINGS } from "./defaults";
import { NATURAL_KEY, SEED, homeSectionsSeed } from "./seed-data";

export interface SeedResult {
  [collection: string]: number;
}

/**
 * Upsert the static-site content into Mongo.
 * Existing documents are never overwritten ($setOnInsert), so admin edits survive.
 * `reset: true` drops the seeded collections first.
 */
export async function runSeed(db: Db, opts: { reset?: boolean } = {}): Promise<SeedResult> {
  const counts: SeedResult = {};

  if (opts.reset) {
    for (const key of COLLECTION_KEYS) await db.collection(key).deleteMany({});
    await db.collection("homeSections").deleteMany({});
    await db.collection("settings").deleteMany({});
  }

  const now = new Date();

  // Unique slugs for slug-bearing collections (sparse: other docs have no slug).
  for (const key of ["news", "blog", "programs"]) {
    await db.collection(key).createIndex({ slug: 1 }, { unique: true, sparse: true });
  }

  for (const key of COLLECTION_KEYS) {
    const rows = SEED[key] || [];
    const naturalKey = NATURAL_KEY[key] || "title";
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!;
      const filter = { [naturalKey]: row[naturalKey] };
      await db.collection(key).updateOne(
        filter,
        { $setOnInsert: { ...row, order: i, published: true, createdAt: now, updatedAt: now } },
        { upsert: true },
      );
    }
    counts[key] = await db.collection(key).countDocuments();
  }

  // Home sections — one doc per key, _id = key.
  for (const s of homeSectionsSeed) {
    const { _id, ...body } = s;
    await db.collection("homeSections").updateOne(
      { _id: _id as unknown as ObjectId },
      { $setOnInsert: { ...body, createdAt: now } },
      { upsert: true },
    );
  }
  counts.homeSections = await db.collection("homeSections").countDocuments();

  // Settings — only create when missing; never overwrite admin edits.
  const { _id: _ignored, ...settingsBody } = DEFAULT_SETTINGS;
  await db.collection("settings").updateOne(
    { _id: "site" as unknown as ObjectId },
    { $setOnInsert: { ...settingsBody, createdAt: now } },
    { upsert: true },
  );
  counts.settings = await db.collection("settings").countDocuments();

  return counts;
}
