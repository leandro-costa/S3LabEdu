## Why

The login flow currently requires users to enter email and Gitea username on every login, but these fields are never actually used — the Gitea API returns them after authentication. This creates unnecessary friction. Additionally, having two almost-identical login pages (professor and aluno) adds maintenance overhead when the role detection is already automatic from the API.

## What Changes

- **BREAKING:** Remove `login-professor.html` and `login-aluno.html` — replaced by a single `login.html`
- Remove email and Gitea username fields from the login form (redundant — obtained from API)
- Only require Gitea URL and Client ID on the login page
- Update `oauth-callback.html` to remove fallback to form-provided email/gitea_user
- Update `index.html` to link to the new unified `login.html`
- Update existing `gitea-oauth` spec to reflect current serverless PKCE architecture and unified login

## Capabilities

### New Capabilities
- (none — no new capabilities, only UI simplification)

### Modified Capabilities
- `gitea-oauth`: Login page flow changes — unified login UI, removal of redundant fields, update to reflect serverless (non-proxy) architecture

## Impact

- `pages/academic/login-professor.html` — removed
- `pages/academic/login-aluno.html` — removed
- `pages/academic/login.html` — created (unified)
- `pages/academic/oauth-callback.html` — minor adjustment (remove fallback to form email/user)
- `pages/academic/index.html` — update link
- `openspec/specs/gitea-oauth/spec.md` — updated to reflect current architecture
