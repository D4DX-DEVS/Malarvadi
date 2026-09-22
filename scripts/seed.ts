/**
 * Standalone seeder: `npm run seed` (or `npm run seed:reset`).
 * Loads .env.local / .env by hand (no dotenv dependency) and runs lib/seed.ts.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import { runSeed } from "../lib/seed";

function loadEnvFile(file: string) {
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

async function main() {
  const root = resolve(__dirname, "..");
  // Next.js precedence: .env.local wins over .env. loadEnvFile only fills keys
  // that are still unset, so load them in that order.
  loadEnvFile(resolve(root, ".env.local"));
  loadEnvFile(resolve(root, ".env"));

  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/malarvadi";
  const reset = process.argv.includes("--reset");

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db(client.options.dbName || "malarvadi");

  console.log(`Seeding ${db.databaseName} at ${uri}${reset ? " (reset)" : ""}…`);
  const counts = await runSeed(db, { reset });
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(16)} ${v}`);
  console.log("Done.");

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
