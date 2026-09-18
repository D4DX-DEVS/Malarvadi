import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.js";
import { authRouter } from "./routes/auth.js";
import { contactAdmin, contactPublic } from "./routes/contact.js";
import {
  eventAdmin,
  eventPublic,
  galleryAdmin,
  galleryPublic,
  leaderAdmin,
  leaderPublic,
  newsAdmin,
  newsPublic,
  pageAdmin,
  pagePublic,
  programAdmin,
  programPublic,
  publicationAdmin,
  publicationPublic,
} from "./routes/resources.js";
import { mediaAdmin, uploadRouter } from "./routes/upload.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: [env.frontendUrl],
      credentials: true,
    })
  );
  app.use(express.json({ limit: "256kb" }));
  app.use(cookieParser());
  app.use(morgan("dev"));

  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1/auth", authRouter);

  app.use("/api/v1/programs", programPublic);
  app.use("/api/v1/events", eventPublic);
  app.use("/api/v1/news", newsPublic);
  app.use("/api/v1/leaders", leaderPublic);
  app.use("/api/v1/gallery", galleryPublic);
  app.use("/api/v1/pages", pagePublic);
  app.use("/api/v1/publications", publicationPublic);
  app.use("/api/v1/contact", contactPublic);

  // Admin CRUD (protected) - same resource, /admin suffix keeps public cache simple
  app.use("/api/v1/admin/programs", programAdmin);
  app.use("/api/v1/admin/events", eventAdmin);
  app.use("/api/v1/admin/news", newsAdmin);
  app.use("/api/v1/admin/leaders", leaderAdmin);
  app.use("/api/v1/admin/gallery", galleryAdmin);
  app.use("/api/v1/admin/pages", pageAdmin);
  app.use("/api/v1/admin/publications", publicationAdmin);
  app.use("/api/v1/admin/contact-messages", contactAdmin);
  app.use("/api/v1/admin/media", mediaAdmin);
  app.use("/api/v1/admin/upload", uploadRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
