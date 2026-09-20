// Shared contract for every home section component.
import type { HomeData, HomeSection } from "@/lib/types";

export interface SectionProps {
  data: HomeData;
  section: HomeSection;
}

/** Stagger-in variants used by the program cards and the feature grid. */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.09, duration: 0.65, ease: "easeOut" } }),
};
