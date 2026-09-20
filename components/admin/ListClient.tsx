"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { CollectionDef } from "@/lib/content-registry";
import { api } from "./api";
import { useToast } from "./Toast";

type Doc = Record<string, unknown> & { _id: string };

export default function ListClient({ def }: { def: CollectionDef }) {
  const { show, toast } = useToast();
  const [items, setItems] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { items: rows } = await api<{ items: Doc[] }>(`/api/content/${def.key}?all=1`);
      setItems(def.sortable ? [...rows].sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)) : rows);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load items");
    } finally {
      setLoading(false);
    }
  }, [def.key, def.sortable]);

  useEffect(() => {
    void load();
  }, [load]);

  async function move(index: number, delta: number) {
    const to = index + delta;
    if (to < 0 || to >= items.length || busy) return;
    const next = [...items];
    const [row] = next.splice(index, 1);
    next.splice(to, 0, row);
    setItems(next);
    setBusy(true);
    try {
      await api(`/api/content/${def.key}/reorder`, {
        method: "POST",
        body: JSON.stringify({ ids: next.map((i) => i._id) }),
      });
      show("order saved");
    } catch (e) {
      show(e instanceof Error ? e.message : "Reorder failed", true);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: Doc) {
    const title = String(row[def.listTitle] ?? "") || def.singular;
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await api(`/api/content/${def.key}/${row._id}`, { method: "DELETE" });
      setItems((p) => p.filter((i) => i._id !== row._id));
      show("deleted");
    } catch (e) {
      show(e instanceof Error ? e.message : "Delete failed", true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{def.label}</h1>
          <p className="adm-sub">{loading ? "Loading…" : `${items.length} item${items.length === 1 ? "" : "s"}`}</p>
        </div>
        <Link href={`/admin/content/${def.key}/new`} className="adm-btn primary">New {def.singular.toLowerCase()}</Link>
      </div>

      {error ? <p className="adm-err">{error}</p> : null}

      <div className="adm-card pad0">
        {loading ? (
          <div className="adm-empty">Loading…</div>
        ) : items.length === 0 ? (
          <div className="adm-empty">Nothing here yet.</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                {def.sortable ? <th style={{ width: 92 }}>Order</th> : null}
                <th>Title</th>
                {def.publishable ? <th style={{ width: 120 }}>Status</th> : null}
                <th style={{ width: 160 }} />
              </tr>
            </thead>
            <tbody>
              {items.map((row, i) => {
                const title = String(row[def.listTitle] ?? "").trim();
                return (
                  <tr key={row._id}>
                    {def.sortable ? (
                      <td className="nowrap">
                        <button type="button" className="adm-btn sm" disabled={i === 0 || busy} onClick={() => move(i, -1)} aria-label="Move up">↑</button>{" "}
                        <button type="button" className="adm-btn sm" disabled={i === items.length - 1 || busy} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
                      </td>
                    ) : null}
                    <td>
                      <Link href={`/admin/content/${def.key}/${row._id}`}>{title || <em>(untitled)</em>}</Link>
                    </td>
                    {def.publishable ? (
                      <td>
                        <span className={`adm-pill ${row.published === false ? "off" : "on"}`}>
                          {row.published === false ? "Draft" : "Published"}
                        </span>
                      </td>
                    ) : null}
                    <td className="right">
                      <Link href={`/admin/content/${def.key}/${row._id}`} className="adm-btn sm">Edit</Link>{" "}
                      <button type="button" className="adm-btn sm ghostdanger" disabled={busy} onClick={() => remove(row)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {toast}
    </>
  );
}
