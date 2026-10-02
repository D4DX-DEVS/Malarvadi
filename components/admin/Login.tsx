"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, LoaderCircle, TriangleAlert } from "lucide-react";
import { api } from "./api";

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setError("Please enter the admin password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api<{ ok: boolean }>("/api/auth/login", { method: "POST", body: JSON.stringify({ password, remember }) });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  }

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <section className="adm-login-art" aria-hidden="true">
          <div className="brand">
            <b>മലർവാടി</b>
            <small>Malarvadi</small>
            <span>Content Studio</span>
          </div>
          <p className="copy">Manage your website content, programs, events, gallery and more — all in one place.</p>
          <Scene />
        </section>

        <section className="adm-login-form">
          <h1>Welcome back</h1>
          <p className="adm-sub">Sign in to your admin panel</p>

          <form onSubmit={submit} noValidate>
            {error ? (
              <p className="adm-err" role="alert">
                <TriangleAlert size={16} /> {error}
              </p>
            ) : null}
            <div className="adm-field">
              <label htmlFor="adm-pw">Password</label>
              <div className="adm-pw">
                <input
                  id="adm-pw"
                  type={show ? "text" : "password"}
                  value={password}
                  autoFocus
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <label className="adm-check" style={{ marginBottom: 22 }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember this device
            </label>
            <button className="adm-btn primary block lg" type="submit" disabled={busy}>
              {busy ? <LoaderCircle size={18} className="adm-spin" /> : <Lock size={17} />}
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="adm-login-foot">© {new Date().getFullYear()} Malarvadi. All rights reserved.</p>
        </section>
      </div>
    </div>
  );
}

/** Dusk landscape: sun, hills, a domed hall and trees, in the brand greens. */
function Scene() {
  return (
    <svg className="scene" viewBox="0 0 480 300" preserveAspectRatio="xMidYMax slice">
      <defs>
        <radialGradient id="adm-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f6e7b8" />
          <stop offset="70%" stopColor="#e9cf8b" />
          <stop offset="100%" stopColor="#e9cf8b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="330" cy="150" r="78" fill="url(#adm-sun)" opacity=".9" />
      <circle cx="330" cy="150" r="56" fill="#f3dfa6" />
      <path d="M0 210 C 80 170 150 190 230 175 S 380 150 480 180 V300 H0Z" fill="#165a4c" opacity=".7" />
      {/* domed hall */}
      <g fill="#0e4239">
        <rect x="150" y="186" width="120" height="70" />
        <path d="M168 188 a42 42 0 0 1 84 0Z" />
        <rect x="207" y="132" width="6" height="16" />
        <circle cx="210" cy="130" r="4" />
        <rect x="134" y="140" width="12" height="116" />
        <path d="M134 140 l6 -18 l6 18Z" />
        <rect x="274" y="140" width="12" height="116" />
        <path d="M274 140 l6 -18 l6 18Z" />
      </g>
      <g fill="#0a352e">
        <path d="M0 240 C 70 215 140 232 220 226 S 380 205 480 228 V300 H0Z" />
        {/* trees */}
        <path d="M58 236 c-18 -6 -22 -30 -6 -40 c-2 -18 22 -26 30 -10 c16 -4 24 16 12 26 c8 14 -8 28 -20 22Z" />
        <rect x="70" y="228" width="5" height="24" />
        <path d="M410 222 c-16 -6 -18 -28 -4 -36 c0 -16 20 -22 27 -8 c14 -2 20 14 10 22 c6 12 -6 24 -17 20Z" />
        <rect x="421" y="214" width="5" height="26" />
        <path d="M360 236 q-3 -40 2 -60 q-14 6 -26 0 q14 -6 26 -4 q-8 -12 -22 -14 q16 -2 24 10 q6 -14 22 -14 q-12 6 -18 18 q12 -2 24 6 q-14 2 -24 -2 q4 22 0 60Z" />
      </g>
      <path d="M0 268 C 90 252 200 262 300 256 S 420 248 480 258 V300 H0Z" fill="#072a24" />
    </svg>
  );
}
