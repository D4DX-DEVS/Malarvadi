import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function pageMeta(
  locale: string,
  path: string,
  title: string,
  description: string
): Metadata {
  const clean = path === "/" ? "" : path;
  return {
    // Root layout's title template already appends "| Malarvadi" - adding it
    // here too produced "... | Malarvadi | Malarvadi" in the tab.
    title,
    description,
    alternates: {
      canonical: `${SITE}/${locale}${clean}`,
      languages: {
        en: `${SITE}/en${clean}`,
        ml: `${SITE}/ml${clean}`,
      },
    },
    openGraph: {
      title: `${title} | Malarvadi`,
      description,
      url: `${SITE}/${locale}${clean}`,
      siteName: "Malarvadi",
      locale: locale === "ml" ? "ml_IN" : "en_IN",
      type: "website",
    },
  };
}
