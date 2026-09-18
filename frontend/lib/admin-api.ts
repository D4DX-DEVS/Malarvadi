"use client";

// Relative URLs on purpose: next.config.ts rewrites /api/v1/* to the Express
// API, so the admin panel is same-origin with the site on port 3000.
async function req(path: string, init?: RequestInit) {
  const res = await fetch(path, { ...init, credentials: "same-origin" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.code ?? `HTTP ${res.status}`);
  return json as { data: unknown; meta?: { total: number; page: number; pages: number } };
}

export const adminApi = {
  me: () => req("/api/v1/auth/me"),
  login: (email: string, password: string) =>
    req("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),
  logout: () => req("/api/v1/auth/logout", { method: "POST" }),
  list: (resource: string, params = "") => req(`/api/v1/admin/${resource}${params}`),
  get: (resource: string, id: string) => req(`/api/v1/admin/${resource}/${id}`),
  create: (resource: string, body: unknown) =>
    req(`/api/v1/admin/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  update: (resource: string, id: string, body: unknown) =>
    req(`/api/v1/admin/${resource}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  remove: (resource: string, id: string) =>
    req(`/api/v1/admin/${resource}/${id}`, { method: "DELETE" }),
  requestUpload: (body: unknown) =>
    req(`/api/v1/admin/upload/request-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  completeUpload: (body: unknown) =>
    req(`/api/v1/admin/upload/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};
