import jwt from "jsonwebtoken";
import crypto from "crypto";
import { logger } from "./logger";

const JWT_SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-me";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const TOKEN_EXPIRY = "8h";

if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  logger.warn("ADMIN_USERNAME or ADMIN_PASSWORD env var is not set — admin login will be disabled");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a));
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function verifyCredentials(username: string, password: string): boolean {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) return false;
  return safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD);
}

export function signToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
