/** Fetch and store cover images for videos that have none (Facebook/Instagram). */
import { readFileSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import { ensureVideoThumb } from "../lib/video-thumb";

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
    const doc = { platform: d.platform, url: d.url, youtubeId: d.youtubeId, thumb: d.thumb } as Record<string, unknown>;
    await ensureVideoThumb(doc);
    if (doc.thumb && doc.thumb !== d.thumb) {
      await db.collection("videos").updateOne({ _id: d._id }, { $set: { thumb: doc.thumb, updatedAt: new Date() } });
      n++;
      console.log(`  ${d.title} -> ${doc.thumb}`);
    } else if (!doc.thumb) {
      console.log(`  ${d.title}: no cover available (${d.platform})`);
    }
  }
  console.log(n ? `\nSaved ${n} cover image(s).` : "\nNothing to do.");
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
