/**
 * Push lib/defaults.ts into the stored settings document.
 *
 * getSettings() merges the Mongo `settings` doc OVER DEFAULT_SETTINGS, so once
 * the doc exists every field in it shadows the file. Editing defaults.ts alone
 * therefore changes nothing on the site. This syncs the differing fields.
 *
 *   npm run settings:sync           # show what differs, change nothing
 *   npm run settings:sync -- --apply
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { MongoClient, type ObjectId } from "mongodb";
import { DEFAULT_SETTINGS } from "../lib/defaults";

function loadEnvFile(file: string) {
  let raw: string;
  try { raw = readFileSync(file, "utf8"); } catch { return; }
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 1) continue;
    const key = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = v;
  }
}

type Diff = { path: string; file: unknown; db: unknown };

/** Walk both trees; arrays and scalars are compared whole. */
function diff(file: unknown, db: unknown, path = "", out: Diff[] = []): Diff[] {
  const plain = (v: unknown) => v && typeof v === "object" && !Array.isArray(v);
  if (plain(file) && plain(db)) {
    const keys = new Set([...Object.keys(file as object), ...Object.keys(db as object)]);
    for (const k of keys) {
      diff((file as any)[k], (db as any)[k], path ? `${path}.${k}` : k, out);
    }
  } else if (JSON.stringify(file) !== JSON.stringify(db)) {
    out.push({ path, file, db });
  }
  return out;
}

async function main() {
  const root = resolve(__dirname, "..");
  loadEnvFile(resolve(root, ".env.local"));
  loadEnvFile(resolve(root, ".env"));
  const apply = process.argv.includes("--apply");

  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/malarvadi";
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db(client.options.dbName || "malarvadi");

  const stored = await db.collection("settings").findOne({ _id: "site" as unknown as ObjectId });
  if (!stored) {
    console.log("No settings document yet - run `npm run seed` first.");
    await client.close();
    return;
  }
  const { createdAt: _c, updatedAt: _u, ...rest } = stored as Record<string, unknown>;
  const all = diff(DEFAULT_SETTINGS, { ...rest, _id: "site" }).filter((d) => d.path !== "_id");
  // A path missing from the file is NOT "the file wins" - $set-ing undefined
  // stores null and wipes the stored value. Report those, never write them.
  const diffs = all.filter((d) => d.file !== undefined);
  const extra = all.filter((d) => d.file === undefined);
  if (extra.length) {
    console.log(`Only in the database (left untouched - not present in lib/defaults.ts):`);
    for (const d of extra) console.log(`  ${d.path} = ${JSON.stringify(d.db)}`);
    console.log("");
  }

  if (!diffs.length) {
    console.log("In sync - the stored settings already match lib/defaults.ts.");
    await client.close();
    return;
  }

  console.log(`${diffs.length} field(s) where the database shadows lib/defaults.ts:\n`);
  for (const d of diffs) {
    console.log(`  ${d.path}`);
    console.log(`    file: ${JSON.stringify(d.file)}`);
    console.log(`    db  : ${JSON.stringify(d.db)}`);
  }

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to write the file values into the database.");
    await client.close();
    return;
  }

  const $set: Record<string, unknown> = { updatedAt: new Date() };
  for (const d of diffs) $set[d.path] = d.file;
  await db.collection("settings").updateOne({ _id: "site" as unknown as ObjectId }, { $set });
  console.log(`\nApplied ${diffs.length} field(s) to the database.`);
  await client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
