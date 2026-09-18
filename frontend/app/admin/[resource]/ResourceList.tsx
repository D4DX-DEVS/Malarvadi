"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { RESOURCES } from "@/lib/admin-resources";

function cell(doc: Record<string, unknown>, key: string): string {
  const v = doc[key];
  if (v && typeof v === "object") {
    const l = v as { en?: string; ml?: string };
    return l.en ?? "";
  }
  return String(v ?? "");
}

export function ResourceList({ resource }: { resource: string }) {
  const def = RESOURCES[resource];
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const j = await adminApi.list(resource, `?page=${page}&limit=20${q ? `&q=${encodeURIComponent(q)}` : ""}`);
      setItems(j.data as Record<string, unknown>[]);
      setPages(j.meta?.pages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setBusy(false);
    }
  }, [resource, page, q]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    try {
      await adminApi.remove(resource, id);
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  if (!def) return <p>Unknown resource.</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">{def.title}</h1>
        <Link href={`/admin/${resource}/new`} className="rounded-full bg-cocoa px-4 py-2 text-sm font-bold text-white">
          + New
        </Link>
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search…"
          className="min-h-[44px] w-full max-w-sm rounded-2xl border border-cocoa/15 bg-white px-4 text-[16px]"
        />
      </div>
      {error ? <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-4 overflow-x-auto rounded-card bg-white shadow-playful">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-cocoa/10 text-cocoa/60">
              <th className="px-4 py-3">Title / Slug</th>
              {def.listColumns.map((c) => (
                <th key={c.key} className="px-4 py-3">{c.label}</th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={String(d._id)} className="border-b border-cocoa/5 last:border-0">
                <td className="px-4 py-3 font-semibold">{cell(d, "title") || cell(d, "name") || cell(d, "slug")}</td>
                {def.listColumns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-cocoa/70">{cell(d, c.key)}</td>
                ))}
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/${resource}/${String(d._id)}`} className="mr-3 font-bold text-leaf">Edit</Link>
                  <button onClick={() => remove(String(d._id))} className="font-bold text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && !busy ? <p className="p-6 text-center text-sm text-cocoa/60">No items yet.</p> : null}
      </div>
      <div className="mt-4 flex items-center gap-3 text-sm">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-full bg-white px-4 py-2 font-bold disabled:opacity-40">← Prev</button>
        <span>Page {page} / {pages}</span>
        <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="rounded-full bg-white px-4 py-2 font-bold disabled:opacity-40">Next →</button>
      </div>
    </div>
  );
}
