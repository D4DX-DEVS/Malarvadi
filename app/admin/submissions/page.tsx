"use client";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCheck, Copy, Inbox, Mail, MailOpen, MessageCircle, Phone, Trash2 } from "lucide-react";
import type { Submission } from "@/lib/types";
import { api, humanize } from "@/components/admin/api";
import { useToast } from "@/components/admin/Toast";
import { confirmDelete, useConfirm } from "@/components/admin/Confirm";
import { UNREAD_EVENT } from "@/components/admin/AdminShell";
import { EmptyState, Pagination, SearchBox, SkeletonRows, fmtDateTime, initials, submissionName, timeAgo, useUrlState, type PageResult } from "@/components/admin/ui";

type Counts = { all: number; contact: number; join: number; newsletter: number; unread: number };

const TABS: { value: string; label: string; key: keyof Counts }[] = [
  { value: "", label: "All", key: "all" },
  { value: "contact", label: "Contact", key: "contact" },
  { value: "join", label: "Join", key: "join" },
  { value: "newsletter", label: "Newsletter", key: "newsletter" },
];

const FIELD_ORDER = ["name", "phone", "email", "place", "district", "unit", "grade", "subject", "message"];
const AVATAR_TONES = ["tone-purple", "tone-blue", "tone-teal", "tone-orange", "tone-pink"];

const preview = (s: Submission) => s.data?.message || s.data?.subject || s.data?.place || s.data?.email || s.data?.phone || "";
const toneFor = (id: string) => AVATAR_TONES[parseInt(id.slice(-2), 16) % AVATAR_TONES.length];
const notifyUnread = () => window.dispatchEvent(new Event(UNREAD_EVENT));

export default function SubmissionsPage() {
  return (
    <Suspense fallback={<div className="adm-card pad0"><SkeletonRows thumb={false} /></div>}>
      <Inbox_ />
    </Suspense>
  );
}

