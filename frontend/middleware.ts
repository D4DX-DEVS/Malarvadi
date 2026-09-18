import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "ml"] as const;
const COOKIE = "malarvadi_locale";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    const saved = req.cookies.get(COOKIE)?.value;
    const locale = LOCALES.includes(saved as "en" ? (saved as "en") : ("en" as const)) && saved
      ? saved
      : "en";
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}`;
    const res = NextResponse.redirect(url);
    res.cookies.set(COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  }
  const seg = pathname.split("/")[1];
  if (seg === "admin" || seg === "api") return NextResponse.next();
  if (!LOCALES.includes(seg as "en")) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.cookies.set(COOKIE, seg, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
