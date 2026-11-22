## Why

When a user logs out of S3LabEdu, the app only clears locally stored OAuth tokens from sessionStorage. The Forgejo server-side OAuth session remains valid, leaving tokens that could be reused and Forgejo web session cookies unexpired. This is a security gap — users who share devices or expect a full logout are not protected.

## What Changes

- `logout()` in `components/gitea-api.js` will call the Forgejo OAuth token revocation endpoint before clearing local state
- After revocation, the browser will be redirected to Forgejo's `/logout` endpoint to clear server-side session cookies, with a `redirect` parameter pointing back to `index.html`
- The function remains synchronous from the caller's perspective — revocation is best-effort (fire-and-forget)
- Fallback: if the revocation request fails (e.g., network error, token already expired), the local logout proceeds anyway

## Capabilities

### New Capabilities
- `forgejo-logout`: Server-side Forgejo session invalidation on S3LabEdu logout — revokes OAuth tokens and clears Forgejo session cookies

### Modified Capabilities
- `gitea-oauth`: The OAuth spec will be updated to document the new logout/revocation requirements
- `gitea-bridge`: The bridge module must expose a way to call the Forgejo `/logout` endpoint

## Impact

- `components/gitea-api.js` — `logout()` function modified to add revocation + redirect
- No new dependencies required (uses existing OAuth infrastructure)
- Forgejo server must have OAuth 2.0 token revocation endpoint enabled (standard in Forgejo `/login/oauth/revoke`)
- Backward compatible — existing login flow unchanged; revocation is additive
