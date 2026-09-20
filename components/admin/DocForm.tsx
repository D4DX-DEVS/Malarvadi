"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CollectionDef, FieldDef } from "@/lib/content-registry";
import { Icon } from "@/components/icons";
import { api } from "./api";

type Values = Record<string, unknown>;

function emptyValue(f: FieldDef): unknown {
  switch (f.type) {
    case "number": return 0;
    case "boolean": return false;
    case "tags": return [];
    case "color": return "#ffe9a8";
    case "select": case "icon": return f.options?.[0]?.value ?? "";
    default: return "";
  }
}

function initialValues(def: CollectionDef, doc: Values | null): Values {
  const v: Values = {};
  for (const f of def.fields) {
    const raw = doc ? doc[f.name] : undefined;
    if (raw === undefined || raw === null) v[f.name] = emptyValue(f);
    else if (f.type === "tags") v[f.name] = Array.isArray(raw) ? raw.map(String) : String(raw).split(",").map((s) => s.trim()).filter(Boolean);
    else if (f.type === "boolean") v[f.name] = Boolean(raw);
    else if (f.type === "number") v[f.name] = Number(raw) || 0;
    else v[f.name] = String(raw);
  }
  if (def.publishable) v.published = doc ? doc.published !== false : true;
  if (def.sortable) v.order = doc && typeof doc.order === "number" ? doc.order : "";
  return v;
}

/** Normalises a hex-ish string for <input type="color">, which rejects anything else. */
function hexFor(value: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#ffffff";
}

