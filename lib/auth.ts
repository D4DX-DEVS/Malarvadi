// Minimal admin auth: password from env → signed HttpOnly cookie.
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mv_admin";
function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET env var is required (min 16 chars)");
  return s;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function makeToken(): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): boolean {
  try {
    if (!token) return false;
    const [payload, sig] = token.split(".");
    if (!payload || !sig || !/^[0-9a-f]+$/i.test(sig)) return false;
    const expected = Buffer.from(sign(payload), "hex");
    const given = Buffer.from(sig, "hex");
    if (expected.length !== given.length) return false;
    if (!timingSafeEqual(expected, given)) return false;
    return Number(payload) > Date.now();
  } catch {
    return false;
  }
}

export function checkPassword(pw: string): boolean {
  const want = process.env.ADMIN_PASSWORD || "";
  if (!want) return false;
  const a = Buffer.from(pw), b = Buffer.from(want);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Server-side: is the current request an authenticated admin? */
export function isAdmin(): boolean {
  return verifyToken(cookies().get(ADMIN_COOKIE)?.value);
}
