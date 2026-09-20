import { cookies } from "next/headers";
import { ADMIN_COOKIE, checkPassword, makeToken } from "@/lib/auth";
import { err, getClientIp, json, rateLimit, readJson } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`login:${getClientIp(req)}`, 8)) return err("Too many attempts, try again later", 429);
  const body = await readJson(req);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!password || !checkPassword(password)) return err("Invalid password", 401);

  cookies().set(ADMIN_COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return json({ ok: true });
}
