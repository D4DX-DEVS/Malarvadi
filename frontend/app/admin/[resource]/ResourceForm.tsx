"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { RESOURCES, type FieldDef } from "@/lib/admin-resources";

function emptyBilingual() {
  return { en: "", ml: "" };
}

function get(doc: Record<string, unknown>, key: string): unknown {
  return doc[key];
}

export function ResourceForm({ resource, id }: { resource: string; id?: string }) {
  const def = RESOURCES[resource];
  const router = useRouter();
  const [doc, setDoc] = useState<Record<string, unknown>>({});
  const [tab, setTab] = useState<"en" | "ml">("en");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(!id);

  useEffect(() => {
    if (!id) return;
    adminApi
      .get(resource, id)
      .then((j) => {
        setDoc(j.data as Record<string, unknown>);
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"));
  }, [resource, id]);

  function set(key: string, value: unknown) {
    setDoc((d) => ({ ...d, [key]: value }));
  }

  function setBi(key: string, lang: "en" | "ml", value: string) {
    const cur = (doc[key] as { en?: string; ml?: string } | undefined) ?? emptyBilingual();
    set(key, { en: cur.en ?? "", ml: cur.ml ?? "", [lang]: value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const body: Record<string, unknown> = { ...doc };
      // Normalize tags + order numbers
      for (const f of def.fields) {
        if (f.type === "tags" && typeof body[f.key] === "string") {
          body[f.key] = (body[f.key] as string).split(",").map((s) => s.trim()).filter(Boolean);
        }
        if (f.key === "order" && body[f.key] !== undefined && body[f.key] !== "") {
          body[f.key] = Number(body[f.key]);
        }
      }
      if (id) await adminApi.update(resource, id, body);
      else await adminApi.create(resource, body);
      router.push(`/admin/${resource}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (!def) return <p>Unknown resource.</p>;
  if (!loaded) return <p className="text-sm">Loading…</p>;

  const input = "mt-1 min-h-[44px] w-full rounded-2xl border border-cocoa/15 bg-white px-4 py-2.5 text-[16px] focus:border-leaf focus:outline-none";

  function field(f: FieldDef) {
    const v = get(doc, f.key);
    switch (f.type) {
      case "slug":
      case "text":
        return <input className={input} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} required={f.required} />;
      case "date": {
        const iso = typeof v === "string" ? v.slice(0, 10) : "";
        return <input type="date" className={input} value={iso} onChange={(e) => set(f.key, e.target.value)} required={f.required} />;
      }
      case "select":
        return (
          <select className={input} value={String(v ?? f.options?.[0]?.value ?? "")} onChange={(e) => set(f.key, e.target.value)}>
            {(f.options ?? []).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        );
      case "boolean":
        return (
          <label className="mt-1 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={Boolean(v)} onChange={(e) => set(f.key, e.target.checked)} className="h-5 w-5" />
            {v ? "On" : "Off"}
          </label>
        );
      case "tags":
        return <input className={input} placeholder="tag1, tag2" value={Array.isArray(v) ? v.join(", ") : String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />;
      case "image":
        return <input className={input} placeholder="https://cdn… or Spaces CDN URL" value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />;
      case "bilingual":
      case "bilingual-text": {
        const bi = (v as { en?: string; ml?: string } | undefined) ?? emptyBilingual();
        const missingMl = !bi.ml && tab === "ml";
        return (
          <div>
            <div className="mb-2 flex gap-2 text-sm font-bold">
              {(["en", "ml"] as const).map((l) => (
                <button key={l} type="button" onClick={() => setTab(l)} className={`rounded-full px-4 py-1.5 ${tab === l ? "bg-cocoa text-white" : "bg-cocoa/10"}`}>
                  {l === "en" ? "English" : "മലയാളം"}
                </button>
              ))}
              {!bi.ml ? <span className="ml-1 self-center text-xs font-semibold text-amber-700">Malayalam missing</span> : null}
            </div>
            {f.type === "bilingual-text" ? (
              <textarea rows={5} className={input} value={tab === "en" ? (bi.en ?? "") : (bi.ml ?? "")} onChange={(e) => setBi(f.key, tab, e.target.value)} required={f.required && tab === "en"} />
            ) : (
              <input className={input} value={tab === "en" ? (bi.en ?? "") : (bi.ml ?? "")} onChange={(e) => setBi(f.key, tab, e.target.value)} required={f.required && tab === "en"} />
            )}
            {missingMl ? <p className="mt-1 text-xs text-amber-700">English will be shown until Malayalam is added.</p> : null}
          </div>
        );
      }
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">
        {id ? "Edit" : "New"} — {def.title}
      </h1>
      <div className="mt-5 grid gap-5">
        {def.fields.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-bold">
              {f.label} {f.required ? "*" : ""}
            </label>
            {field(f)}
          </div>
        ))}
      </div>
      {error ? <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={busy} className="mt-6 min-h-[48px] rounded-full bg-cocoa px-8 py-3 text-sm font-bold text-white disabled:opacity-60">
        {busy ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
