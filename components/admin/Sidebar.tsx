"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { COLLECTIONS } from "@/lib/content-registry";
import { api } from "./api";

const COLLECTION_ENTRIES = Object.values(COLLECTIONS);

export default function Sidebar() {
  const pathname = usePathname() || "";
  const router = useRouter();

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  async function logout() {
    try {
      await api<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
    } catch {
      /* logging out is best-effort */
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <aside className="adm-side">
      <div className="adm-brand">
        മലർവാടി
        <small>Content admin</small>
      </div>

      <nav className="adm-nav">
        <Link href="/admin" className={isActive("/admin") ? "is-active" : ""}>Dashboard</Link>
        <Link href="/admin/home" className={isActive("/admin/home") ? "is-active" : ""}>Home sections</Link>
        <Link href="/admin/settings" className={isActive("/admin/settings") ? "is-active" : ""}>Site settings</Link>

        <div className="adm-navhead">Content</div>
        {COLLECTION_ENTRIES.map((def) => (
          <Link
            key={def.key}
            href={`/admin/content/${def.key}`}
            className={isActive(`/admin/content/${def.key}`) ? "is-active" : ""}
          >
            {def.label}
          </Link>
        ))}

        <div className="adm-navhead">Inbox</div>
        <Link href="/admin/submissions" className={isActive("/admin/submissions") ? "is-active" : ""}>Submissions</Link>
      </nav>

      <div className="adm-side-foot">
        <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
        <button type="button" className="adm-logout" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}
