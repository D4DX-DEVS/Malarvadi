"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api<{ ok: boolean }>("/api/auth/login", { method: "POST", body: JSON.stringify({ password }) });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  }

  return (
    <div className="adm-login">
      <form onSubmit={submit}>
        <h1 style={{ fontSize: 22 }}>മലർവാടി Admin</h1>
        <p className="adm-sub" style={{ marginBottom: 16 }}>Enter the admin password to continue.</p>
        {error ? <p className="adm-err">{error}</p> : null}
        <div className="adm-field">
          <label htmlFor="adm-pw">Password</label>
          <input
            id="adm-pw"
            type="password"
            value={password}
            autoFocus
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="adm-btn primary" type="submit" disabled={busy} style={{ width: "100%" }}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
