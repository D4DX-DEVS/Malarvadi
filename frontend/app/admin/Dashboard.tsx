"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

interface Count {
  label: string;
  href: string;
  total: number | string;
}

export function Dashboard() {
  const [counts, setCounts] = useState<Count[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [programs, events, news, messages] = await Promise.all([
          adminApi.list("programs", "?limit=1").catch(() => null),
          adminApi.list("events", "?limit=5").catch(() => null),
          adminApi.list("news", "?limit=5").catch(() => null),
          adminApi.list("contact-messages", "?limit=5").catch(() => null),
        ]);
        if (!programs) {
          setError("Backend database is not configured yet (demo mode). Content APIs will activate once MongoDB is connected.");
          return;
        }
        setCounts([
          { label: "Programs", href: "/admin/programs", total: programs.meta?.total ?? "–" },
          { label: "Events", href: "/admin/events", total: events?.meta?.total ?? "–" },
          { label: "News", href: "/admin/news", total: news?.meta?.total ?? "–" },
          { label: "Messages", href: "/admin/contact-messages", total: messages?.meta?.total ?? "–" },
        ]);
      } catch {
        setError("Could not reach the backend API. Start it with npm run dev:backend.");
      }
    })();
  }, []);

  if (error) return <p className="rounded-card bg-white p-6 text-sm">{error}</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {counts.map((c) => (
        <Link key={c.href} href={c.href} className="rounded-card bg-white p-6 shadow-playful hover:-translate-y-0.5">
          <p className="font-display text-3xl font-bold">{c.total}</p>
          <p className="mt-1 text-sm font-bold text-cocoa/70">{c.label}</p>
        </Link>
      ))}
    </div>
  );
}
