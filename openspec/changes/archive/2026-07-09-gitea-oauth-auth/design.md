## Context

The academic task system uses Gitea as its backend. Currently, teacher authentication is handled via a hardcoded admin API token (with a localStorage fallback). The application is client-side only (vanilla JS, Web Components), served by a Node.js static server (`server.js`) that proxies `/api/*` to Gitea at `localhost:3000`.

Gitea supports OAuth 2.0 out of the box. This change introduces a Gitea OAuth flow that lets teachers authenticate with their personal Gitea credentials and use their own access token for API calls. Student login (email + username in localStorage) is unchanged.

## Goals / Non-Goals

**Goals:**
- Replace the hardcoded admin token and localStorage token-paste flow with Gitea OAuth 2.0 for teachers
- Keep the client-side-only architecture — proxy handles only the code exchange (to protect client secret)
- Maintain backward compatibility for existing Gitea API functions
- Remove the admin-only `/admin/users/{owner}/orgs` route from `listOrganizations()`

**Non-Goals:**
- Role detection or session management (teacher vs. student mapping deferred)
- Unified login page (student login unchanged)
- Route guard updates (existing localStorage checks remain)
- User registration or account creation (handled by Gitea admin)

## Decisions

1. **Authorization Code + PKCE flow** (not Implicit Grant)
   - The app is client-side, but we need a backend endpoint to safely exchange the authorization code for tokens (client secret must not be exposed). The existing `server.js` already proxies Gitea API calls.
   - **Alternative considered**: Implicit Grant (no backend needed) — rejected because access tokens would be exposed in the URL fragment and there's no refresh token support.

2. **Token stored in localStorage** (same strategy as current approach)
   - Access and refresh tokens are stored in localStorage, scoped to the app's origin.
   - **Alternative considered**: Session cookies via the proxy — rejected because the proxy is a simple pass-through (CORS workaround), not a session manager.

3. **OAuth configuration in server.js environment variables**
   - Gitea OAuth app credentials (client ID, client secret, base URL) are passed to `server.js` via environment variables or a `.env` file.
   - **Alternative considered**: Hardcoded config — rejected because OAuth credentials vary per Gitea instance.

4. **Server-side refresh token handling**
   - `server.js` provides a `/api/oauth/refresh` endpoint that uses the refresh token (sent by the client) to obtain a new access token, keeping the client secret server-side.

5. **`listOrganizations()` without owner parameter**
   - The old code used `/admin/users/{owner}/orgs` when an owner was provided — this requires admin privileges. With personal OAuth tokens, teachers are not necessarily Gitea admins. The function now always calls `/user/orgs`, which returns the authenticated user's organizations.
   - **Alternative considered**: Keep the parameter and use `/users/{owner}/orgs` — rejected because that Gitea endpoint requires authentication as the target user, not available via OAuth.

## Risks / Trade-offs

- **Risk: OAuth app not configured** → Mitigation: Show a clear error message on the login page directing the admin to create an OAuth application in Gitea's settings
- **Risk: Token expiry during long sessions** → Mitigation: Implement automatic refresh via the `/api/oauth/refresh` endpoint before API calls
- **Risk: localStorage token theft (XSS)** → Mitigation: This is an accepted risk consistent with the current architecture
- **Risk: Gitea not running** → Mitigation: The login page detects connectivity issues and displays a helpful message
- **Risk: Teacher not in any organization** → Mitigation: `listOrganizations()` returns an empty array; the UI already handles this case (shows no orgs to select)
