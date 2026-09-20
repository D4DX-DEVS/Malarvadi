"use client";
import { useEffect, useState } from "react";
import { HOME_SECTION_DEFS } from "@/lib/content-registry";
import { api } from "@/components/admin/api";
import { useToast } from "@/components/admin/Toast";

interface Row {
  key: string;
  enabled: boolean;
  order: number;
  title: string;
  subtitle: string;
}

const DEF_BY_KEY = Object.fromEntries(HOME_SECTION_DEFS.map((d) => [d.key, d]));

export default function HomeSectionsPage() {
  const { show, toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { sections } = await api<{ sections: Row[] }>("/api/home-sections");
        setRows([...sections].sort((a, b) => a.order - b.order));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load sections");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function patch(index: number, next: Partial<Row>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...next } : r)));
    setDirty(true);
  }

  function move(index: number, delta: number) {
    setRows((prev) => {
      const to = index + delta;
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [row] = next.splice(index, 1);
      next.splice(to, 0, row);
      return next;
    });
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const payload = rows.map((r, i) => ({ ...r, order: i }));
      const { sections } = await api<{ sections: Row[] }>("/api/home-sections", {
        method: "PUT",
        body: JSON.stringify({ sections: payload }),
      });
      setRows([...sections].sort((a, b) => a.order - b.order));
      setDirty(false);
      show("saved");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      setError(msg);
      show(msg, true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Home sections</h1>
          <p className="adm-sub">Reorder, enable/disable and retitle the blocks on the home page.</p>
        </div>
        <button type="button" className="adm-btn primary" onClick={save} disabled={saving || loading || !rows.length}>
          {saving ? "Saving…" : dirty ? "Save changes" : "Save"}
        </button>
      </div>

      {error ? <p className="adm-err">{error}</p> : null}

      <div className="adm-card">
        {loading ? (
          <div className="adm-empty">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="adm-empty">No sections found. Try seeding default content from the dashboard.</div>
        ) : (
          rows.map((row, i) => {
            const def = DEF_BY_KEY[row.key];
            const fixed = Boolean(def?.fixedTitle);
            return (
              <div className="adm-secrow" key={row.key}>
                <div className="ord">
                  <button type="button" className="adm-btn sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                  <button type="button" className="adm-btn sm" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Move down">↓</button>
                </div>
                <div>
                  <div className="hd">
                    <span className="name">{def?.label || row.key}</span>
                    <span className="key">{row.key}</span>
                    <label className="adm-check" style={{ marginLeft: "auto" }}>
                      <input
                        type="checkbox"
                        checked={row.enabled}
                        onChange={(e) => patch(i, { enabled: e.target.checked })}
                      />
                      Enabled
                    </label>
                  </div>
                  <div className="adm-row2">
                    <div className="adm-field" style={{ marginBottom: 0 }}>
                      <label>Title</label>
                      <input
                        type="text"
                        value={fixed ? "" : row.title || ""}
                        disabled={fixed}
                        placeholder={fixed ? "fixed by design" : ""}
                        onChange={(e) => patch(i, { title: e.target.value })}
                      />
                    </div>
                    <div className="adm-field" style={{ marginBottom: 0 }}>
                      <label>Subtitle</label>
                      <input
                        type="text"
                        value={fixed ? "" : row.subtitle || ""}
                        disabled={fixed}
                        placeholder={fixed ? "fixed by design" : ""}
                        onChange={(e) => patch(i, { subtitle: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {toast}
    </>
  );
}
