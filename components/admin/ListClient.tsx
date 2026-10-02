"use client";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, GripVertical, ImageIcon, LayoutGrid, List, LoaderCircle, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import type { CollectionDef } from "@/lib/content-registry";
import { api } from "./api";
import { useToast } from "./Toast";
import { confirmDelete, useConfirm } from "./Confirm";
import { metaFor } from "./nav";
import { EmptyState, Pagination, SearchBox, SkeletonRows, fmtDate, timeAgo, useUrlState, type PageResult } from "./ui";

type Doc = Record<string, unknown> & { _id: string; published?: boolean; updatedAt?: string };
type Counts = { all: number; published: number; draft: number };

/** Remembers the list URL (page, tab, search) so the editor can return to it. */
export const listReturnKey = (key: string) => `adm:list:${key}`;

const META_FIELDS = ["date", "role", "year", "month", "category", "platform", "kicker", "tagline", "meta", "note"];

export default function ListClient(props: { def: CollectionDef }) {
  return (
    <Suspense fallback={<div className="adm-card pad0"><SkeletonRows /></div>}>
      <List_ {...props} />
    </Suspense>
  );
}

function List_({ def }: { def: CollectionDef }) {
  const toast = useToast();
  const confirm = useConfirm();
  const imageField = def.fields.find((f) => f.type === "image")?.name;
  const isGallery = def.key === "gallery";
  const [params, setParams] = useUrlState({ page: "1", limit: "20", q: "", status: "", view: isGallery ? "grid" : "list" });
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 20;

  const [data, setData] = useState<PageResult<Doc, Counts> | null>(null);
  const [items, setItems] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // drag state
  const dragFrom = useRef<"grip" | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<{ id: string; after: boolean } | null>(null);

  const query = useMemo(() => {
    const sp = new URLSearchParams({ all: "1", page: String(page), limit: String(limit) });
    if (params.q) sp.set("q", params.q);
    if (params.status) sp.set("status", params.status);
    return sp.toString();
  }, [page, limit, params.q, params.status]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<PageResult<Doc, Counts>>(`/api/content/${def.key}?${query}`);
      // Deleting the last row of the last page leaves us past the end.
      if (!res.items.length && res.page > 1 && res.total > 0) {
        setParams({ page: String(res.pages) });
        return;
      }
      setData(res);
      setItems(res.items);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load items");
    } finally {
      setLoading(false);
    }
  }, [def.key, query, setParams]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setSelected(new Set());
  }, [query]);

  useEffect(() => {
    try {
      sessionStorage.setItem(listReturnKey(def.key), `${location.pathname}${location.search}`);
    } catch {
      /* storage unavailable */
    }
  }, [def.key, params]);

  const canReorder = def.sortable && !params.q && !params.status;
  const offset = (page - 1) * limit;
  const view = imageField && params.view === "grid" ? "grid" : "list";

  async function persistOrder(next: Doc[]) {
    const prev = items;
    setItems(next);
    setBusy(true);
    try {
      await api(`/api/content/${def.key}/reorder`, { method: "POST", body: JSON.stringify({ ids: next.map((i) => i._id), offset }) });
      toast("Order saved");
    } catch (e) {
      setItems(prev);
      toast(e instanceof Error ? e.message : "Reorder failed", true);
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, delta: number) {
    const to = index + delta;
    if (to < 0 || to >= items.length || busy) return;
    const next = [...items];
    const [row] = next.splice(index, 1);
    next.splice(to, 0, row);
    void persistOrder(next);
  }

  function dropOn(targetId: string, after: boolean) {
    if (!dragId || dragId === targetId) return;
    const next = items.filter((i) => i._id !== dragId);
    const moving = items.find((i) => i._id === dragId);
    let at = next.findIndex((i) => i._id === targetId);
    if (!moving || at < 0) return;
    if (after) at += 1;
    next.splice(at, 0, moving);
    if (next.every((d, i) => d._id === items[i]._id)) return;
    void persistOrder(next);
  }

  function dragProps(id: string, horizontal = false) {
    if (!canReorder) return {};
    return {
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        if (dragFrom.current !== "grip" && !horizontal) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", id);
        setDragId(id);
      },
      onDragOver: (e: React.DragEvent) => {
        if (!dragId) return;
        e.preventDefault();
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const after = horizontal ? e.clientX > r.left + r.width / 2 : e.clientY > r.top + r.height / 2;
        if (over?.id !== id || over.after !== after) setOver({ id, after });
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        if (over) dropOn(over.id, over.after);
        setDragId(null);
        setOver(null);
      },
      onDragEnd: () => {
        dragFrom.current = null;
        setDragId(null);
        setOver(null);
      },
    };
  }

  const dragClass = (id: string) =>
    `${dragId === id ? " dragging" : ""}${over?.id === id && dragId !== id ? (over.after ? " dropafter" : " dropbefore") : ""}`;

  function titleOf(row: Doc) {
    return String(row[def.listTitle] ?? "").trim();
  }

  async function remove(row: Doc) {
    if (!(await confirm(confirmDelete(def.singular.toLowerCase(), titleOf(row) || undefined)))) return;
    setBusy(true);
    try {
      await api(`/api/content/${def.key}/${row._id}`, { method: "DELETE" });
      toast(`${def.singular} deleted`);
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", true);
    } finally {
      setBusy(false);
    }
  }

  async function removeSelected() {
    const n = selected.size;
    const ok = await confirm({
      ...confirmDelete(`${n} ${n === 1 ? def.singular.toLowerCase() : "items"}`),
      message: `${n} selected ${n === 1 ? "item" : "items"} will be permanently removed. This action cannot be undone.`,
      confirmLabel: `Delete ${n}`,
    });
    if (!ok) return;
    setBusy(true);
    try {
      const res = await api<{ deleted: number }>(`/api/content/${def.key}`, { method: "DELETE", body: JSON.stringify({ ids: Array.from(selected) }) });
      toast(`${res.deleted} deleted`);
      setSelected(new Set());
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", true);
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhotos(files: File[]) {
    if (!files.length) return;
    setUploading({ done: 0, total: files.length });
    let ok = 0;
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const { url } = await api<{ url: string }>("/api/upload", { method: "POST", body: fd });
        await api(`/api/content/${def.key}`, { method: "POST", body: JSON.stringify({ src: url, category: "photos", caption: "", published: true }) });
        ok += 1;
      } catch (e) {
        toast(`${file.name}: ${e instanceof Error ? e.message : "upload failed"}`, true);
      }
      setUploading((u) => (u ? { ...u, done: u.done + 1 } : u));
    }
    setUploading(null);
    if (ok) toast(`${ok} photo${ok === 1 ? "" : "s"} uploaded`);
    await load();
  }

  function toggle(id: string) {
    setSelected((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  const allSelected = items.length > 0 && items.every((i) => selected.has(i._id));
  const counts = data?.counts;
  const { icon: CollIcon } = metaFor(def.key);
  const newHref = `/admin/content/${def.key}/new`;

  function metaLine(row: Doc) {
    const bits: string[] = [];
    for (const f of META_FIELDS) {
      const v = row[f];
      if (v == null || v === "" || !def.fields.some((d) => d.name === f)) continue;
      bits.push(f === "date" ? fmtDate(String(v)) : String(v));
      if (bits.length >= 2) break;
    }
    return bits;
  }

  const tabs = def.publishable
    ? [
        { v: "", l: "All", c: counts?.all },
        { v: "published", l: "Published", c: counts?.published },
        { v: "draft", l: "Drafts", c: counts?.draft },
      ]
    : [];

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{def.label}</h1>
          <p className="adm-sub">
            {data ? `${data.counts.all} ${data.counts.all === 1 ? def.singular.toLowerCase() : "items"}` : "Loading…"}
            {canReorder && items.length > 1 ? ` · drag ${view === "grid" ? "photos" : "rows"} to reorder` : ""}
          </p>
        </div>
        <div className="adm-head-actions">
          {isGallery ? (
            <>
              <input
                ref={fileRef}
                type="file"
                multiple
                hidden
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  e.target.value = "";
                  void uploadPhotos(files);
                }}
              />
              <button type="button" className="adm-btn" onClick={() => fileRef.current?.click()} disabled={!!uploading}>
                {uploading ? <LoaderCircle size={16} className="adm-spin" /> : <Upload size={16} />}
                {uploading ? `Uploading ${uploading.done}/${uploading.total}…` : "Upload photos"}
              </button>
            </>
          ) : null}
          <Link href={newHref} className="adm-btn primary">
            <Plus size={16} /> New {def.singular.toLowerCase()}
          </Link>
        </div>
      </div>

      {error ? <p className="adm-err">{error}</p> : null}

      <div className="adm-card pad0">
        <div className="adm-toolbar">
          {tabs.length ? (
            <div className="adm-tabs" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.v || "all"}
                  type="button"
                  role="tab"
                  aria-selected={params.status === t.v}
                  className={`adm-tab${params.status === t.v ? " is-active" : ""}`}
                  onClick={() => setParams({ status: t.v, page: "1" })}
                >
                  {t.l} {t.c != null ? <span className="c">{t.c}</span> : null}
                </button>
              ))}
            </div>
          ) : null}
          <SearchBox value={params.q} onChange={(q) => setParams({ q, page: "1" })} placeholder={`Search ${def.label.toLowerCase()}…`} />
          {imageField ? (
            <div className="adm-seg" role="group" aria-label="View">
              <button type="button" className={view === "list" ? "on" : ""} onClick={() => setParams({ view: "list" })} aria-label="List view" aria-pressed={view === "list"}>
                <List size={17} />
              </button>
              <button type="button" className={view === "grid" ? "on" : ""} onClick={() => setParams({ view: "grid" })} aria-label="Grid view" aria-pressed={view === "grid"}>
                <LayoutGrid size={17} />
              </button>
            </div>
          ) : null}
        </div>

        {selected.size > 0 ? (
          <div className="adm-bulk">
            {selected.size} selected
            <button type="button" className="adm-btn sm ghost" onClick={() => setSelected(new Set())}>
              <X size={14} /> Clear
            </button>
            <span className="adm-spacer" />
            <button type="button" className="adm-btn sm danger" onClick={removeSelected} disabled={busy}>
              <Trash2 size={14} /> Delete selected
            </button>
          </div>
        ) : items.length > 0 ? (
          <div className="adm-bulk" style={{ background: "var(--adm-soft)", borderColor: "var(--adm-line)", color: "var(--adm-muted)", fontWeight: 500 }}>
            <label className="adm-check" style={{ fontSize: 13 }}>
              <input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? new Set() : new Set(items.map((i) => i._id)))} />
              Select all on this page
            </label>
            {def.sortable && !canReorder ? <span style={{ marginLeft: "auto" }}>Clear search and filters to reorder</span> : null}
          </div>
        ) : null}

        {loading && !data ? (
          <SkeletonRows thumb={Boolean(imageField)} />
        ) : items.length === 0 ? (
          params.q || params.status ? (
            <EmptyState icon={CollIcon} title="No matching items" text={params.q ? `Nothing matches “${params.q}”.` : "Nothing in this tab yet."}>
              <button type="button" className="adm-btn" onClick={() => setParams({ q: "", status: "", page: "1" })}>Clear filters</button>
            </EmptyState>
          ) : (
            <EmptyState icon={CollIcon} title={`No ${def.label.toLowerCase()} yet`} text={`Create your first ${def.singular.toLowerCase()} to get started.`}>
              <Link href={newHref} className="adm-btn primary"><Plus size={16} /> New {def.singular.toLowerCase()}</Link>
            </EmptyState>
          )
        ) : view === "grid" ? (
          <div className="adm-gridview" style={{ opacity: loading ? 0.6 : 1 }}>
            {items.map((row) => {
              const src = imageField ? String(row[imageField] ?? "") : "";
              const title = titleOf(row);
              const href = `/admin/content/${def.key}/${row._id}`;
              return (
                <div key={row._id} className={`adm-gtile${selected.has(row._id) ? " sel" : ""}${dragClass(row._id)}`} {...dragProps(row._id, true)}>
                  <Link href={href} draggable={false}>
                    {src ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img className="img" src={src} alt={title} loading="lazy" draggable={false} />
                    ) : (
                      <div className="noimg"><ImageIcon size={28} /></div>
                    )}
                  </Link>
                  <label className="cb">
                    <input type="checkbox" className="adm-cb" checked={selected.has(row._id)} onChange={() => toggle(row._id)} aria-label="Select" />
                  </label>
                  {def.publishable && row.published === false ? <span className="st adm-badge off">Draft</span> : null}
                  <div className="ft">
                    <Link href={href} className="cap ml">{title || "No caption"}</Link>
                    <Link href={href} className="adm-btn icon sm ghost" aria-label="Edit"><Pencil size={14} /></Link>
                    <button type="button" className="adm-btn icon sm ghost" style={{ color: "var(--adm-danger)" }} onClick={() => remove(row)} disabled={busy} aria-label="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            {uploading
              ? Array.from({ length: uploading.total - uploading.done }, (_, i) => (
                  <div key={`u${i}`} className="adm-gtile uploading">
                    <span><LoaderCircle size={22} className="adm-spin" /><br />Uploading…</span>
                  </div>
                ))
              : null}
          </div>
        ) : (
          <ul className="adm-rows" style={{ opacity: loading ? 0.6 : 1 }}>
            {items.map((row, i) => {
              const title = titleOf(row);
              const src = imageField ? String(row[imageField] ?? "") : "";
              const href = `/admin/content/${def.key}/${row._id}`;
              return (
                <li key={row._id} className={`adm-row${selected.has(row._id) ? " sel" : ""}${dragClass(row._id)}`} {...dragProps(row._id)}>
                  <input type="checkbox" className="adm-cb" checked={selected.has(row._id)} onChange={() => toggle(row._id)} aria-label={`Select ${title}`} />
                  {canReorder ? (
                    <>
                      <span
                        className="adm-grip"
                        title="Drag to reorder"
                        onPointerDown={() => {
                          dragFrom.current = "grip";
                        }}
                        onPointerUp={() => {
                          dragFrom.current = null;
                        }}
                      >
                        <GripVertical size={16} />
                      </span>
                      <span className="adm-ord">
                        <button type="button" disabled={i === 0 || busy} onClick={() => move(i, -1)} aria-label="Move up"><ChevronUp size={14} /></button>
                        <button type="button" disabled={i === items.length - 1 || busy} onClick={() => move(i, 1)} aria-label="Move down"><ChevronDown size={14} /></button>
                      </span>
                    </>
                  ) : null}
                  {imageField ? (
                    src ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img className="adm-row-thumb" src={src} alt="" loading="lazy" draggable={false} />
                    ) : (
                      <span className="adm-row-thumb"><ImageIcon size={18} /></span>
                    )
                  ) : null}
                  <div className="adm-row-main">
                    <Link href={href} className="adm-row-title" draggable={false}>
                      {title || <em style={{ color: "var(--adm-faint)" }}>(untitled)</em>}
                    </Link>
                    <div className="adm-row-meta">
                      {metaLine(row).map((b, bi) => (
                        <span key={bi} className="ml">{b}{" · "}</span>
                      ))}
                      <span>Updated {timeAgo(row.updatedAt) || "—"}</span>
                    </div>
                  </div>
                  {def.publishable ? (
                    <span className={`adm-badge dot ${row.published === false ? "off" : "on"}`}>{row.published === false ? "Draft" : "Published"}</span>
                  ) : null}
                  <div className="adm-row-actions">
                    <Link href={href} className="adm-btn icon sm" aria-label="Edit" title="Edit"><Pencil size={15} /></Link>
                    <button type="button" className="adm-btn icon sm ghostdanger" onClick={() => remove(row)} disabled={busy} aria-label="Delete" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {data ? (
          <Pagination
            page={data.page}
            pages={data.pages}
            total={data.total}
            limit={data.limit}
            noun={def.label.toLowerCase()}
            onPage={(p) => setParams({ page: String(p) })}
            onLimit={(n) => setParams({ limit: String(n), page: "1" })}
          />
        ) : null}
      </div>
    </>
  );
}
