## 1. Bridge Module — Add Forgejo Logout URL Helper

- [x] 1.1 Add `getForgejoLogoutUrl()` function to `components/gitea-api.js` that constructs `{gitea_url}/logout?redirect={origin}/index.html`
- [x] 1.2 Export `getForgejoLogoutUrl` from the module

## 2. OAuth Revocation — Implement Token Revocation Call

- [x] 2.1 Add `async function revokeOAuthToken()` to `components/gitea-api.js` that sends `POST {gitea_url}/login/oauth/revoke` with `token={access_token}&token_type_hint=access_token`
- [x] 2.2 Handle errors gracefully (network failure, invalid/expired token) — revocation is best-effort, never block the logout

## 3. Logout — Modify `logout()` Function

- [x] 3.1 Add `revokeOAuthToken()` call at the start of the `logout()` function (before clearing storage, while tokens are still available)
- [x] 3.2 After revocation attempt, clear `sessionStorage` auth keys (existing behavior)
- [x] 3.3 Broadcast `auth-clear` via `BroadcastChannel` (existing behavior)
- [x] 3.4 Replace direct `window.location.href = '../index.html'` with redirect to Forgejo's `/logout?redirect=...` URL using the `getForgejoLogoutUrl()` helper
- [x] 3.5 Verify cross-tab sync: non-active tabs still receive `auth-clear`, clear storage, and redirect to `../index.html` (they do NOT attempt revocation or Forgejo redirect)