export default function DocForm({
  def,
  doc,
  docId,
}: {
  def: CollectionDef;
  doc: Values | null;
  docId?: string;
}) {
  const router = useRouter();
  const listHref = `/admin/content/${def.key}`;
  const [values, setValues] = useState<Values>(() => initialValues(def, doc));
  const [tagText, setTagText] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    for (const f of def.fields) {
      if (f.type === "tags") out[f.name] = ((doc?.[f.name] as string[] | undefined) || []).join(", ");
    }
    return out;
  });
  const [imgBroken, setImgBroken] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (name: string, value: unknown) => setValues((p) => ({ ...p, [name]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload: Values = { ...values };
      if (!docId && (payload.order === "" || payload.order == null)) delete payload.order;
      for (const f of def.fields) {
        if (f.type === "tags") {
          payload[f.name] = (tagText[f.name] || "").split(",").map((s) => s.trim()).filter(Boolean);
        }
      }
      if (docId) {
        await api(`/api/content/${def.key}/${docId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await api(`/api/content/${def.key}`, { method: "POST", body: JSON.stringify(payload) });
      }
      router.push(listHref);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setBusy(false);
    }
  }

  async function remove() {
    if (!docId) return;
    if (!confirm(`Delete this ${def.singular.toLowerCase()}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await api(`/api/content/${def.key}/${docId}`, { method: "DELETE" });
      router.push(listHref);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  }

  function renderField(f: FieldDef) {
    const fid = `f-${f.name}`;
    const value = values[f.name];
    const str = typeof value === "string" ? value : value == null ? "" : String(value);
    const label = (
      <label htmlFor={fid}>
        {f.label}
        {f.required ? <span style={{ color: "var(--adm-danger)" }}> *</span> : null}
      </label>
    );
    const help = f.help ? <p className="adm-help">{f.help}</p> : null;

    switch (f.type) {
      case "boolean":
        return (
          <div className="adm-field" key={f.name}>
            <label className="adm-check">
              <input id={fid} type="checkbox" checked={Boolean(value)} onChange={(e) => set(f.name, e.target.checked)} />
              {f.label}
            </label>
            {help}
          </div>
        );

      case "number":
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <input id={fid} type="number" value={Number(value) || 0} onChange={(e) => set(f.name, Number(e.target.value))} />
            {help}
          </div>
        );

      case "textarea":
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <textarea id={fid} rows={6} value={str} onChange={(e) => set(f.name, e.target.value)} />
            {help}
          </div>
        );

      case "select":
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <select id={fid} value={str} onChange={(e) => set(f.name, e.target.value)}>
              {!f.required ? <option value="">—</option> : null}
              {(f.options || []).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {help}
          </div>
        );

      case "icon":
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <select id={fid} value={str} onChange={(e) => set(f.name, e.target.value)}>
              {!f.required ? <option value="">—</option> : null}
              {(f.options || []).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="adm-iconprev">
              <Icon name={str} size={22} /> preview
            </div>
            {help}
          </div>
        );

      case "image":
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <input
              id={fid}
              type="url"
              value={str}
              placeholder="https://…"
              onChange={(e) => {
                set(f.name, e.target.value);
                setImgBroken((p) => ({ ...p, [f.name]: false }));
              }}
            />
            {help}
            {str && !imgBroken[f.name] ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                className="adm-thumb"
                src={str}
                alt=""
                onError={() => setImgBroken((p) => ({ ...p, [f.name]: true }))}
              />
            ) : null}
          </div>
        );

      case "tags": {
        const chips = (tagText[f.name] || "").split(",").map((s) => s.trim()).filter(Boolean);
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <input
              id={fid}
              type="text"
              value={tagText[f.name] || ""}
              onChange={(e) => setTagText((p) => ({ ...p, [f.name]: e.target.value }))}
            />
            <p className="adm-help">{f.help || "comma separated"}</p>
            {chips.length ? (
              <div className="adm-chips">
                {chips.map((c, i) => (
                  <span className="adm-chip" key={`${c}-${i}`}>{c}</span>
                ))}
              </div>
            ) : null}
          </div>
        );
      }

      case "date":
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <input id={fid} type="date" value={str.slice(0, 10)} onChange={(e) => set(f.name, e.target.value)} />
            {help}
          </div>
        );

      case "slug":
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <input id={fid} type="text" value={str} onChange={(e) => set(f.name, e.target.value)} />
            <p className="adm-help">
              {f.help || (def.slugFrom ? `URL id — left empty it is generated from ${def.slugFrom}.` : "URL id.")}
            </p>
          </div>
        );

      case "color":
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <div className="adm-color">
              <input id={`${fid}-picker`} type="color" value={hexFor(str)} onChange={(e) => set(f.name, e.target.value)} />
              <input id={fid} type="text" value={str} placeholder="#ffe9a8" onChange={(e) => set(f.name, e.target.value)} />
            </div>
            {help}
          </div>
        );

      default:
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <input id={fid} type="text" value={str} onChange={(e) => set(f.name, e.target.value)} />
            {help}
          </div>
        );
    }
  }

  return (
    <form onSubmit={submit}>
      {error ? <p className="adm-err">{error}</p> : null}

      <div className="adm-card">{def.fields.map(renderField)}</div>

      {def.publishable || def.sortable ? (
        <div className="adm-card">
          <h3>Publishing</h3>
          {def.publishable ? (
            <div className="adm-field">
              <label className="adm-check">
                <input
                  type="checkbox"
                  checked={values.published !== false}
                  onChange={(e) => set("published", e.target.checked)}
                />
                Published (visible on the site)
              </label>
            </div>
          ) : null}
          {def.sortable ? (
            <div className="adm-field" style={{ maxWidth: 200, marginBottom: 0 }}>
              <label htmlFor="f-order">Order</label>
              <input
                id="f-order"
                type="number"
                value={Number(values.order) || 0}
                onChange={(e) => set("order", Number(e.target.value))}
              />
              <p className="adm-help">Lower numbers come first.</p>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="adm-actions">
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? "Saving…" : docId ? "Save changes" : `Create ${def.singular.toLowerCase()}`}
        </button>
        <a className="adm-btn" href={listHref}>Cancel</a>
        {docId ? (
          <>
            <span className="adm-spacer" />
            <button type="button" className="adm-btn danger" onClick={remove} disabled={busy}>Delete</button>
          </>
        ) : null}
      </div>
    </form>
  );
}
