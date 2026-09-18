import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { SESSION_COOKIE, verifySession } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  /** Set by requireAuth. There is only ever one admin, identified by email. */
  admin?: { email: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!token) {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Login required" } });
    return;
  }
  try {
    const { sub } = verifySession(token);
    // A token signed for a different email than the one now in .env is stale.
    if (sub !== env.adminEmail) throw new Error("admin changed");
    req.admin = { email: sub };
    next();
  } catch {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Session expired" } });
  }
}
