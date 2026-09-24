/**
 * Find-and-replace a phrase across every stored string in the database.
 *
 *   npx tsx scripts/replace-text.ts "old text" "new text" [--dry-run]
 *
 * Walks every collection (settings and home sections included), rewriting the
 * phrase wherever it appears in a string, inside nested objects and arrays.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";

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

function replaceDeep(value: unknown, from: string, to: string, hits: string[], path: string): unknown {
  if (typeof value === "string") {
    if (!value.includes(from)) return value;
    hits.push(path);
    return value.split(from).join(to);
  }
  if (Array.isArray(value)) return value.map((v, i) => replaceDeep(v, from, to, hits, `${path}[${i}]`));
  if (value && typeof value === "object" && value.constructor === Object) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = replaceDeep(v, from, to, hits, path ? `${path}.${k}` : k);
    return out;
  }
  return value;
}

(async () => {
  const root = resolve(__dirname, "..");
  loadEnvFile(resolve(root, ".env.local"));
  loadEnvFile(resolve(root, ".env"));

  const args = process.argv.slice(2).filter((a) => a !== "--dry-run");
  const dryRun = process.argv.includes("--dry-run");
  const [from, to] = args;
  if (!from || to === undefined) {
    console.error('Usage: npx tsx scripts/replace-text.ts "old text" "new text" [--dry-run]');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/malarvadi", { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  const db = client.db(client.options.dbName || "malarvadi");

  let docs = 0, fields = 0;
  for (const info of await db.listCollections().toArray()) {
    const col = db.collection(info.name);
    for (const doc of await col.find({}).toArray()) {
      const { _id, ...rest } = doc;
      const hits: string[] = [];
      const next = replaceDeep(rest, from, to, hits, "") as Record<string, unknown>;
      if (!hits.length) continue;
      docs++; fields += hits.length;
      console.log(`${info.name}/${String(_id)}: ${hits.join(", ")}`);
      if (!dryRun) await col.updateOne({ _id }, { $set: next });
    }
  }
  console.log(`${dryRun ? "[dry run] " : ""}"${from}" -> "${to}": ${fields} field(s) in ${docs} document(s).`);
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
