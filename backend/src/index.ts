import "dotenv/config";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";

const app = createApp();

connectDb()
  .catch((e) => {
    console.error("[backend] MongoDB connection failed (continuing in demo mode):", e);
  })
  .finally(() => {
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`[backend] listening on http://localhost:${env.port} (${env.nodeEnv})`);
    });
  });
