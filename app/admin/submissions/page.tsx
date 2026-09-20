"use client";
import { useCallback, useEffect, useState } from "react";
import type { Submission } from "@/lib/types";
import { api } from "@/components/admin/api";
import { useToast } from "@/components/admin/Toast";

const TABS = [
  { value: "", label: "All" },
  { value: "contact", label: "Contact" },
  { value: "join", label: "Join" },
  { value: "newsletter", label: "Newsletter" },
];

export default function SubmissionsPage() {
  const { show, toast } = useToast();
  const [kind, setKind] = useState("");
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (k: string) => {
    setLoading(true);
    try {
      const { items: rows } = await api<{ items: Submission[] }>(`/api/submissions${k ? `?kind=${encodeURIComponent(k)}` : ""}`);
      setItems(rows);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load submissions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(kind);
  }, [kind, load]);

  async function remove(row: Submission) {
    if (!confirm("Delete this submission?")) return;
    try {
      await api(`/api/submissions/${row._id}`, { method: "DELETE" });
      setItems((p) => p.filter((i) => i._id !== row._id));
      show("deleted");
    } catch (e) {
      show(e instanceof Error ? e.message : "Delete failed", true);
    }
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Submissions</h1>
          <p className="adm-sub">Contact messages, join requests and newsletter sign-ups.</p>
        </div>
      </div>

      <div className="adm-tabs">
        {TABS.map((t) => (
          <button
            key={t.value || "all"}
            type="button"
            className={`adm-tab${kind === t.value ? " is-active" : ""}`}
            onClick={() => setKind(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? <p className="adm-err">{error}</p> : null}

      <div className="adm-card pad0">
        {loading ? (
          <div className="adm-empty">Loading…</div>
        ) : items.length === 0 ? (
          <div className="adm-empty">No submissions.</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 180 }}>Received</th>
                <th style={{ width: 110 }}>Kind</th>
                <th>Data</th>
                <th style={{ width: 90 }} />
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id}>
                  <td className="nowrap">{s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}</td>
                  <td className="nowrap">{s.kind}</td>
                  <td className="adm-kv">
                    {Object.entries(s.data || {}).map(([k, v]) => (
                      <div key={k}>
                        <b>{k}:</b> {String(v)}
                      </div>
                    ))}
                  </td>
                  <td className="right">
                    <button type="button" className="adm-btn sm ghostdanger" onClick={() => remove(s)}>Delete</button>
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
