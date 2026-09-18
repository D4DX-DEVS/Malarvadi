"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { ADMIN_NAV } from "@/lib/admin-resources";
import { Logo } from "@/components/Logo";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  // The login page lives under /admin too, so it gets this same layout. It must
  // NOT be session-gated: checking the session there would 401, redirect to the
  // page we are already on, and leave the form stuck behind "Checking session".
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    adminApi
      .me()
      .then((j) => {
        setEmail((j.data as { user: { email: string } }).user.email);
        setReady(true);
      })
      .catch(() => router.replace("/admin/login"));
  }, [router, isLoginPage]);

  async function logout() {
    await adminApi.logout().catch(() => undefined);
    router.replace("/admin/login");
  }

  if (isLoginPage) return <>{children}</>;
  if (!ready) return <main className="p-10 text-sm">Checking session…</main>;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-cocoa/10 bg-cocoa text-cream">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2.5 font-display font-bold">
            <span className="inline-flex rounded-lg bg-cream px-2 py-1">
              <Logo className="h-5" />
            </span>
            Admin
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-cream/70">{email}</span>
            <button onClick={logout} className="rounded-full bg-cream/15 px-3 py-1.5 font-bold">Logout</button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:grid lg:overflow-visible" aria-label="admin">
          {ADMIN_NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold ${pathname === n.href ? "bg-cocoa text-white" : "bg-white hover:bg-marigold/30"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
