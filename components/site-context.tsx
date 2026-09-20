"use client";
import { createContext, useContext } from "react";
import type { SiteSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/defaults";

const Ctx = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SiteProvider({ settings, children }: { settings: SiteSettings; children: React.ReactNode }) {
  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>;
}

/** Site-wide settings (contact, socials, copy). Available in any client component. */
export function useSite(): SiteSettings {
  return useContext(Ctx);
}

/** "tel:" href from a display phone like "+91 98765 43210". */
export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;
