"use client";
// Small shared admin UI pieces: pagination, empty/loading states, switch,
// debounced search, URL-synced list state and the unsaved-changes guard.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, type LucideIcon } from "lucide-react";
import { useConfirm } from "./Confirm";

export interface PageResult<T, C = Record<string, number>> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  counts: C;
}

/* ---------------- formatting ---------------- */

export function fmtDate(v?: string | null): string {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtDateTime(v?: string | null): string {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

export function timeAgo(v?: string | null): string {
  if (!v) return "";
  const s = Math.round((Date.now() - new Date(v).getTime()) / 1000);
  if (Number.isNaN(s)) return "";
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min${m === 1 ? "" : "s"} ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return fmtDate(v);
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] || "?").slice(0, 2)).toUpperCase();
}

export function submissionName(s: { data?: Record<string, string> }): string {
  const d = s.data || {};
  return d.name || d.email || d.phone || "Anonymous";
}

/* ---------------- URL-synced list state ---------------- */

/** Query-string backed state, so refresh / back keeps the page, tab and search. */
export function useUrlState<K extends string>(defaults: Record<K, string>) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() || "";
  const qs = sp?.toString() ?? "";
  const defaultsKey = JSON.stringify(defaults);

  const values = useMemo(() => {
    const d = JSON.parse(defaultsKey) as Record<K, string>;
    const cur = new URLSearchParams(qs);
    return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, cur.get(k) ?? v])) as Record<K, string>;
  }, [qs, defaultsKey]);

  const set = useCallback(
    (patch: Partial<Record<K, string>>) => {
      const d = JSON.parse(defaultsKey) as Record<K, string>;
      const next = new URLSearchParams(qs);
      for (const [k, v] of Object.entries(patch) as [K, string][]) {
        if (v === undefined || v === "" || v === d[k]) next.delete(k);
        else next.set(k, v);
      }
      const s = next.toString();
      router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
    },
    [qs, defaultsKey, pathname, router],
  );

  return [values, set] as const;
}

/* ---------------- unsaved changes ---------------- */

/**
 * While `dirty`, warns on tab close/reload and asks (in a modal) before any
 * in-app link navigates away. Returns a guarded navigate() for buttons.
 */
export function useUnsavedGuard(dirty: boolean) {
  const confirm = useConfirm();
  const router = useRouter();
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  const ask = useCallback(
    () =>
      confirm({
        title: "Discard unsaved changes?",
        message: "You have changes that have not been saved. If you leave now they will be lost.",
        confirmLabel: "Discard changes",
        cancelLabel: "Keep editing",
        tone: "danger",
      }),
    [confirm],
  );

  useEffect(() => {
    if (!dirty) return;
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const onClick = (e: MouseEvent) => {
      if (!dirtyRef.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      e.preventDefault();
      e.stopPropagation();
      void ask().then((ok) => {
        if (ok) {
          dirtyRef.current = false;
          router.push(url.pathname + url.search);
        }
      });
    };
    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty, ask, router]);

  return useCallback(
    async (href: string, force = false) => {
      if (!force && dirtyRef.current && !(await ask())) return;
      dirtyRef.current = false;
      router.push(href);
    },
    [ask, router],
  );
}

/* ---------------- components ---------------- */

export function SearchBox({ value, onChange, placeholder = "Search…" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [text, setText] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => setText(value), [value]);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return (
    <label className="adm-searchbox">
      <Search size={16} />
      <input
        type="search"
        value={text}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => {
          const v = e.target.value;
          setText(v);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => onChange(v.trim()), 350);
        }}
      />
    </label>
  );
}

export function Pagination({
  page,
  pages,
  total,
  limit,
  onPage,
  onLimit,
  noun = "items",
}: {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
  onLimit?: (n: number) => void;
  noun?: string;
}) {
  if (!total) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);
  const nums: (number | "…")[] = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) nums.push(p);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  return (
    <nav className="adm-pager" aria-label="Pagination">
      <span>
        Showing <b>{from}</b>–<b>{to}</b> of <b>{total}</b> {noun}
      </span>
      <div className="pages">
        <button type="button" className="pg" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
          <ChevronLeft size={16} />
        </button>
        {nums.map((n, i) =>
          n === "…" ? (
            <span key={`g${i}`} className="gap">…</span>
          ) : (
            <button key={n} type="button" className={`pg${n === page ? " on" : ""}`} aria-current={n === page ? "page" : undefined} onClick={() => onPage(n)}>
              {n}
            </button>
          ),
        )}
        <button type="button" className="pg" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page">
          <ChevronRight size={16} />
        </button>
      </div>
      {onLimit ? (
        <label className="size">
          Rows
          <select value={limit} onChange={(e) => onLimit(Number(e.target.value))}>
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      ) : null}
    </nav>
  );
}

export function EmptyState({ icon: Icon, title, text, children }: { icon: LucideIcon; title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="adm-empty">
      <div className="ic">
        <Icon size={24} />
      </div>
      <b>{title}</b>
      {text ? <p>{text}</p> : null}
      {children}
    </div>
  );
}

export function SkeletonRows({ rows = 5, thumb = true }: { rows?: number; thumb?: boolean }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div className="adm-skel-row" key={i}>
          {thumb ? <div className="adm-skel" style={{ width: 64, height: 46 }} /> : null}
          <div style={{ flex: 1 }}>
            <div className="adm-skel" style={{ width: `${55 - (i % 3) * 10}%`, height: 14, marginBottom: 8 }} />
            <div className="adm-skel" style={{ width: "28%", height: 11 }} />
          </div>
          <div className="adm-skel" style={{ width: 70, height: 22, borderRadius: 999 }} />
        </div>
      ))}
    </div>
  );
}

export function Switch({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label?: string; id?: string }) {
  return (
    <label className="adm-switch">
      <input id={id} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" />
      {label ? <span className="lbl">{label}</span> : null}
    </label>
  );
}
