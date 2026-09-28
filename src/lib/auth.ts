import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "shahna_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 16) {
    throw new Error("SESSION_SECRET must be set to a random string of at least 16 characters.");
  }
  return value;
}

function hmac(value: string) {
  return createHmac("sha256", secret()).update(value).digest();
}

export function checkAdminPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not set.");
  // Compare fixed-length digests so the check takes the same time regardless of input.
  return timingSafeEqual(hmac(`pw:${input}`), hmac(`pw:${expected}`));
}

export async function createAdminSession() {
  const payload = `admin.${Date.now() + MAX_AGE_SECONDS * 1000}`;
  const token = `${payload}.${hmac(payload).toString("base64url")}`;
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroyAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1), "base64url");
  const expected = hmac(payload);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  const expiresAt = Number(payload.split(".")[1]);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
