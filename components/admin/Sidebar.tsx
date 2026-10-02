"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, X } from "lucide-react";
import { NAV, isActiveHref } from "./nav";

export default function Sidebar({ unread, onClose, onLogout }: { unread: number; onClose: () => void; onLogout: () => void }) {
  const pathname = usePathname() || "";
  let lastGroup = "";

  return (
    <aside className="adm-side" aria-label="Admin navigation">
      <div className="adm-brand">
        <Link href="/admin" style={{ textDecoration: "none", color: "inherit" }}>
          <b>മലർവാടി</b>
          <small>Admin</small>
        </Link>
        <button type="button" className="adm-iconbtn adm-side-close" onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <nav className="adm-nav">
        {NAV.map((item) => {
          const head = item.group !== lastGroup && item.group !== "Overview" ? item.group : null;
          lastGroup = item.group;
          const Icon = item.icon;
          const active = isActiveHref(pathname, item.href);
          return (
            <div key={item.href} style={{ display: "contents" }}>
              {head ? <div className="adm-navhead">{head}</div> : null}
              <Link href={item.href} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}>
                <Icon size={17} />
                {item.label}
                {item.href === "/admin/submissions" && unread > 0 ? <span className="count">{unread > 99 ? "99+" : unread}</span> : null}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="adm-side-foot">
        <a href="/" target="_blank" rel="noreferrer">
          <ExternalLink size={17} /> View site
        </a>
        <button type="button" onClick={onLogout}>
          <LogOut size={17} /> Log out
        </button>
      </div>
    </aside>
  );
}
