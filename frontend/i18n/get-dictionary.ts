import en from "./dictionaries/en.json";
import ml from "./dictionaries/ml.json";
import type { AppLocale } from "../tokens";

export function getDictionary(locale: AppLocale) {
  return locale === "ml" ? ml : en;
}
