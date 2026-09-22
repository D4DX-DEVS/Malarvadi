/**
 * Give every "Why Malarvadi" item the slug its own page is served from.
 *
 * Rows written before the collection had a slug field carry none; the admin
 * fills it from the title on the next save, but the pages need it now.
 *
 *   npm run features:slugs            # show what would change
 *   npm run features:slugs -- --apply
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import { slugify } from "../lib/content-registry";

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

async function main() {
  const root = resolve(__dirname, "..");
  loadEnvFile(resolve(root, ".env.local"));
  loadEnvFile(resolve(root, ".env"));
  const apply = process.argv.includes("--apply");

  const client = new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/malarvadi", { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const col = client.db(client.options.dbName || "malarvadi").collection("features");
  const rows = await col.find({}).toArray();

  const taken = new Set(rows.map((r) => r.slug).filter(Boolean) as string[]);
  let n = 0;
  for (const row of rows) {
    if (typeof row.slug === "string" && row.slug.trim()) continue;
    let slug = slugify(String(row.title ?? ""));
    // Two items could slugify to the same string; keep them apart.
    let i = 2;
    while (taken.has(slug)) slug = `${slugify(String(row.title ?? ""))}-${i++}`;
    taken.add(slug);
    n++;
    console.log(`${row.title}\n  -> ${slug}`);
    if (apply) await col.updateOne({ _id: row._id }, { $set: { slug, updatedAt: new Date() } });
  }
  console.log(n === 0 ? "Every item already has a slug." : apply ? `\nUpdated ${n} item(s).` : `\nDry run - re-run with --apply to write ${n} slug(s).`);
  await client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
