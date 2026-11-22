## Why

Current teacher authentication uses a Gitea admin API token stored in localStorage (with a hardcoded fallback in `gitea-api.js`), which is insecure and inflexible. Adding Gitea OAuth for teachers gives them a proper login flow backed by Gitea's own authentication, eliminates hardcoded secrets, and lets each teacher use their own personal token scoped to their own permissions. Student login remains unchanged (email + username in localStorage) for now.

## What Changes

- Replace hardcoded admin token with Gitea OAuth 2.0 flow for teachers
- Add OAuth callback endpoint to `server.js` to handle the authorization code exchange
- Update `login-professor.html` to redirect to Gitea OAuth instead of asking for a token
- Update `gitea-api.js` to use OAuth access token instead of the hardcoded/admin token
- Remove `listOrganizations(owner)` admin route — use only `/user/orgs` (authenticated user's orgs)
- Update `turmas.html` and `tarefas.html` to call `listOrganizations()` without owner parameter

## Capabilities

### New Capabilities
- `gitea-oauth`: Gitea OAuth 2.0 authentication flow for teachers — redirect to Gitea authorize URL, callback handler, token exchange and storage, refresh token support

### Modified Capabilities
- `gitea-bridge`: Token provisioning changes from static/hardcoded token to OAuth access token; `listOrganizations()` simplified to remove admin route

## Impact

- `server.js`: New OAuth callback route (`/api/oauth/callback`), token refresh endpoint, configuration for Gitea OAuth app credentials (client ID, secret, redirect URI)
- `components/gitea-api.js`: Replace hardcoded token with OAuth token retrieval; remove `setToken()`/`clearToken()`; simplify `listOrganizations()` to always use `/user/orgs`
- `pages/academic/login-professor.html`: Replace token form with OAuth login button
- `pages/academic/teacher/turmas.html`: Remove `owner` argument from `listOrganizations()` call
- `pages/academic/teacher/tarefas.html`: Remove `owner` argument from `listOrganizations()` call
- `openspec/specs/gitea-bridge/spec.md`: Updated to reflect OAuth-based authentication
