"use client";
import { useEffect, useState } from "react";
import { ICON_OPTIONS } from "@/lib/content-registry";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { api, humanize } from "@/components/admin/api";
import { useToast } from "@/components/admin/Toast";

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

/** Blank row shaped like an existing one (used by the repeatable tables). */
function blankLike(sample: Json): Json {
  const out: Json = {};
  for (const [k, v] of Object.entries(sample)) {
    out[k] = typeof v === "number" ? 0 : typeof v === "boolean" ? false : "";
  }
  return out;
}

export default function SettingsPage() {
  const { show, toast } = useToast();
  const [settings, setSettings] = useState<Json | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({ General: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [imgBroken, setImgBroken] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await api<{ settings: Json }>("/api/settings");
        setSettings({ ...(DEFAULT_SETTINGS as unknown as Json), ...(res.settings || {}) });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load settings");
        setSettings({ ...(DEFAULT_SETTINGS as unknown as Json) });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (path: Path, value: unknown) => setSettings((prev) => (prev ? setIn(prev, path, value) : prev));

  async function uploadImage(path: Path, file: File) {
    const key = id(path);
    setUploading((p) => ({ ...p, [key]: true }));
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await api<{ url: string }>("/api/upload", { method: "POST", body: fd });
      update(path, url);
      setImgBroken((p) => ({ ...p, [key]: false }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading((p) => ({ ...p, [key]: false }));
    }
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    setError("");
    try {
      const body: Json = { ...settings };
      delete body._id;
      const res = await api<{ settings: Json }>("/api/settings", { method: "PUT", body: JSON.stringify(body) });
      setSettings({ ...(DEFAULT_SETTINGS as unknown as Json), ...(res.settings || {}) });
      show("saved");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      setError(msg);
      show(msg, true);
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
          <label className="adm-check">
            <input type="checkbox" checked={value} onChange={(e) => update(path, e.target.checked)} />
            {label}
          </label>
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
          <div className="adm-imgrow">
            <input
              id={fkey}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              disabled={uploading[fkey]}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) uploadImage(path, file);
              }}
            />
            {uploading[fkey] ? <span className="adm-help">Uploading…</span> : null}
          </div>
          <input
            id={`${fkey}-url`}
            type="url"
            value={str}
            placeholder="or paste an image URL"
            onChange={(e) => {
              update(path, e.target.value);
              setImgBroken((p) => ({ ...p, [fkey]: false }));
            }}
          />
          {IMAGE_HINTS[path.join(".")] ? <p className="adm-help">{IMAGE_HINTS[path.join(".")]}</p> : null}
          {str && !imgBroken[fkey] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img className="adm-thumb" src={str} alt="" onError={() => setImgBroken((p) => ({ ...p, [fkey]: true }))} />
          ) : null}
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
                      className="adm-btn sm ghostdanger"
                      onClick={() => update(path, rows.filter((_, i) => i !== ri))}
                    >
                      Remove
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
          + Add row
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

  function group(name: string, body: React.ReactNode) {
    const isOpen = open[name] ?? false;
    return (
      <fieldset key={name} data-open={isOpen}>
        <legend onClick={() => setOpen((p) => ({ ...p, [name]: !isOpen }))}>
          {isOpen ? "▾" : "▸"} {name}
        </legend>
        {isOpen ? <div style={{ paddingBottom: 8 }}>{body}</div> : null}
      </fieldset>
    );
  }

  if (loading || !settings) {
    return (
      <>
        <h1>Site settings</h1>
        <div className="adm-card adm-empty">Loading…</div>
      </>
    );
  }

  const topKeys = Object.keys(settings).filter((k) => !HIDDEN_KEYS.includes(k) && !GENERAL_KEYS.includes(k));

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Site settings</h1>
          <p className="adm-sub">Global copy, contact details and page headers.</p>
        </div>
        <button type="button" className="adm-btn primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>

      {error ? <p className="adm-err">{error}</p> : null}

      {group(
        "General",
        GENERAL_KEYS.filter((k) => k in settings).map((k) => renderScalar(k, getIn(settings, [k]), [k])),
      )}

      {topKeys.map((k) => {
        const v = settings[k];
        // A top-level object becomes the group itself, so render its children directly.
        const body = isPlainObject(v)
          ? Object.entries(v)
              .filter(([ck]) => !HIDDEN_KEYS.includes(ck))
              .map(([ck, cv]) => renderNode(ck, cv, [k, ck]))
          : renderNode(k, v, [k]);
        return group(humanize(k), body);
      })}

      <div className="adm-actions">
        <button type="button" className="adm-btn primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
      {toast}
    </>
  );
}
