import type { AppLocale } from "../tokens";

export const locales: AppLocale[] = ["en", "ml"];
export const defaultLocale: AppLocale = "en";

export function isValidLocale(value: string | undefined): value is AppLocale {
  return value === "en" || value === "ml";
}
