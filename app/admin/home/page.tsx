"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarRange, ChartColumn, ChevronDown, ChevronUp, ExternalLink, GripVertical, Heart, House, Images, LoaderCircle,
  Newspaper, PanelsTopLeft, PenLine, Presentation, Smartphone, Sparkles, Undo2, UserPlus, Users, Video, type LucideIcon,
} from "lucide-react";
import { HOME_SECTION_DEFS } from "@/lib/content-registry";
import { api } from "@/components/admin/api";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/Confirm";
import { EmptyState, SkeletonRows, Switch, useUnsavedGuard } from "@/components/admin/ui";

interface Row {
  key: string;
  enabled: boolean;
  order: number;
  title: string;
  subtitle: string;
}

const DEF_BY_KEY = Object.fromEntries(HOME_SECTION_DEFS.map((d) => [d.key, d]));

const SECTION_ICON: Record<string, [LucideIcon, string]> = {
  hero: [PanelsTopLeft, "teal"],
  programs: [Sparkles, "purple"],
  about: [Users, "blue"],
  stats: [ChartColumn, "orange"],
  monthlyPrograms: [CalendarRange, "red"],
  news: [Newspaper, "blue"],
  videos: [Video, "orange"],
  posters: [Presentation, "purple"],
  gallery: [Images, "teal"],
  features: [Heart, "pink"],
  app: [Smartphone, "blue"],
  blog: [PenLine, "teal"],
  join: [UserPlus, "pink"],
};

const sortRows = (rows: Row[]) => [...rows].sort((a, b) => a.order - b.order);

export default function HomeSectionsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [rows, setRows] = useState<Row[]>([]);
  const [saved, setSaved] = useState("[]");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const dragFrom = useRef<"grip" | null>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [over, setOver] = useState<{ key: string; after: boolean } | null>(null);

  const dirty = useMemo(() => JSON.stringify(rows) !== saved, [rows, saved]);
  useUnsavedGuard(dirty && !saving);

  useEffect(() => {
    (async () => {
      try {
        const { sections } = await api<{ sections: Row[] }>("/api/home-sections");
        const sorted = sortRows(sections);
        setRows(sorted);
        setSaved(JSON.stringify(sorted));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load sections");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function patch(key: string, next: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...next } : r)));
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
  }

  function drop(targetKey: string, after: boolean) {
    setRows((prev) => {
      const moving = prev.find((r) => r.key === dragKey);
      if (!moving || dragKey === targetKey) return prev;
      const next = prev.filter((r) => r.key !== dragKey);
      let at = next.findIndex((r) => r.key === targetKey);
      if (at < 0) return prev;
      if (after) at += 1;
      next.splice(at, 0, moving);
      return next;
    });
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
      const sorted = sortRows(sections);
      setRows(sorted);
      setSaved(JSON.stringify(sorted));
      toast("Home page updated");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      setError(msg);
      toast(msg, true);
    } finally {
      setSaving(false);
    }
  }

  async function discard() {
    const ok = await confirm({
      title: "Discard changes?",
      message: "Your unsaved changes to the home page sections will be lost.",
      confirmLabel: "Discard",
      tone: "danger",
      icon: Undo2,
    });
    if (ok) setRows(JSON.parse(saved));
  }

  const enabledCount = rows.filter((r) => r.enabled).length;

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Home page</h1>
          <p className="adm-sub">
            Drag to reorder, switch sections on or off and edit their headings
            {rows.length ? ` · ${enabledCount} of ${rows.length} enabled` : ""}
          </p>
        </div>
        <div className="adm-head-actions">
          {dirty ? <span className="adm-dirty">Unsaved changes</span> : null}
          <a href="/" target="_blank" rel="noreferrer" className="adm-btn">
            <ExternalLink size={16} /> Preview website
          </a>
          {dirty ? (
            <button type="button" className="adm-btn ghost" onClick={discard} disabled={saving}>
              Discard
            </button>
          ) : null}
          <button type="button" className="adm-btn primary" onClick={save} disabled={saving || loading || !dirty}>
            {saving ? <LoaderCircle size={16} className="adm-spin" /> : null}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {error ? <p className="adm-err">{error}</p> : null}

      <div className="adm-card pad0">
        {loading ? (
          <SkeletonRows rows={6} />
        ) : rows.length === 0 ? (
          <EmptyState icon={House} title="No sections found" text="Seed the default content from the dashboard to create the home page sections." />
        ) : (
          <ul className="adm-secs">
            {rows.map((row, i) => {
              const def = DEF_BY_KEY[row.key];
              const fixed = Boolean(def?.fixedTitle);
              const [Icon, tone] = SECTION_ICON[row.key] || [House, "teal"];
              const isOpen = open === row.key;
              const cls = `adm-sec${row.enabled ? "" : " off"}${dragKey === row.key ? " dragging" : ""}${
                over?.key === row.key && dragKey !== row.key ? (over.after ? " dropafter" : " dropbefore") : ""
              }`;
              return (
                <li
                  key={row.key}
                  className={cls}
                  draggable
                  onDragStart={(e) => {
                    if (dragFrom.current !== "grip") {
                      e.preventDefault();
                      return;
                    }
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", row.key);
                    setDragKey(row.key);
                  }}
                  onDragOver={(e) => {
                    if (!dragKey) return;
                    e.preventDefault();
                    const r = e.currentTarget.getBoundingClientRect();
                    const after = e.clientY > r.top + r.height / 2;
                    if (over?.key !== row.key || over.after !== after) setOver({ key: row.key, after });
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (over) drop(over.key, over.after);
                    setDragKey(null);
                    setOver(null);
                  }}
                  onDragEnd={() => {
                    dragFrom.current = null;
                    setDragKey(null);
                    setOver(null);
                  }}
                >
                  <div className="adm-sec-row">
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
                      <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ChevronUp size={14} /></button>
                      <button type="button" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Move down"><ChevronDown size={14} /></button>
                    </span>
                    <span className={`adm-sec-ic tone-${tone}`}>
                      <Icon size={20} />
                    </span>
                    <div className="adm-sec-main">
                      <div className="nm">{def?.label || row.key}</div>
                      <div className="sb ml">{fixed ? "Layout section — heading fixed by design" : row.title || "No heading"}</div>
                    </div>
                    <Switch checked={row.enabled} onChange={(v) => patch(row.key, { enabled: v })} label={row.enabled ? "Enabled" : "Hidden"} />
                    {!fixed ? (
                      <button
                        type="button"
                        className="adm-btn icon sm ghost"
                        onClick={() => setOpen(isOpen ? null : row.key)}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? "Close heading editor" : "Edit heading"}
                        title="Edit heading"
                      >
                        {isOpen ? <ChevronUp size={16} /> : <PenLine size={15} />}
                      </button>
                    ) : (
                      <span style={{ width: 30 }} />
                    )}
                  </div>
                  {isOpen && !fixed ? (
                    <div className="adm-sec-body">
                      <div className="adm-row2">
                        <div className="adm-field" style={{ marginBottom: 0 }}>
                          <label htmlFor={`t-${row.key}`}>Title</label>
                          <input id={`t-${row.key}`} className="ml" type="text" value={row.title || ""} onChange={(e) => patch(row.key, { title: e.target.value })} />
                        </div>
                        <div className="adm-field" style={{ marginBottom: 0 }}>
                          <label htmlFor={`s-${row.key}`}>Subtitle</label>
                          <input id={`s-${row.key}`} className="ml" type="text" value={row.subtitle || ""} onChange={(e) => patch(row.key, { subtitle: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
