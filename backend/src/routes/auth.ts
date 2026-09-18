import crypto from "node:crypto";
import { Router } from "express";
import { loginSchema } from "shared";
import { validate } from "../middlewares/validate.js";
import { loginLimiter } from "../middlewares/ratelimit.js";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS, signSession } from "../utils/jwt.js";
import { adminConfigured, env } from "../config/env.js";

export const authRouter = Router();

/** Length-safe, constant-time string compare (avoids leaking the password by timing). */
function sameSecret(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function cookieOpts() {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_MS,
  };
}

authRouter.post("/login", loginLimiter, validate(loginSchema), (req, res) => {
  if (!adminConfigured()) {
    res.status(503).json({
      error: { code: "ADMIN_NOT_CONFIGURED", message: "Set ADMIN_EMAIL, ADMIN_PASSWORD and JWT_SECRET" },
    });
    return;
  }
  const { email, password } = req.body as { email: string; password: string };
  const ok =
    sameSecret(email.trim().toLowerCase(), env.adminEmail) &&
    sameSecret(password, env.adminPassword);
  if (!ok) {
    res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
    return;
  }
  res.cookie(SESSION_COOKIE, signSession(env.adminEmail), cookieOpts());
  res.json({ data: { user: { email: env.adminEmail } } });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  res.json({ data: { loggedOut: true } });
});

authRouter.get("/me", requireAuth, (req: AuthRequest, res) => {
  res.json({ data: { user: { email: req.admin!.email } } });
});
