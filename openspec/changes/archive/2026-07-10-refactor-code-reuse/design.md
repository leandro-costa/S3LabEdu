## Context

The S3LabEdu frontend is a static site with 12 HTML pages and a shared `gitea-api.js` module. Authentication flow uses OAuth2 with PKCE, storing session data in `sessionStorage` and syncing across tabs via `BroadcastChannel`. Pages are divided into student (2 pages), teacher (4 pages), and public (login, OAuth callback, landing).

Analysis identified ~30 distinct duplicated code patterns across pages, from simple expressions (Gitea URL construction, 6 duplicates) to full function definitions (`loadOwnerOrgs`, 3 duplicates). 10 of 22 component files are unused.

## Goals / Non-Goals

**Goals:**
- Reduce duplicated JavaScript logic by centralizing into `gitea-api.js`
- Reduce duplicated HTML structure by creating shared components
- Remove 10 unused component files
- Consolidate repeated inline CSS into stylesheet classes
- Keep total code volume reduction measurable (>30%)

**Non-Goals:**
- No behavior or UI changes — purely structural refactoring
- No backend or API changes
- No new features or capabilities beyond what exists
- No migration of `sessionStorage` to another storage mechanism

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Where to put shared functions | `gitea-api.js` | Already the central module, imported by all 7 authenticated pages; adding more exports avoids new HTTP requests |
| Shared header component | Use `<page-header>` custom element | Follows existing component pattern (`ui-form.js`, `ui-date.js`); no framework dependency |
| Shared nav component | Use `<tab-nav>` custom element | Same reasoning — consistent with architecture |
| Cache key constants | Export as named constants from `gitea-api.js` | Simplifies maintenance; single source of truth |
| Remove vs keep unused components | **Remove** 10 unused files | Dead code creates confusion; they are not referenced by any HTML page |
| `createForkSafe` signature | `async createForkSafe(owner, repo)` → returns fork or null | Wraps try/catch internally; caller doesn't need to check "already exists" |
| `getDisplayUrl()` | `function getDisplayUrl() { ... return base.replace(/\/api\/v1$/, '') || ... }` | Inline the 6x duplicated expression; no parameters needed (reads from sessionStorage via existing getters) |
| `requireAuth()` | `async function requireAuth() { await waitForAuth(); if (!getToken()) window.location.href = '../index.html'; }` | Eliminates 7 repeated import + await + check blocks |

## Risks / Trade-offs

- **[Low] Breaking imports**: Adding exports to `gitea-api.js` is backward-compatible; removing functions from pages requires coordinated updates across 7 files → mitigated by comprehensive tasks checklist
- **[Low] CSS specificity**: Adding utility classes to `academic.css` could conflict with existing styles → mitigated by prefixing with `util-` namespace
- **[Medium] Component registration timing**: Custom elements (`<page-header>`, `<tab-nav>`) must be defined before the DOM parses them → use `<script>` before the elements in HTML, or use `customElements.whenDefined()` pattern
- **[Low] Unused component removal**: Some components may be used by future planned pages → mitigated by git history; can restore if needed
