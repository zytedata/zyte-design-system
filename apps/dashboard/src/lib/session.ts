import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE, verifySessionToken, type SessionUser } from "@/lib/auth";

/**
 * Read and verify the current session from the request cookies. Use in Server
 * Components / layouts. Returns null when there is no valid session — note the
 * site-wide gate lives in `proxy.ts`, so pages only reach this with a valid
 * session in practice; the null case is defensive.
 */
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}
