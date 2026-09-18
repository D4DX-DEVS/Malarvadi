"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(20).default(""),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(5).max(5000),
});

type Form = z.infer<typeof schema>;

export function ContactForm({
  locale,
  labels,
  success,
  fail,
}: {
  locale: string;
  labels: { name: string; email: string; phone: string; subject: string; message: string; send: string };
  success: string;
  fail: string;
}) {
  const { register, handleSubmit, reset, formState } = useForm<Form>();
  const [state, setState] = useState<"idle" | "ok" | "error" | "sending">("idle");
  const errors = formState.errors;
  const requiredText = locale === "ml" ? "ആവശ്യമാണ്" : "Required";
  const sendingText = locale === "ml" ? "അയയ്ക്കുന്നു…" : "Sending…";

  async function onSubmit(values: Form) {
    const parsed = schema.safeParse(values);
    if (!parsed.success) return;
    setState("sending");
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, locale }),
      });
      if (!res.ok) throw new Error("send failed");
      setState("ok");
      reset();
    } catch {
      setState("error");
    }
  }

  const input =
    "mt-1 min-h-[44px] w-full rounded-2xl border border-cocoa/15 bg-white px-4 py-2.5 text-[16px] transition-colors focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/30";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4" noValidate>
      <div>
        <label className="text-sm font-bold" htmlFor="cf-name">{labels.name}</label>
        <input id="cf-name" className={input} {...register("name", { required: true })} autoComplete="name" />
        {errors.name ? <p className="mt-1 text-xs text-red-700">{requiredText}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold" htmlFor="cf-email">{labels.email}</label>
          <input id="cf-email" className={input} type="email" {...register("email")} autoComplete="email" />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="cf-phone">{labels.phone}</label>
          <input id="cf-phone" className={input} type="tel" {...register("phone")} autoComplete="tel" />
        </div>
      </div>
      <div>
        <label className="text-sm font-bold" htmlFor="cf-subject">{labels.subject}</label>
        <input id="cf-subject" className={input} {...register("subject", { required: true })} />
        {errors.subject ? <p className="mt-1 text-xs text-red-700">{requiredText}</p> : null}
      </div>
      <div>
        <label className="text-sm font-bold" htmlFor="cf-message">{labels.message}</label>
        <textarea id="cf-message" rows={5} className={input} {...register("message", { required: true })} />
        {errors.message ? <p className="mt-1 text-xs text-red-700">{requiredText}</p> : null}
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className="pop min-h-[48px] rounded-full bg-marigold px-6 py-3 text-sm font-bold text-cocoa shadow-playful transition-all hover:shadow-lift disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {state === "sending" ? sendingText : labels.send}
      </button>
      {state === "ok" ? (
        <p role="status" className="animate-pop-in rounded-2xl bg-leaf/15 px-4 py-3 text-sm font-semibold text-leaf">
          {success}
        </p>
      ) : null}
      {state === "error" ? (
        <p role="alert" className="animate-pop-in rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {fail}
        </p>
      ) : null}
    </form>
  );
}
