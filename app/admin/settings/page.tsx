"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ChartColumn, FileText, Globe, LoaderCircle, Megaphone, MessageSquare, PanelBottom, PanelsTopLeft, Phone, Plus,
  Settings, Share2, Smartphone, Trash2, UserPlus, Users, type LucideIcon,
} from "lucide-react";
import { ICON_OPTIONS } from "@/lib/content-registry";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { api, humanize } from "@/components/admin/api";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/Confirm";
import ImageField from "@/components/admin/ImageField";
import { SkeletonRows, Switch, useUnsavedGuard } from "@/components/admin/ui";

type Json = Record<string, unknown>;
type Path = (string | number)[];

/** Top-level keys that live in the synthetic "General" group. */
const GENERAL_KEYS = ["siteName", "tagline", "seoTitle", "seoDescription"];
const HIDDEN_KEYS = ["_id", "createdAt", "updatedAt"];

const isPlainObject = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);

/** Immutable deep set. */
function setIn<T>(root: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    const i = Number(head);
    copy[i] = setIn(copy[i], rest, value);
    return copy as unknown as T;
  }
  const copy = { ...(root as unknown as Json) };
  copy[String(head)] = setIn(copy[String(head)], rest, value);
  return copy as unknown as T;
}

function getIn(root: unknown, path: Path): unknown {
  return path.reduce<unknown>((acc, k) => (acc == null ? undefined : (acc as Json)[k as string]), root);
}

const id = (path: Path) => `set-${path.join("-")}`;

/** Recommended pixel size per image field, keyed by its settings path, shown under the upload input. */
const IMAGE_HINTS: Record<string, string> = {
  "hero.image": "Recommended size: 1920 x 1080 px (wide, full-bleed background)",
  "about.image": "Recommended size: 1140 x 600 px",
  "app.image": "Recommended size: 500 x 1000 px (phone mockup, transparent PNG)",
  "popup.image": "Recommended size: 1000 x 560 px",
  "pages.about.image": "Recommended size: 1140 x 600 px",
};

/** Sidebar icon + one-line description per settings group. */
const GROUP_META: Record<string, [LucideIcon, string]> = {
  General: [Globe, "Basic information about your website"],
  hero: [PanelsTopLeft, "The big banner at the top of the home page"],
  ticker: [Megaphone, "Scrolling announcement strip"],
  about: [Users, "About block on the home page"],
  stats: [ChartColumn, "Numbers shown in the stats band"],
  contact: [Phone, "Address and contact details"],
  social: [Share2, "Social media profile links"],
  app: [Smartphone, "Mobile app promotion"],
  join: [UserPlus, "Join form headings"],
  popup: [MessageSquare, "Home page pop-up"],
  cta: [Megaphone, "Call-to-action banner"],
  footer: [PanelBottom, "Footer text and copyright"],
  pages: [FileText, "Headers for the inner pages"],
};

const GROUP_LABEL: Record<string, string> = { cta: "Call to action", app: "App promo", popup: "Pop-up", pages: "Inner pages" };

/** Blank row shaped like an existing one (used by the repeatable tables). */
function blankLike(sample: Json): Json {
  const out: Json = {};
  for (const [k, v] of Object.entries(sample)) {
    out[k] = typeof v === "number" ? 0 : typeof v === "boolean" ? false : "";
  }
  return out;
}

