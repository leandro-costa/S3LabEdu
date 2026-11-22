## Why

The codebase has significant code duplication across 12 HTML/JS files: auth-check patterns, Gitea URL construction, organization loading, task-discovery logic, form-showing patterns, and HTML structure (headers, navigation, user-info sections) are repeated nearly identically. This makes maintenance harder and increases bug risk. Refactoring will centralize logic into shared functions/components and reduce code volume by an estimated 30-40%.

## What Changes

- **Centralize auth boilerplate**: Extract `waitForAuth()`, token check, logout wiring, and user-info display into reusable helpers in `gitea-api.js`
- **Deduplicate Gitea URL construction**: Replace 6 inline `gitea_base_url` → display URL expressions with a single `getDisplayUrl()` function
- **Extract shared data-loading functions**: Move `loadOwnerOrgs()` and `getTaskReposForOrg()` from teacher pages into `gitea-api.js`
- **Create safe fork utility**: Extract the `createFork` + "already exists" fallback pattern into a single `createForkSafe()` function
- **Centralize cache key constants**: Move cache key strings into `gitea-api.js`
- **Create shared header/nav templates**: Build `<page-header>` and `<tab-nav>` as components for student and teacher pages
- **Remove unused components**: Delete 10 unused components (`app-*`, several `ui-*`) that are not referenced by any page
- **Audit dead code from past implementations**: Search for functions, constants, CSS classes, and files no longer called or referenced — remnants of previous features that were partially removed
- **Consolidate inline CSS**: Move repeated inline styles (logout button margin, container widths) into `academic.css`

## Capabilities

### New Capabilities
- `shared-auth-layer`: Centralized authentication boilerplate (token check, logout, user-info display, URL helpers)
- `shared-data-loading`: Shared functions for loading organizations and task repos with caching
- `shared-ui-components`: Reusable page-header and tab-nav components for student and teacher layouts
- `safe-fork-util`: Wrapper around `createFork` that handles the "already exists" case gracefully

### Modified Capabilities
<!-- No spec-level behavior changes — only implementation refactoring. -->

## Impact

- **`components/gitea-api.js`**: New exported functions (`getDisplayUrl`, `requireAuth`, `loadOwnerOrgs`, `getTaskReposForOrg`, `createForkSafe`) and cache key constants
- **`css/academic.css`**: New utility classes for repeated inline styles
- **`components/`**: New `auth-ui.js` or similar for header/nav components; remove 10 unused component files
- **All 7 authenticated pages**: Update imports, replace duplicated inline code with shared function calls
- **`teacher/turmas.html`**, `teacher/tarefas.html`, `teacher/acompanhamento.html`: Remove duplicated `loadOwnerOrgs()` and `getTaskReposForOrg()` definitions
- **`student/dashboard.html`**, `task/index.html`: Replace fork + issue creation with `createForkSafe()`
- No database, API, or external dependency changes
