## Context

S3LabEdu is a serverless static web app that uses PKCE OAuth 2.0 with Forgejo as the identity provider. The current `logout()` function in `components/gitea-api.js` only clears OAuth tokens from `sessionStorage` and broadcasts a `auth-clear` message to other tabs. It does not invalidate the Forgejo server-side session or revoke the OAuth tokens, leaving them usable until they expire naturally.

Forgejo provides two relevant endpoints:
- `POST /login/oauth/revoke` — revokes an OAuth access/refresh token
- `GET /logout` — clears the Forgejo web session cookies

The gitea_url and tokens are available in `sessionStorage` at logout time.

## Goals / Non-Goals

**Goals:**
- Revoke the OAuth access token on Forgejo when user logs out of S3LabEdu
- Redirect the user to Forgejo's `/logout` endpoint to clear server-side session cookies
- Remain backward compatible — existing login, token refresh, and cross-tab sync are unchanged
- Handle failure gracefully (network error, expired token, server down) — local logout always proceeds

**Non-Goals:**
- Not modifying the login or token refresh flow
- Not adding a server-side component — all changes are client-side
- Not changing the cross-tab sync behavior beyond what is needed for logout

## Decisions

**Decision 1: Revoke token before clearing local state**
- Rationale: The access token is needed to authenticate the revocation request. Clearing `sessionStorage` first would lose the token. The sequence is: revoke → clear storage → redirect to Forgejo logout.
- Alternative considered: Fire-and-forget revocation after clearing — rejected because the token would no longer be available from storage.

**Decision 2: Redirect to Forgejo `/logout` after revocation**
- Rationale: Users who are logged into Forgejo in the same browser (e.g., from Forgejo Pages admin, or the Forgejo web UI) should also be logged out. Forgejo's `/logout?redirect=<url>` parameter returns the user to the app.
- Alternative considered: Only revoke the OAuth token without web logout — rejected because session cookies would remain, giving the appearance of still being logged in on Forgejo.

**Decision 3: Revocation is best-effort (fire-and-forget sequence)**
- Rationale: The user expects a fast logout. Blocking the redirect on an HTTP call to Forgejo adds latency and fragility. The revocation call is `await`-ed but with a short timeout, and the local cleanup + redirect always runs regardless of success or failure.
- Alternative considered: Synchronous revocation with error retry — rejected because it would slow down the user experience for a non-critical server-side cleanup.

**Decision 4: Cross-tab sync maintains current behavior**
- Rationale: The existing `BroadcastChannel('s3lab-auth')` `auth-clear` message works well. When the active tab initiates logout (including revocation), it broadcasts `auth-clear` to other tabs. Those tabs also clear storage and redirect, but only the active tab performs the revocation and Forgejo redirect.

## Risks / Trade-offs

- **Token already expired** → Revocation will fail (invalid token). Local logout proceeds normally. Acceptable — expired tokens are useless anyway.
- **Forgejo server unreachable** → Revocation fails silently. Local logout still completes. Acceptable — this is a best-effort cleanup.
- **Redirect to Forgejo `/logout` may fail** → If the redirect URL is malformed or Forgejo returns an error, the user may see a Forgejo error page. Mitigation: Use the `redirect` parameter to return to `index.html` so the user can always navigate back.
- **OAuth revocation not supported by older Forgejo versions** → The `revoke` endpoint is standard in OAuth 2.0 and supported by Forgejo 1.19+. Older versions would silently fail. Mitigation: The revocation is best-effort; local logout is unaffected.
