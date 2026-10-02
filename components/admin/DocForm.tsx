"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, LoaderCircle, Trash2, TriangleAlert } from "lucide-react";
import type { CollectionDef, FieldDef } from "@/lib/content-registry";
import { Icon } from "@/components/icons";
import RichText from "./RichText";
import ImageField from "./ImageField";
import { api } from "./api";
import { useToast } from "./Toast";
import { confirmDelete, useConfirm } from "./Confirm";
import { listReturnKey } from "./ListClient";
import { Switch, fmtDateTime, useUnsavedGuard } from "./ui";

/** Public page for collections that have one, keyed by collection. */
const PUBLIC_PATH: Record<string, string> = {
  news: "/news/",
  blog: "/blog/",
  programs: "/programs/",
  features: "/why/",
  monthlyPrograms: "/monthly-programs/",
};

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

function tagTextOf(def: CollectionDef, doc: Values | null): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of def.fields) {
    if (f.type === "tags") out[f.name] = ((doc?.[f.name] as string[] | undefined) || []).join(", ");
  }
  return out;
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
  const toast = useToast();
  const confirm = useConfirm();
  const formRef = useRef<HTMLFormElement>(null);
  const [listHref, setListHref] = useState(`/admin/content/${def.key}`);
  const [values, setValues] = useState<Values>(() => initialValues(def, doc));
  const [tagText, setTagText] = useState<Record<string, string>>(() => tagTextOf(def, doc));
  const [snapshot] = useState(() => JSON.stringify([initialValues(def, doc), tagTextOf(def, doc)]));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"" | "save" | "draft" | "delete">("");

  const dirty = useMemo(() => JSON.stringify([values, tagText]) !== snapshot, [values, tagText, snapshot]);
  const navigate = useUnsavedGuard(dirty && !busy);

  useEffect(() => {
    try {
      const back = sessionStorage.getItem(listReturnKey(def.key));
      if (back) setListHref(back);
    } catch {
      /* storage unavailable */
    }
  }, [def.key]);

  // Cmd/Ctrl+S saves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const set = (name: string, value: unknown) => setValues((p) => ({ ...p, [name]: value }));
  const wasPublished = def.publishable && doc ? doc.published !== false : false;

  async function save(published?: boolean) {
    setBusy(published === false ? "draft" : "save");
    setError("");
    try {
      const payload: Values = { ...values };
      if (published !== undefined) payload.published = published;
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
      toast(
        published === false
          ? `${def.singular} saved as draft`
          : docId
            ? `${def.singular} updated`
            : `${def.singular} ${def.publishable ? "published" : "created"}`,
      );
      await navigate(listHref, true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setBusy("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Enter / Cmd+S keep the item's current published state.
    void save(def.publishable ? (docId ? wasPublished : true) : undefined);
  }

  async function remove() {
    if (!docId) return;
    const title = String(values[def.listTitle] ?? "").trim();
    if (!(await confirm(confirmDelete(def.singular.toLowerCase(), title || undefined)))) return;
    setBusy("delete");
    try {
      await api(`/api/content/${def.key}/${docId}`, { method: "DELETE" });
      toast(`${def.singular} deleted`);
      await navigate(listHref, true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setBusy("");
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
            <Switch id={fid} checked={Boolean(value)} onChange={(v) => set(f.name, v)} label={f.label} />
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

      case "richtext":
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <RichText id={fid} value={str} onChange={(html) => set(f.name, html)} />
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
              <span className="box"><Icon name={str} size={20} /></span> Preview
            </div>
            {help}
          </div>
        );

      case "image":
        return (
          <div className="adm-field" key={f.name}>
            {label}
            <ImageField id={fid} value={str} onChange={(url) => set(f.name, url)} onError={(m) => toast(m, true)} hint={f.hint} />
            {help}
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

  const slug = typeof values.slug === "string" ? values.slug : "";
  const publicHref = docId && wasPublished && slug && PUBLIC_PATH[def.key] ? `${PUBLIC_PATH[def.key]}${slug}` : "";

  return (
    <form ref={formRef} onSubmit={submit} className="adm-editor" noValidate>
      <div>
        {error ? (
          <p className="adm-err" role="alert">
            <TriangleAlert size={16} /> {error}
          </p>
        ) : null}
        <div className="adm-card">{def.fields.map(renderField)}</div>
      </div>

      <aside className="adm-aside">
        <div className="adm-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h3 style={{ margin: 0 }}>{def.publishable ? "Publishing" : "Save"}</h3>
            {dirty ? <span className="adm-dirty">Unsaved</span> : null}
          </div>

          {def.publishable ? (
            <div className="adm-field">
              <label>Status</label>
              {docId ? (
                <span className={`adm-badge dot ${wasPublished ? "on" : "off"}`}>{wasPublished ? "Published" : "Draft"}</span>
              ) : (
                <span className="adm-badge dot">New — not saved yet</span>
              )}
            </div>
          ) : null}

          {def.sortable ? (
            <div className="adm-field">
              <label htmlFor="f-order">Order</label>
              <input id="f-order" type="number" value={Number(values.order) || 0} onChange={(e) => set("order", Number(e.target.value))} />
              <p className="adm-help">Lower numbers come first. You can also drag rows in the list.</p>
            </div>
          ) : null}

          <div style={{ display: "flex", gap: 8 }}>
            {def.publishable ? (
              <>
                <button type="button" className="adm-btn" style={{ flex: 1 }} disabled={!!busy} onClick={() => save(false)}>
                  {busy === "draft" ? <LoaderCircle size={15} className="adm-spin" /> : null}
                  {docId && wasPublished ? "Unpublish" : "Save draft"}
                </button>
                <button type="button" className="adm-btn primary" style={{ flex: 1 }} disabled={!!busy} onClick={() => save(true)}>
                  {busy === "save" ? <LoaderCircle size={15} className="adm-spin" /> : null}
                  {docId && wasPublished ? "Update" : "Publish"}
                </button>
              </>
            ) : (
              <button type="submit" className="adm-btn primary block" disabled={!!busy}>
                {busy === "save" ? <LoaderCircle size={15} className="adm-spin" /> : null}
                {docId ? "Save changes" : `Create ${def.singular.toLowerCase()}`}
              </button>
            )}
          </div>
          <button type="button" className="adm-btn ghost block" style={{ marginTop: 8 }} onClick={() => navigate(listHref)} disabled={!!busy}>
            Cancel
          </button>
          <p className="adm-help" style={{ textAlign: "center", marginTop: 8 }}>
            Tip: press <kbd className="adm-kbd">⌘S</kbd> to save
          </p>
        </div>

        {docId ? (
          <div className="adm-card">
            <h3>Details</h3>
            <ul className="adm-meta-list">
              <li>Created <b>{fmtDateTime(doc?.createdAt as string | undefined)}</b></li>
              <li>Last updated <b>{fmtDateTime(doc?.updatedAt as string | undefined)}</b></li>
            </ul>
            {publicHref ? (
              <a href={publicHref} target="_blank" rel="noreferrer" className="adm-btn sm block" style={{ marginTop: 12 }}>
                <ExternalLink size={14} /> View on website
              </a>
            ) : null}
            <button type="button" className="adm-btn sm ghostdanger block" style={{ marginTop: 8 }} onClick={remove} disabled={!!busy}>
              {busy === "delete" ? <LoaderCircle size={14} className="adm-spin" /> : <Trash2 size={14} />}
              Delete {def.singular.toLowerCase()}
            </button>
          </div>
        ) : null}
      </aside>
    </form>
  );
}