function Inbox_() {
  const toast = useToast();
  const confirm = useConfirm();
  const [params, setParams] = useUrlState({ page: "1", kind: "", q: "", status: "", id: "" });
  const page = Number(params.page) || 1;

  const [data, setData] = useState<PageResult<Submission, Counts> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<Submission | null>(null);
  const [busy, setBusy] = useState(false);

  const query = useMemo(() => {
    const sp = new URLSearchParams({ page: String(page), limit: "15" });
    if (params.kind) sp.set("kind", params.kind);
    if (params.q) sp.set("q", params.q);
    if (params.status) sp.set("status", params.status);
    return sp.toString();
  }, [page, params.kind, params.q, params.status]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<PageResult<Submission, Counts>>(`/api/submissions?${query}`);
      if (!res.items.length && res.page > 1 && res.total > 0) {
        setParams({ page: String(res.pages) });
        return;
      }
      setData(res);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load submissions");
    } finally {
      setLoading(false);
    }
  }, [query, setParams]);

  useEffect(() => {
    void load();
  }, [load]);

  const setRead = useCallback(async (s: Submission, read: boolean) => {
    try {
      await api(`/api/submissions/${s._id}`, { method: "PATCH", body: JSON.stringify({ read }) });
      const patch = (x: Submission) => (x._id === s._id ? { ...x, read } : x);
      setData((d) => (d ? { ...d, items: d.items.map(patch), counts: { ...d.counts, unread: Math.max(0, d.counts.unread + (read ? -1 : 1)) } } : d));
      setDetail((d) => (d && d._id === s._id ? { ...d, read } : d));
      notifyUnread();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update", true);
    }
  }, [toast]);

  // Resolve the selected submission (it may be off the current page, e.g. from a dashboard link).
  useEffect(() => {
    if (!params.id) {
      setDetail(null);
      return;
    }
    const local = data?.items.find((i) => i._id === params.id);
    if (local) {
      setDetail(local);
      if (!local.read) void setRead(local, true);
      return;
    }
    let cancelled = false;
    api<{ item: Submission }>(`/api/submissions/${params.id}`)
      .then(({ item }) => {
        if (cancelled) return;
        setDetail(item);
        if (!item.read) void setRead(item, true);
      })
      .catch(() => !cancelled && setDetail(null));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, data === null]);

  async function markAllRead() {
    setBusy(true);
    try {
      const res = await api<{ updated: number }>("/api/submissions", { method: "PATCH", body: JSON.stringify({ kind: params.kind }) });
      toast(res.updated ? `${res.updated} marked as read` : "Everything is already read");
      notifyUnread();
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update", true);
    } finally {
      setBusy(false);
    }
  }

  async function remove(s: Submission) {
    if (!(await confirm(confirmDelete("this submission", `${submissionName(s)} · ${s.kind} · ${fmtDateTime(s.createdAt)}`)))) return;
    setBusy(true);
    try {
      await api(`/api/submissions/${s._id}`, { method: "DELETE" });
      toast("Submission deleted");
      const items = data?.items || [];
      const idx = items.findIndex((i) => i._id === s._id);
      const next = items[idx + 1] || items[idx - 1];
      setParams({ id: next ? next._id : "" });
      notifyUnread();
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", true);
    } finally {
      setBusy(false);
    }
  }

  const counts = data?.counts;
  const items = data?.items || [];

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Submissions</h1>
          <p className="adm-sub">
            Contact messages, join requests and newsletter sign-ups
            {counts?.unread ? ` · ${counts.unread} unread` : ""}
          </p>
        </div>
        <div className="adm-head-actions">
          <button type="button" className="adm-btn" onClick={markAllRead} disabled={busy || !counts?.unread}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        </div>
      </div>

      {error ? <p className="adm-err">{error}</p> : null}

      <div className={`adm-card pad0 adm-inbox${detail ? " has-sel" : ""}`}>
        <div className="adm-inbox-list">
          <div className="adm-toolbar">
            <div className="adm-tabs" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.value || "all"}
                  type="button"
                  role="tab"
                  aria-selected={params.kind === t.value}
                  className={`adm-tab${params.kind === t.value ? " is-active" : ""}`}
                  onClick={() => setParams({ kind: t.value, page: "1" })}
                >
                  {t.label} {counts ? <span className="c">{counts[t.key]}</span> : null}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <SearchBox value={params.q} onChange={(q) => setParams({ q, page: "1" })} placeholder="Search…" />
              <label className="adm-check" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
                <input type="checkbox" checked={params.status === "unread"} onChange={(e) => setParams({ status: e.target.checked ? "unread" : "", page: "1" })} />
                Unread
              </label>
            </div>
          </div>

          {loading && !data ? (
            <SkeletonRows thumb={false} rows={6} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title={params.q || params.kind || params.status ? "No matching submissions" : "Inbox is empty"}
              text={params.q ? `Nothing matches “${params.q}”.` : "New messages from the website will appear here."}
            />
          ) : (
            <ul className="adm-inbox-items" style={{ opacity: loading ? 0.6 : 1 }}>
              {items.map((s) => {
                const name = submissionName(s);
                return (
                  <li key={s._id}>
                    <button
                      type="button"
                      className={`adm-msg${params.id === s._id ? " on" : ""}${s.read ? "" : " unread"}`}
                      onClick={() => setParams({ id: s._id })}
                    >
                      <span className={`av ${toneFor(s._id)}`}>{initials(name)}</span>
                      <span className="m">
                        <span className="t">
                          <span className="nm ml">{name}</span>
                          <span className="tm">{timeAgo(s.createdAt)}</span>
                        </span>
                        <span className="pv ml" style={{ display: "block" }}>{preview(s) || "—"}</span>
                        <span className="bd" style={{ display: "flex", gap: 6 }}>
                          <span className={`adm-badge ${s.kind}`}>{humanize(s.kind)}</span>
                          {s.read ? null : <span className="adm-badge new">New</span>}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {data ? (
            <Pagination page={data.page} pages={data.pages} total={data.total} limit={data.limit} noun="" onPage={(p) => setParams({ page: String(p) })} />
          ) : null}
        </div>

        <div className="adm-inbox-detail">
          {detail ? (
            <Detail s={detail} busy={busy} onBack={() => setParams({ id: "" })} onDelete={() => remove(detail)} onToggleRead={() => setRead(detail, !detail.read)} />
          ) : (
            <EmptyState icon={MailOpen} title="Select a submission" text="Choose a message from the list to read its details." />
          )}
        </div>
      </div>
    </>
  );
}

function Detail({ s, busy, onBack, onDelete, onToggleRead }: { s: Submission; busy: boolean; onBack: () => void; onDelete: () => void; onToggleRead: () => void }) {
  const toast = useToast();
  const data = s.data || {};
  const keys = [...FIELD_ORDER.filter((k) => data[k]), ...Object.keys(data).filter((k) => !FIELD_ORDER.includes(k) && data[k])];
  const phone = (data.phone || "").replace(/[^\d+]/g, "");
  const wa = phone.replace(/\D/g, "");
  const waNum = wa.length === 10 ? `91${wa}` : wa;

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard");
    } catch {
      toast("Could not copy", true);
    }
  }

  return (
    <>
      <button type="button" className="adm-btn sm ghost adm-inbox-back" onClick={onBack} style={{ marginBottom: 12 }}>
        <ArrowLeft size={15} /> Back to inbox
      </button>
      <div className="hd">
        <div>
          <span className={`adm-badge ${s.kind}`} style={{ marginBottom: 8 }}>{humanize(s.kind)} submission</span>
          <h2 className="ml" style={{ fontSize: 19, margin: "6px 0 2px" }}>{submissionName(s)}</h2>
          <p className="adm-sub">Received {fmtDateTime(s.createdAt)}</p>
        </div>
        <div className="adm-head-actions">
          <button type="button" className="adm-btn sm" onClick={onToggleRead} disabled={busy}>
            {s.read ? <Mail size={14} /> : <MailOpen size={14} />} {s.read ? "Mark as unread" : "Mark as read"}
          </button>
          <button type="button" className="adm-btn sm ghostdanger" onClick={onDelete} disabled={busy}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <dl className="adm-kvlist">
        {keys.map((k) => {
          const v = String(data[k]);
          const long = k === "message" || v.length > 80;
          return (
            <div key={k} className={long ? "wide" : undefined}>
              <dt>{humanize(k)}</dt>
              <dd className={long ? "msgbox" : "ml"}>
                {v}
                {k === "phone" || k === "email" ? (
                  <button type="button" className="adm-copy" onClick={() => copy(v)} aria-label={`Copy ${k}`} title="Copy">
                    <Copy size={14} />
                  </button>
                ) : null}
              </dd>
            </div>
          );
        })}
      </dl>

      {phone || data.email ? (
        <div className="adm-actions" style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--adm-line)" }}>
          {data.email ? (
            <a className="adm-btn primary" href={`mailto:${data.email}?subject=${encodeURIComponent(data.subject ? `Re: ${data.subject}` : "Malarvadi")}`}>
              <Mail size={16} /> Reply by email
            </a>
          ) : null}
          {phone ? (
            <a className="adm-btn" href={`tel:${phone}`}>
              <Phone size={16} /> Call
            </a>
          ) : null}
          {waNum ? (
            <a className="adm-btn" href={`https://wa.me/${waNum}`} target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> WhatsApp
            </a>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
