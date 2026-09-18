"use client";

import { useState } from "react";

/**
 * Footer newsletter signup. There is no separate subscriber API, so a signup
 * is recorded through the existing contact endpoint and shows up in the admin
 * Contact Messages list with a "Newsletter signup" subject.
 */
export function NewsletterForm({
  locale,
  placeholder,
  submit,
  success,
  fail,
}: {
  locale: string;
  placeholder: string;
  submit: string;
  success: string;
  fail: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setState("sending");
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter subscriber",
          email: value,
          phone: "",
          subject: "Newsletter signup",
          message: `Newsletter signup request from ${value}.`,
          locale,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setState("ok");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-3">
      <label className="sr-only" htmlFor="newsletter-email">
        {placeholder}
      </label>
      <div className="flex items-center gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder={placeholder}
          className="min-h-[44px] w-full min-w-0 flex-1 rounded-full border border-cream/25 bg-cream/10 px-4 text-[15px] text-cream placeholder:text-cream/50 focus:border-marigold focus:outline-none focus:ring-2 focus:ring-marigold/40"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="squish inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-berry px-4 text-sm font-bold text-white shadow-playful transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 sm:px-5"
        >
          {submit}
        </button>
      </div>
      {state === "ok" ? (
        <p role="status" className="mt-2 text-xs font-semibold text-marigold">
          {success}
        </p>
      ) : null}
      {state === "error" ? (
        <p role="alert" className="mt-2 text-xs font-semibold text-blossom">
          {fail}
        </p>
      ) : null}
    </form>
  );
}
