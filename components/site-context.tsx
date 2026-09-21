"use client";
import { createContext, useContext, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import JoinModal from "@/components/home/JoinModal";

const Ctx = createContext<SiteSettings>(DEFAULT_SETTINGS);

const JoinModalCtx = createContext<{ openJoin: () => void; closeJoin: () => void }>({
  openJoin: () => {},
  closeJoin: () => {},
});

export function SiteProvider({ settings, children }: { settings: SiteSettings; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Ctx.Provider value={settings}>
      <JoinModalCtx.Provider value={{ openJoin: () => setOpen(true), closeJoin: () => setOpen(false) }}>
        {children}
        <JoinModal open={open} onClose={() => setOpen(false)} />
      </JoinModalCtx.Provider>
    </Ctx.Provider>
  );
}

/** Site-wide settings (contact, socials, copy). Available in any client component. */
export function useSite(): SiteSettings {
  return useContext(Ctx);
}

/** Opens/closes the global "അംഗമാവുക" membership popup, available on every page. */
export function useJoinModal() {
  return useContext(JoinModalCtx);
}

/** "tel:" href from a display phone like "+91 98765 43210". */
export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;
