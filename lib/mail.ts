// Email notifications for public form submissions, sent through Resend's
// HTTPS API (https://resend.com). HTTPS rather than SMTP because DigitalOcean
// blocks outbound SMTP ports. Unset RESEND_API_KEY and sending is skipped.
import type { SubmissionKind } from "./types";

const KIND_TITLES: Record<SubmissionKind, string> = {
  contact: "New contact message",
  join: "New membership request",
  newsletter: "New newsletter sign-up",
};

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  phone: "Phone",
  email: "Email",
  place: "Place",
  unit: "Unit",
  district: "District",
  outOfKerala: "Outside Kerala",
  grade: "Class",
  subject: "Subject",
  message: "Message",
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function buildHtml(title: string, data: Record<string, string>, receivedAt: Date): string {
  const rows = Object.entries(data)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;vertical-align:top;white-space:nowrap">${escapeHtml(FIELD_LABELS[k] ?? k)}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const when = receivedAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  return (
    `<div style="font-family:Arial,sans-serif;font-size:14px;color:#222">` +
    `<h2 style="margin:0 0 4px;color:#0b3d35">${escapeHtml(title)}</h2>` +
    `<p style="margin:0 0 16px;color:#666">Received ${escapeHtml(when)} (IST) via malarvadi.org</p>` +
    `<table style="border-collapse:collapse;border:1px solid #eee">${rows}</table>` +
    `</div>`
  );
}

/** Email a submission to MAIL_TO. Never throws: the submission is already saved. */
export async function notifySubmission(kind: SubmissionKind, data: Record<string, string>, receivedAt: Date) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const title = KIND_TITLES[kind];
  const who = data.name || data.email;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || "Malarvadi Website <onboarding@resend.dev>",
        to: (process.env.MAIL_TO || "malarvadizone@gmail.com").split(",").map((s) => s.trim()),
        subject: who ? `${title} — ${who}` : title,
        html: buildHtml(title, data, receivedAt),
        // Resend rejects the whole send on a malformed reply_to, so only pass a plausible one.
        ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "") ? { reply_to: data.email } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[mail] Resend ${res.status}: ${await res.text()}`);
  } catch (e) {
    console.error("[mail] send failed:", e);
  }
}
