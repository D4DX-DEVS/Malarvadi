import "dotenv/config";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { Event, Leader, News, Program } from "../models/index.js";

/**
 * Development seed - DEMO DATA ONLY, clearly marked.
 * Never presents fake people as real Malarvadi leaders.
 * Usage: npm run seed (requires MONGODB_URI + SEED=true confirmation)
 */
async function main() {
  if (process.env.SEED !== "true") {
    console.log("Refusing to seed: set SEED=true explicitly.");
    process.exit(1);
  }
  if (!env.mongoUri) throw new Error("MONGODB_URI is required for seeding");
  await mongoose.connect(env.mongoUri);

  // No admin user is created here - the single admin lives in ADMIN_EMAIL /
  // ADMIN_PASSWORD in .env, not in the database.

  if ((await Program.countDocuments()) === 0) {
    await Program.create([
      {
        slug: "demo-orumayude-punchiri",
        type: "general",
        title: { en: "Demo: Orumayude Punchiri (sample)", ml: "" },
        summary: { en: "Sample program entry for layout testing.", ml: "" },
        body: { en: "Demo content. Real program details will be entered by admins.", ml: "" },
        ageGroup: "Class 1-7",
        status: "published",
        featured: true,
        order: 1,
      },
      {
        slug: "demo-rainbow-drawing",
        type: "rainbow",
        title: { en: "Demo: Rainbow drawing contest (sample)", ml: "" },
        summary: { en: "Sample Rainbow entry - structured drawing competition since 2009.", ml: "" },
        body: { en: "Demo content only.", ml: "" },
        status: "published",
        order: 2,
      },
    ]);
    console.log("[seed] demo programs inserted");
  }

  if ((await Event.countDocuments()) === 0) {
    await Event.create({
      slug: "demo-green-kerala-campaign",
      title: { en: "Demo: Green Kerala Campaign (sample)", ml: "" },
      description: { en: "Sample event for layout testing.", ml: "" },
      venue: { en: "Demo venue", ml: "" },
      district: "Thiruvananthapuram",
      dateStart: new Date(Date.now() + 14 * 864e5),
      status: "published",
      featured: true,
    });
    console.log("[seed] demo event inserted");
  }

  if ((await News.countDocuments()) === 0) {
    await News.create({
      slug: "demo-welcome-to-malarvadi",
      title: { en: "Demo: Welcome to the new Malarvadi website (sample)", ml: "" },
      excerpt: { en: "Sample news entry for layout testing.", ml: "" },
      body: { en: "Demo content only. Real news will be published by admins.", ml: "" },
      status: "published",
      featured: true,
      publishedAt: new Date(),
    });
    console.log("[seed] demo news inserted");
  }

  if ((await Leader.countDocuments()) === 0) {
    await Leader.create({
      name: { en: "Demo Leader (sample - not a real person)", ml: "" },
      role: { en: "Sample role", ml: "" },
      group: "state",
      order: 1,
      active: true,
    });
    console.log("[seed] demo leader placeholder inserted");
  }

  await mongoose.disconnect();
  console.log("[seed] done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
