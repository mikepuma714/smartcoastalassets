import "server-only";
import { timingSafeEqual } from "node:crypto";

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Accepts `Authorization: Bearer <secret>` or HTTP Basic auth with <secret> as the password. */
export function authorized(request: Request, secret: string | undefined): boolean {
  if (!secret || secret.length < 16) return false;
  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Bearer ")) return safeEqual(header.slice(7).trim(), secret);
  if (header.startsWith("Basic ")) {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const password = decoded.slice(decoded.indexOf(":") + 1);
    return safeEqual(password, secret);
  }
  return false;
}
