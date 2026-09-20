"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { COLLECTIONS } from "@/lib/content-registry";
import type { BaseDoc, Submission } from "@/lib/types";
import { api } from "@/components/admin/api";
import { useToast } from "@/components/admin/Toast";

const DEFS = Object.values(COLLECTIONS);

interface Counts {
  total: number;
  unpublished: number;
}

export default function AdminDashboard() {
  const { show, toast } = useToast();
  const [counts, setCounts] = useState<Record<string, Counts>>({});
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const next: Record<string, Counts> = {};
    await Promise.all(
      DEFS.map(async (def) => {
        try {
          const { items } = await api<{ items: BaseDoc[] }>(`/api/content/${def.key}?all=1`);
          next[def.key] = {
            total: items.length,
            unpublished: items.filter((i) => i.published === false).length,
          };
        } catch {
          next[def.key] = { total: 0, unpublished: 0 };
        }
      }),
    );
    setCounts(next);
    try {
      const { items } = await api<{ items: Submission[] }>("/api/submissions");
      setSubs(items.slice(0, 5));
    } catch {
      setSubs([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function seed() {
    if (!confirm("Seed default content? This inserts the starter documents into empty collections.")) return;
    setSeeding(true);
    try {
      const res = await api<{ ok: boolean; counts: Record<string, number> }>("/api/admin/seed", { method: "POST" });
      const summary = Object.entries(res.counts || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      show(summary ? `Seeded — ${summary}` : "Seeded");
      await load();
    } catch (e) {
      show(e instanceof Error ? e.message : "Seed failed", true);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Dashboard</h1>
          <p className="adm-sub">{loading ? "Loading content…" : "Content overview"}</p>
        </div>
        <button type="button" className="adm-btn primary" onClick={seed} disabled={seeding}>
          {seeding ? "Seeding…" : "Seed default content"}
        </button>
      </div>

      <div className="adm-grid" style={{ marginBottom: 20 }}>
        {DEFS.map((def) => {
          const c = counts[def.key];
          return (
            <Link key={def.key} href={`/admin/content/${def.key}`} className="adm-card adm-stat">
              <div className="n">{c ? c.total : "—"}</div>
              <div className="l">{def.label}</div>
              {c && c.unpublished > 0 ? <div className="w">{c.unpublished} unpublished</div> : null}
            </Link>
          );
        })}
      </div>

      <div className="adm-card pad0">
        <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Latest submissions</h2>
          <Link href="/admin/submissions" className="adm-btn sm">View all</Link>
        </div>
        {subs.length === 0 ? (
          <div className="adm-empty">{loading ? "Loading…" : "No submissions yet."}</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Kind</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s._id}>
                  <td className="nowrap">{s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}</td>
                  <td className="nowrap">{s.kind}</td>
                  <td className="adm-kv">
                    {Object.entries(s.data || {}).map(([k, v]) => (
                      <span key={k} style={{ marginRight: 10 }}>
                        <b>{k}:</b> {String(v)}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {toast}
    </>
  );
}
