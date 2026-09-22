/** One-off: give existing video docs the new `platform` + `url` fields. */
import { readFileSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";

function loadEnvFile(file: string) {
  let raw: string;
  try { raw = readFileSync(file, "utf8"); } catch { return; }
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
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
    const set: Record<string, unknown> = {};
    if (!d.platform) set.platform = "youtube";
    if (!d.url && d.youtubeId) set.url = `https://www.youtube.com/watch?v=${d.youtubeId}`;
    if (Object.keys(set).length) {
      await db.collection("videos").updateOne({ _id: d._id }, { $set: { ...set, updatedAt: new Date() } });
      n++;
      console.log(`  ${d.title} -> ${JSON.stringify(set)}`);
    }
  }
  console.log(n ? `\nBackfilled ${n} of ${docs.length} video(s).` : "Nothing to backfill.");
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
