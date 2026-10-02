"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "./api";
import { CONFIRM_LOGOUT, ConfirmProvider, useConfirm } from "./Confirm";
import { ToastProvider, useToast } from "./Toast";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/** Pages dispatch this after changing a submission's read state so the badges refresh. */
export const UNREAD_EVENT = "adm:unread";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <Shell>{children}</Shell>
      </ConfirmProvider>
    </ToastProvider>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();
  const [navOpen, setNavOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const loadUnread = useCallback(async () => {
    try {
      const res = await api<{ counts: { unread: number } }>("/api/submissions?page=1&limit=1");
      setUnread(res.counts.unread || 0);
    } catch {
      /* the badge is cosmetic */
    }
  }, []);

  useEffect(() => {
    setNavOpen(false);
    void loadUnread();
  }, [pathname, loadUnread]);

  useEffect(() => {
    const on = () => void loadUnread();
    window.addEventListener(UNREAD_EVENT, on);
    return () => window.removeEventListener(UNREAD_EVENT, on);
  }, [loadUnread]);

  const logout = useCallback(async () => {
    if (!(await confirm(CONFIRM_LOGOUT))) return;
    try {
      await api("/api/auth/logout", { method: "POST" });
      router.push("/admin");
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Logout failed", true);
    }
  }, [confirm, router, toast]);

  return (
    <div className={`adm-frame${navOpen ? " nav-open" : ""}`} style={{ display: "contents" }}>
      <Sidebar unread={unread} onClose={() => setNavOpen(false)} onLogout={logout} />
      {navOpen ? <div className="adm-scrim" onClick={() => setNavOpen(false)} /> : null}
      <div className="adm-body">
        <Topbar unread={unread} onMenu={() => setNavOpen(true)} onLogout={logout} />
        <main className="adm-main">
          <div className="adm-wrap">{children}</div>
        </main>
      </div>
    </div>
  );
}