export default function SettingsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [settings, setSettings] = useState<Json | null>(null);
  const [saved, setSaved] = useState("");
  const [active, setActive] = useState("General");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dirty = useMemo(() => settings !== null && saved !== "" && JSON.stringify(settings) !== saved, [settings, saved]);
  useUnsavedGuard(dirty && !saving);

  useEffect(() => {
    (async () => {
      try {
        const res = await api<{ settings: Json }>("/api/settings");
        const next = { ...(DEFAULT_SETTINGS as unknown as Json), ...(res.settings || {}) };
        setSettings(next);
        setSaved(JSON.stringify(next));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load settings");
        setSettings({ ...(DEFAULT_SETTINGS as unknown as Json) });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (path: Path, value: unknown) => setSettings((prev) => (prev ? setIn(prev, path, value) : prev));

  async function save() {
    if (!settings) return;
    setSaving(true);
    setError("");
    try {
      const body: Json = { ...settings };
      delete body._id;
      const res = await api<{ settings: Json }>("/api/settings", { method: "PUT", body: JSON.stringify(body) });
      const next = { ...(DEFAULT_SETTINGS as unknown as Json), ...(res.settings || {}) };
      setSettings(next);
      setSaved(JSON.stringify(next));
      toast("Settings saved");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      setError(msg);
      toast(msg, true);
    } finally {
      setSaving(false);
    }
  }

  // ---------- renderers ----------

  function renderScalar(key: string, value: unknown, path: Path) {
    const label = humanize(key);

    if (typeof value === "boolean") {
      return (
        <div className="adm-field" key={id(path)}>
          <Switch checked={value} onChange={(v) => update(path, v)} label={label} />
        </div>
      );
    }

    if (typeof value === "number") {
      return (
        <div className="adm-field" key={id(path)}>
          <label htmlFor={id(path)}>{label}</label>
          <input
            id={id(path)}
            type="number"
            value={Number.isFinite(value) ? value : 0}
            onChange={(e) => update(path, e.target.value === "" ? 0 : Number(e.target.value))}
          />
        </div>
      );
    }

    const str = value == null ? "" : String(value);

    if (key === "image") {
      const fkey = id(path);
      return (
        <div className="adm-field" key={fkey}>
          <label htmlFor={fkey}>{label}</label>
          <ImageField id={fkey} value={str} onChange={(url) => update(path, url)} onError={(m) => toast(m, true)} hint={IMAGE_HINTS[path.join(".")]} />
        </div>
      );
    }

    const multiline = str.length > 80 || str.includes("\n");
    const hasHighlight = str.includes("{highlight}");
    return (
      <div className="adm-field" key={id(path)}>
        <label htmlFor={id(path)}>{label}</label>
        {multiline ? (
          <textarea id={id(path)} rows={4} value={str} onChange={(e) => update(path, e.target.value)} />
        ) : (
          <input id={id(path)} type="text" value={str} onChange={(e) => update(path, e.target.value)} />
        )}
        {hasHighlight ? (
          <p className="adm-help">
            {"{highlight}"} is replaced by the highlighted word on the site — keep it in the text.
          </p>
        ) : null}
      </div>
    );
  }

  function renderStringList(key: string, value: string[], path: Path) {
    return (
      <div className="adm-field" key={id(path)}>
        <label htmlFor={id(path)}>{humanize(key)}</label>
        <textarea
          id={id(path)}
          rows={Math.min(10, Math.max(3, value.length + 1))}
          value={value.join("\n")}
          onChange={(e) => update(path, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        />
        <p className="adm-help">One per line.</p>
      </div>
    );
  }

  function renderObjectList(key: string, rows: Json[], path: Path) {
    // Columns are the union of every row's keys, in first-seen order. Taking
    // them from row 0 alone hides fields that only some rows carry - an About
    // block's `items`/`titles`, for instance, which only list blocks have.
    const cols: string[] = [];
    for (const row of rows) for (const k of Object.keys(row)) if (!cols.includes(k)) cols.push(k);
    const sample = rows.find((r) => Object.keys(r).length === cols.length) || rows[0] || {};
    return (
      <div className="adm-field" key={id(path)}>
        <label>{humanize(key)}</label>
        <div className="adm-rep">
          <table className="adm-table">
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c}>{humanize(c)}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {cols.map((c) => {
                    const cell = row[c];
                    const cellPath = [...path, ri, c];
                    if (c === "icon") {
                      return (
                        <td key={c}>
                          <select value={String(cell ?? "")} onChange={(e) => update(cellPath, e.target.value)}>
                            <option value="">—</option>
                            {ICON_OPTIONS.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </td>
                      );
                    }
                    if (typeof cell === "number") {
                      return (
                        <td key={c}>
                          <input
                            type="number"
                            value={cell}
                            onChange={(e) => update(cellPath, e.target.value === "" ? 0 : Number(e.target.value))}
                          />
                        </td>
                      );
                    }
                    if (typeof cell === "boolean") {
                      return (
                        <td key={c}>
                          <input type="checkbox" checked={cell} onChange={(e) => update(cellPath, e.target.checked)} />
                        </td>
                      );
                    }
                    if (Array.isArray(cell)) {
                      // One entry per line. Without this the array would be
                      // stringified into the text input and saved back as a
                      // single comma-joined string, destroying the list.
                      return (
                        <td key={c}>
                          <textarea
                            rows={Math.min(Math.max(cell.length, 2), 10)}
                            value={cell.map((v) => String(v ?? "")).join("\n")}
                            placeholder="one per line"
                            onChange={(e) => update(cellPath, e.target.value.split("\n").map((l) => l.trim()).filter((l, i, a) => l !== "" || i < a.length - 1))}
                          />
                        </td>
                      );
                    }
                    return (
                      <td key={c}>
                        <input type="text" value={String(cell ?? "")} onChange={(e) => update(cellPath, e.target.value)} />
                      </td>
                    );
                  })}
                  <td className="right">
                    <button
                      type="button"
                      className="adm-btn icon sm ghostdanger"
                      aria-label="Remove row"
                      title="Remove row"
                      onClick={async () => {
                        const ok = await confirm({
                          title: "Remove this row?",
                          message: "The row is removed from the form. It is only deleted from the site once you save.",
                          confirmLabel: "Remove",
                          tone: "danger",
                        });
                        if (ok) update(path, rows.filter((_, i) => i !== ri));
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          className="adm-btn sm"
          onClick={() => update(path, [...rows, blankLike(sample)])}
          disabled={cols.length === 0}
        >
          <Plus size={14} /> Add row
        </button>
      </div>
    );
  }

  function renderNode(key: string, value: unknown, path: Path): React.ReactNode {
    if (Array.isArray(value)) {
      if (value.length && isPlainObject(value[0])) return renderObjectList(key, value as Json[], path);
      return renderStringList(key, (value as unknown[]).map((v) => String(v ?? "")), path);
    }
    if (isPlainObject(value)) {
      return (
        <div className="adm-nest" key={id(path)}>
          <div className="adm-nest-t">{humanize(key)}</div>
          {Object.entries(value)
            .filter(([k]) => !HIDDEN_KEYS.includes(k))
            .map(([k, v]) => renderNode(k, v, [...path, k]))}
        </div>
      );
    }
    return renderScalar(key, value, path);
  }

  async function discard() {
    const ok = await confirm({
      title: "Discard changes?",
      message: "All unsaved changes to the site settings will be lost.",
      confirmLabel: "Discard",
      tone: "danger",
    });
    if (ok) setSettings(JSON.parse(saved));
  }

  if (loading || !settings) {
    return (
      <>
        <div className="adm-head">
          <div>
            <h1>Site settings</h1>
            <p className="adm-sub">Loading…</p>
          </div>
        </div>
        <div className="adm-card pad0">
          <SkeletonRows thumb={false} />
        </div>
      </>
    );
  }

  const topKeys = Object.keys(settings).filter((k) => !HIDDEN_KEYS.includes(k) && !GENERAL_KEYS.includes(k));
  const groups = ["General", ...topKeys];
  const current = groups.includes(active) ? active : "General";
  const label = (g: string) => GROUP_LABEL[g] ?? humanize(g);
  const [CurIcon, curDesc] = GROUP_META[current] || [Settings, ""];

  let body: React.ReactNode;
  if (current === "General") {
    body = GENERAL_KEYS.filter((k) => k in settings).map((k) => renderScalar(k, getIn(settings, [k]), [k]));
  } else {
    const v = settings[current];
    // A top-level object becomes the panel itself, so render its children directly.
    body = isPlainObject(v)
      ? Object.entries(v)
          .filter(([ck]) => !HIDDEN_KEYS.includes(ck))
          .map(([ck, cv]) => renderNode(ck, cv, [current, ck]))
      : renderNode(current, v, [current]);
  }

  const saveBtn = (
    <button type="button" className="adm-btn primary" onClick={save} disabled={saving || !dirty}>
      {saving ? <LoaderCircle size={16} className="adm-spin" /> : null}
      {saving ? "Saving…" : "Save changes"}
    </button>
  );

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Site settings</h1>
          <p className="adm-sub">Global copy, contact details and page headers.</p>
        </div>
        <div className="adm-head-actions">
          {dirty ? <span className="adm-dirty">Unsaved changes</span> : null}
          {dirty ? (
            <button type="button" className="adm-btn ghost" onClick={discard} disabled={saving}>
              Discard
            </button>
          ) : null}
          {saveBtn}
        </div>
      </div>

      {error ? <p className="adm-err">{error}</p> : null}

      <div className="adm-settings">
        <nav className="adm-card adm-subnav" aria-label="Settings sections">
          {groups.map((g) => {
            const [Icon] = GROUP_META[g] || [Settings];
            return (
              <button key={g} type="button" className={g === current ? "on" : ""} onClick={() => setActive(g)} aria-current={g === current ? "page" : undefined}>
                <Icon size={16} /> {label(g)}
              </button>
            );
          })}
        </nav>

        <div>
          <select className="adm-subnav-select" value={current} onChange={(e) => setActive(e.target.value)} aria-label="Settings section">
            {groups.map((g) => (
              <option key={g} value={g}>{label(g)}</option>
            ))}
          </select>
          <section className="adm-card">
            <div className="adm-panel-h">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span className="adm-tile-ic tone-teal" style={{ width: 40, height: 40 }}>
                  <CurIcon size={19} />
                </span>
                <div>
                  <h2>{label(current)} settings</h2>
                  {curDesc ? <p className="adm-sub">{curDesc}</p> : null}
                </div>
              </div>
            </div>
            {body}
            <div className="adm-actions" style={{ borderTop: "1px solid var(--adm-line)", paddingTop: 16 }}>
              <span className="adm-spacer" />
              {saveBtn}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
