/**
 * One-off: copy everything in public/uploads into the DigitalOcean Space and
 * repoint every stored /uploads/... reference at the CDN URL.
 *
 *   npx tsx scripts/migrate-uploads-to-spaces.ts [--dry-run]
 *
 * Safe to re-run: files are re-uploaded under the same name and documents that
 * already hold CDN URLs are left alone.
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { extname, resolve, join } from "path";
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

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

/** Rewrite every /uploads/<name> string in a value, using `urls`. */
function rewrite(value: unknown, urls: Map<string, string>, hits: { n: number }): unknown {
  if (typeof value === "string") {
    if (!value.includes("/uploads/")) return value;
    let out = value;
    for (const [name, url] of urls) {
      const from = `/uploads/${name}`;
      if (out.includes(from)) { out = out.split(from).join(url); hits.n++; }
    }
    return out;
  }
  if (Array.isArray(value)) return value.map((v) => rewrite(v, urls, hits));
  if (value && typeof value === "object" && value.constructor === Object) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = rewrite(v, urls, hits);
    return out;
  }
  return value;
}

(async () => {
  const root = resolve(__dirname, "..");
  loadEnvFile(resolve(root, ".env.local"));
  loadEnvFile(resolve(root, ".env"));

  const dryRun = process.argv.includes("--dry-run");
  // Imported late so the module reads the env files loaded above.
  const { spacesEnabled, putObject } = await import("../lib/storage");
  if (!spacesEnabled) {
    console.error("No Space configured. Set SPACES_KEY, SPACES_SECRET and SPACES_BUCKET first.");
    process.exit(1);
  }

  const dir = join(root, "public", "uploads");
  let files: string[] = [];
  try { files = readdirSync(dir).filter((f) => statSync(join(dir, f)).isFile() && !f.startsWith(".")); }
  catch { console.log("No public/uploads directory - nothing to copy."); }

  const urls = new Map<string, string>();
  for (const name of files) {
    const type = CONTENT_TYPES[extname(name).toLowerCase()];
    if (!type) { console.warn(`skip ${name} (unsupported type)`); continue; }
    if (dryRun) { console.log(`would upload ${name}`); urls.set(name, `<cdn>/${name}`); continue; }
    const url = await putObject(name, readFileSync(join(dir, name)), type);
    urls.set(name, url);
    console.log(`uploaded ${name} -> ${url}`);
  }

  const client = new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/malarvadi", { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db(client.options.dbName || "malarvadi");

  let changed = 0;
  for (const info of await db.listCollections().toArray()) {
    const col = db.collection(info.name);
    for (const doc of await col.find({}).toArray()) {
      const { _id, ...rest } = doc;
      const hits = { n: 0 };
      const next = rewrite(rest, urls, hits) as Record<string, unknown>;
      if (!hits.n) continue;
      changed++;
      console.log(`${info.name}/${String(_id)}: ${hits.n} reference(s)`);
      if (!dryRun) await col.updateOne({ _id }, { $set: next });
    }
  }

  console.log(`${dryRun ? "[dry run] " : ""}${urls.size} file(s), ${changed} document(s) updated.`);
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
