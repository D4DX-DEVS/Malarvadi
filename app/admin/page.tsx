"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Database, Inbox, Pencil, Plus, RotateCcw } from "lucide-react";
import { COLLECTIONS } from "@/lib/content-registry";
import type { Submission } from "@/lib/types";
import { api } from "@/components/admin/api";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/Confirm";
import { metaFor } from "@/components/admin/nav";
import { EmptyState, fmtDateTime, initials, submissionName, timeAgo } from "@/components/admin/ui";

const DEFS = Object.values(COLLECTIONS);

interface Stats {
  collections: Record<string, { total: number; drafts: number; thisMonth: number }>;
  activity: { collection: string; id: string; title: string; action: "added" | "updated"; at: string }[];
  submissions: { total: number; unread: number; latest: Submission[] };
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default function AdminDashboard() {
  const toast = useToast();
  const confirm = useConfirm();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);
  // Time-of-day text depends on the viewer's clock, so render it client-side only.
  const [now, setNow] = useState<{ hello: string; today: string } | null>(null);

  const load = useCallback(async () => {
    try {
      setStats(await api<Stats>("/api/admin/stats"));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load dashboard");
    }
  }, []);

  useEffect(() => {
    void load();
    setNow({
      hello: greeting(),
      today: new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    });
  }, [load]);

  async function seed() {
    const ok = await confirm({
      title: "Seed default content?",
      message: "This inserts the starter documents into collections that are currently empty. Existing content is not changed.",
      confirmLabel: "Seed content",
      icon: Database,
    });
    if (!ok) return;
    setSeeding(true);
    try {
      const res = await api<{ ok: boolean; counts: Record<string, number> }>("/api/admin/seed", { method: "POST" });
      const summary = Object.entries(res.counts || {})
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      toast(summary ? `Seeded — ${summary}` : "Nothing to seed — collections already have content");
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Seed failed", true);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{now ? `${now.hello}, Admin 👋` : "Welcome, Admin 👋"}</h1>
          <p className="adm-sub">Here’s what’s happening with your website today{now ? ` · ${now.today}` : ""}</p>
        </div>
        <div className="adm-head-actions">
          <button type="button" className="adm-btn" onClick={seed} disabled={seeding}>
            <RotateCcw size={16} className={seeding ? "adm-spin" : undefined} />
            {seeding ? "Seeding…" : "Seed default content"}
          </button>
        </div>
      </div>

      {error ? <p className="adm-err">{error}</p> : null}

      <div className="adm-stats">
        {DEFS.map((def) => {
          const c = stats?.collections[def.key];
          const { icon: Icon, tone } = metaFor(def.key);
          return (
            <Link key={def.key} href={`/admin/content/${def.key}`} className="adm-stat">
              <span className={`adm-tile-ic tone-${tone}`}>
                <Icon size={21} />
              </span>
              <span style={{ minWidth: 0 }}>
                {c ? <div className="n">{c.total}</div> : <div className="adm-skel" style={{ width: 40, height: 24, marginBottom: 4 }} />}
                <div className="l">{def.label}</div>
                {c && c.drafts > 0 ? (
                  <div className="d warn">{c.drafts} draft{c.drafts === 1 ? "" : "s"}</div>
                ) : c && c.thisMonth > 0 ? (
                  <div className="d">+{c.thisMonth} this month</div>
                ) : null}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="adm-two">
        <section className="adm-card pad0">
          <div className="adm-card-h">
            <h2>Recent activity</h2>
          </div>
          {!stats ? (
            <FeedSkeleton />
          ) : stats.activity.length === 0 ? (
            <EmptyState icon={Pencil} title="No activity yet" text="Content you add or edit will show up here." />
          ) : (
            <ul className="adm-feed">
              {stats.activity.map((a) => {
                const def = COLLECTIONS[a.collection];
                const { icon: Icon, tone } = metaFor(a.collection);
                return (
                  <li key={`${a.collection}-${a.id}`}>
                    <Link href={`/admin/content/${a.collection}/${a.id}`}>
                      <span className={`ic tone-${tone}`}>
                        {a.action === "added" ? <Plus size={16} /> : <Icon size={16} />}
                      </span>
                      <span className="m">
                        <div className="t">
                          {def?.singular ?? a.collection} {a.action}
                        </div>
                        <div className="s ml">{a.title || "(untitled)"}</div>
                      </span>
                      <span className="r">{timeAgo(a.at)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="adm-card pad0">
          <div className="adm-card-h">
            <h2>
              Latest submissions
              {stats?.submissions.unread ? (
                <span className="adm-badge new" style={{ marginLeft: 8, verticalAlign: "middle" }}>
                  {stats.submissions.unread} new
                </span>
              ) : null}
            </h2>
            <Link href="/admin/submissions" className="more">View all</Link>
          </div>
          {!stats ? (
            <FeedSkeleton />
          ) : stats.submissions.latest.length === 0 ? (
            <EmptyState icon={Inbox} title="No submissions yet" text="Contact messages, join requests and newsletter sign-ups will appear here." />
          ) : (
            <ul className="adm-feed">
              {stats.submissions.latest.map((s) => {
                const name = submissionName(s);
                const unread = !s.read;
                return (
                  <li key={s._id}>
                    <Link href={`/admin/submissions?id=${s._id}`}>
                      <span className="ic tone-purple" style={{ borderRadius: "50%", fontSize: 12, fontWeight: 700 }}>
                        {initials(name)}
                      </span>
                      <span className="m">
                        <div className="t ml">{name}</div>
                        <div className="s">{fmtDateTime(s.createdAt)}</div>
                      </span>
                      <span className="r">
                        <span className={`adm-badge ${s.kind}`}>{s.kind}</span>
                        {unread ? <span className="adm-badge new">New</span> : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function FeedSkeleton() {
  return (
    <div style={{ padding: "4px 18px 16px" }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0" }}>
          <div className="adm-skel" style={{ width: 34, height: 34, borderRadius: 10 }} />
          <div style={{ flex: 1 }}>
            <div className="adm-skel" style={{ width: "45%", height: 12, marginBottom: 7 }} />
            <div className="adm-skel" style={{ width: "70%", height: 10 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
