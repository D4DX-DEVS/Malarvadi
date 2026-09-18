"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

interface Msg {
  _id: string;
  name: string;
  email?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export function Messages() {
  const [items, setItems] = useState<Msg[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const j = await adminApi.list("contact-messages", "?limit=30");
      setItems(j.data as Msg[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: string) {
    try {
      await adminApi.update("contact-messages", id, { status });
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Messages</h1>
      {error ? <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-4 grid gap-3">
        {items.map((m) => (
          <div key={m._id} className="rounded-card bg-white p-5 shadow-playful">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold">{m.name} <span className="font-normal text-cocoa/60">• {m.subject}</span></p>
              <span className="rounded-full bg-cocoa/10 px-3 py-1 text-xs font-bold">{m.status}</span>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm text-cocoa/80">{m.message}</p>
            <p className="mt-1 text-xs text-cocoa/50">{m.email} • {new Date(m.createdAt).toLocaleString()}</p>
            <div className="mt-3 flex gap-2 text-xs font-bold">
              {(["read", "replied", "spam"] as const).map((s) => (
                <button key={s} onClick={() => setStatus(m._id, s)} className="rounded-full bg-cocoa/10 px-3 py-1.5 capitalize">
                  Mark {s}
                </button>
              ))}
            </div>
          </div>
        ))}
        {!items.length && !error ? <p className="rounded-card bg-white p-6 text-center text-sm text-cocoa/60">No messages yet.</p> : null}
      </div>
    </div>
  );
}
