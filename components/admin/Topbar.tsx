"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, ExternalLink, LogOut, Menu, Plus, Search } from "lucide-react";
import { COLLECTIONS } from "@/lib/content-registry";
import { NAV, metaFor } from "./nav";

const DEFS = Object.values(COLLECTIONS);

/** Closes a dropdown on outside click / Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

export default function Topbar({ unread, onMenu, onLogout }: { unread: number; onMenu: () => void; onLogout: () => void }) {
  const [palette, setPalette] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const newRef = useDismiss(newOpen, () => setNewOpen(false));
  const userRef = useDismiss(userOpen, () => setUserOpen(false));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="adm-top">
      <button type="button" className="adm-iconbtn adm-top-menu" onClick={onMenu} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <button type="button" className="adm-search" onClick={() => setPalette(true)}>
        <Search size={16} />
        <span>Search pages and actions…</span>
        <kbd className="adm-kbd">⌘K</kbd>
      </button>

      <div className="adm-top-actions">
        <div className="adm-dd" ref={newRef}>
          <button type="button" className="adm-btn primary" onClick={() => setNewOpen((o) => !o)} aria-expanded={newOpen} aria-haspopup="menu">
            <Plus size={16} />
            <span className="lbl">New</span>
          </button>
          {newOpen ? (
            <div className="adm-menu scroll" role="menu">
              <div className="adm-menu-h">Create new</div>
              {DEFS.map((def) => {
                const Icon = metaFor(def.key).icon;
                return (
                  <Link key={def.key} href={`/admin/content/${def.key}/new`} role="menuitem" onClick={() => setNewOpen(false)}>
                    <Icon size={16} /> {def.singular}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        <Link href="/admin/submissions?status=unread" className="adm-iconbtn" aria-label={`${unread} unread submissions`} title="Unread submissions">
          <Bell size={19} />
          {unread > 0 ? <span className="dot">{unread > 9 ? "9+" : unread}</span> : null}
        </Link>

        <div className="adm-dd" ref={userRef}>
          <button type="button" className="adm-user" onClick={() => setUserOpen((o) => !o)} aria-expanded={userOpen} aria-haspopup="menu">
            <span className="adm-avatar">AD</span>
            <span className="nm">Admin</span>
            <ChevronDown size={15} className="nm" />
          </button>
          {userOpen ? (
            <div className="adm-menu" role="menu">
              <a href="/" target="_blank" rel="noreferrer" role="menuitem" onClick={() => setUserOpen(false)}>
                <ExternalLink size={16} /> View website
              </a>
              <hr />
              <button
                type="button"
                role="menuitem"
                className="danger"
                onClick={() => {
                  setUserOpen(false);
                  onLogout();
                }}
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {palette ? <Palette onClose={() => setPalette(false)} /> : null}
    </header>
  );
}

function Palette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const entries = useMemo(
    () => [
      ...NAV.map((n) => ({ href: n.href, label: n.label, icon: n.icon, group: n.group === "Overview" ? "Page" : n.group })),
      ...DEFS.map((def) => ({ href: `/admin/content/${def.key}/new`, label: `New ${def.singular.toLowerCase()}`, icon: Plus, group: "Create" })),
    ],
    [],
  );
  const results = entries.filter((e) => e.label.toLowerCase().includes(q.trim().toLowerCase()));

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector(".on")?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  return (
    <div className="adm-overlay top" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-palette" role="dialog" aria-modal="true" aria-label="Quick search">
        <div className="in">
          <Search size={18} />
          <input
            autoFocus
            value={q}
            placeholder="Jump to a page or create something…"
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(results.length - 1, s + 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(0, s - 1));
              }
              if (e.key === "Enter" && results[sel]) go(results[sel].href);
            }}
          />
          <kbd className="adm-kbd">esc</kbd>
        </div>
        {results.length ? (
          <ul ref={listRef}>
            {results.map((r, i) => {
              const Icon = r.icon;
              return (
                <li key={r.href}>
                  <button type="button" className={i === sel ? "on" : ""} onMouseEnter={() => setSel(i)} onClick={() => go(r.href)}>
                    <Icon size={17} /> {r.label}
                    <span className="g">{r.group}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="none">No matches for “{q}”.</div>
        )}
      </div>
    </div>
  );
}
