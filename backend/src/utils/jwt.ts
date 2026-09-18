import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const SESSION_COOKIE = "malarvadi_session";
export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface SessionPayload {
  /** The admin's email - the only identity the app has. */
  sub: string;
}

export function signSession(email: string): string {
  if (!env.jwtSecret) throw new Error("JWT_SECRET not configured");
  return jwt.sign({ sub: email } satisfies SessionPayload, env.jwtSecret, {
    expiresIn: "7d",
  });
}

export function verifySession(token: string): SessionPayload {
  if (!env.jwtSecret) throw new Error("JWT_SECRET not configured");
  return jwt.verify(token, env.jwtSecret) as SessionPayload;
}
