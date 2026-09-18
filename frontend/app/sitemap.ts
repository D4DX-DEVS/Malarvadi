import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "ml"];
  const paths = ["", "/about", "/objectives", "/global-presence", "/history", "/programs", "/events", "/leaders", "/news", "/gallery", "/contact"];
  const now = new Date();
  return locales.flatMap((l) =>
    paths.map((p) => ({
      url: `${SITE}/${l}${p}`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${SITE}/en${p}`,
          ml: `${SITE}/ml${p}`,
        },
      },
    }))
  );
}
