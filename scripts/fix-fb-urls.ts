/** One-off: rewrite stored Facebook /share/ links to embeddable permalinks. */
import { readFileSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import { isFacebookShareLink, resolveFacebookShareUrl } from "../lib/video";

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
  const client = new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/malarvadi", { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db(client.options.dbName || "malarvadi");
  const docs = await db.collection("videos").find({}).toArray();
  let n = 0;
  for (const d of docs) {
    if (typeof d.url !== "string" || !isFacebookShareLink(d.url)) continue;
    const fixed = await resolveFacebookShareUrl(d.url);
    if (fixed && fixed !== d.url) {
      await db.collection("videos").updateOne({ _id: d._id }, { $set: { url: fixed, updatedAt: new Date() } });
      n++;
      console.log(`  ${d.title}\n    ${d.url}\n -> ${fixed}`);
    } else {
      console.log(`  ${d.title}: could not resolve, left as-is`);
    }
  }
  console.log(n ? `\nRewrote ${n} link(s).` : "\nNothing to rewrite.");
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
