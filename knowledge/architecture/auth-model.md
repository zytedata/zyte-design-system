---
type: Architecture
title: The dashboard auth model
description: The Google-OAuth + signed-JWT gate that fronts the dashboard — where it's enforced, the cookie, the domain lock, and the env it needs.
tags: [architecture, auth, oauth, jwt, security, dashboard]
origin: code
timestamp: 2026-08-29
---

# The dashboard auth model

## What it is

The dashboard is gated so only `@zyte.com` Google accounts can reach it. Auth is
**hand-rolled** (not NextAuth): a Google OAuth2 code flow issues a Zyte-signed
session JWT, stored in an httpOnly cookie, verified on every request.

## The pieces

- **Gate location:** `apps/dashboard/src/proxy.ts` — note the filename. Next.js
  16 renamed the `middleware` convention to **`proxy`** (a real breaking change,
  flagged in `AGENTS.md`). Its matcher protects everything except
  `/api/oauth/*`, `/sign-in`, `/_next/*`, `/favicon.ico`, `/mark.svg`, `/fonts/*`;
  the root `/` is additionally special-cased as public in code. Unauthenticated
  API requests get `401 json`; other paths redirect to `/sign-in?returnTo=…`.
- **Session:** `apps/dashboard/src/lib/auth.ts` — a stateless HS256 JWT via
  `jose`, in cookie `SESSION_COOKIE = "zyte_session"` (httpOnly), verified with
  `jwtVerify(token, sessionKey(), { algorithms: ["HS256"] })` where `sessionKey()`
  derives from `AUTH_SECRET`.
- **Google flow:** login/callback routes under `src/app/api/oauth/google/`
  (`runtime="nodejs"`, `dynamic="force-dynamic"`). Google ID tokens are verified
  against Google's JWKS (`https://www.googleapis.com/oauth2/v3/certs`, `RS256`)
  with issuer/audience/nonce checks. Short-lived `oauth_state`/`oauth_nonce`/
  `oauth_return_to` cookies provide CSRF/replay protection; the callback
  re-validates `state` and re-checks the `returnTo` origin.
- **Authorization:** `isAllowedGoogleUser` requires
  `email_verified === true && hd === "zyte.com" && email.endsWith("@zyte.com")`.
  `ALLOWED_DOMAIN = "zyte.com"` is a constant in `lib/auth.ts` (not env-tunable).
- **Defense in depth:** `src/app/(app)/layout.tsx` independently calls
  `getSession()` (`src/lib/session.ts`, reads the same cookie) and
  `redirect("/sign-in")` if absent — it does not trust the proxy alone.
- **Env required:** `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  (all via a `requireEnv()` that throws if unset). Loaded from
  `apps/dashboard/.env.local` (Next reads `.env.local` from the app dir, not the
  repo root).

## The contract

- Two independent checks must both pass to see an authed page (proxy + layout);
  removing either weakens the gate.
- The `@zyte.com` restriction is enforced at token-exchange time, not just at the
  proxy — a valid session cookie only exists for an allowed user.
- Secrets come from the environment and are never in code; `.env*` is git-ignored.

## Gotchas

- **All three are required to start the app.** `requireEnv()` throws
  `Missing required environment variable: AUTH_SECRET` (etc.) on startup if any is
  unset. `apps/dashboard/.env.example` documents them (added in the KB build,
  2026-08-29) alongside the optional Studio keys — copy it to `.env.local` and
  fill values.
- Look for the gate in **`proxy.ts`, not `middleware.ts`** — the latter doesn't
  exist here.
- `ALLOWED_DOMAIN` is hard-coded; changing who can log in is a code change, not a
  config toggle.

## Related

- [security-model.md](./security-model.md) — the repo-wide security posture
- [dashboard-runtime.md](./dashboard-runtime.md) — what sits behind the gate
- [../integrations/llm-providers.md](../integrations/llm-providers.md) — the other env-key consumer
- [../environment/local-development.md](../environment/local-development.md) — setting up `.env.local`
