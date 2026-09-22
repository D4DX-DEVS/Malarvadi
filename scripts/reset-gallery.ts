/**
 * Replace the whole photo gallery with `gallerySeed` from lib/seed-data.
 *
 *   npm run gallery:reset [-- --dry-run]
 *
 * The normal seeder only upserts, so it cannot drop photos that are no longer
 * in the list. This one does: every existing gallery document goes, and the
 * seed list is inserted in order.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import { gallerySeed } from "../lib/seed-data";

function loadEnvFile(file: string) {
  let raw: string;
  try { raw = readFileSync(file, "utf8"); } catch { return; }
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 1) continue;
    const key = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = v;
  }
}

(async () => {
  const root = resolve(__dirname, "..");
  loadEnvFile(resolve(root, ".env.local"));
  loadEnvFile(resolve(root, ".env"));

  const dryRun = process.argv.includes("--dry-run");
  const client = new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/malarvadi", { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  const db = client.db(client.options.dbName || "malarvadi");
  const col = db.collection("gallery");

  const existing = await col.countDocuments();
  const docs = gallerySeed.map((g, i) => ({ ...g, order: i, published: true, createdAt: new Date() }));
  console.log(`${dryRun ? "[dry run] " : ""}${db.databaseName}: removing ${existing} photo(s), inserting ${docs.length}.`);
  if (!dryRun) {
    await col.deleteMany({});
    await col.insertMany(docs);
  }
  for (const d of docs) console.log(`  ${String(d.order).padStart(2)} ${d.src}`);

  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
