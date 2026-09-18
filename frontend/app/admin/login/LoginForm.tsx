"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi } from "@/lib/admin-api";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await adminApi.login(email.trim(), password);
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Invalid email or password.");
    } finally {
      setBusy(false);
    }
  }

  const input = "mt-1 min-h-[44px] w-full rounded-2xl border border-cocoa/15 bg-white px-4 py-2.5 text-[16px] focus:border-leaf focus:outline-none";

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div>
        <label className="text-sm font-bold" htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="username" className={input} value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="text-sm font-bold" htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
      </div>
      {error ? <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <button type="submit" disabled={busy} className="min-h-[48px] rounded-full bg-cocoa px-6 py-3 text-sm font-bold text-white disabled:opacity-60">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
