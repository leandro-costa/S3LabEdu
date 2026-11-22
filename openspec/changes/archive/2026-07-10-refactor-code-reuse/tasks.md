## 1. Centralize auth boilerplate in gitea-api.js

- [x] 1.1 Add `getDisplayUrl()` function returning clean Gitea URL (replaces 6x duplicated expression)
- [x] 1.2 Add `requireAuth()` function combining `waitForAuth()` + token check + redirect
- [x] 1.3 Add `setupLogout()` function (now a no-op since `page-header.js` handles logout click)
- [x] 1.4 Add `displayUserInfo(role)` function setting user info display elements
- [x] 1.5 Add cache key constants: `CACHE_KEY_CLASSES`, `CACHE_KEY_TASKS`
- [x] 1.6 Export all new functions and constants

## 2. Centralize data-loading functions in gitea-api.js

- [x] 2.1 Add `loadOwnerOrgs()` with caching under `CACHE_KEY_CLASSES` and fallback
- [x] 2.2 Add `getTaskReposForOrg(orgName)` filtering forks and extracting deadline topic
- [x] 2.3 Add `createForkSafe(owner, repo)` wrapping `createFork()` with "already exists" handling
- [x] 2.4 Add `createDeliveryIssue(giteaUser, repo, deadlineDate)` helper
- [x] 2.5 Export all new functions

## 3. Create shared UI components

- [x] 3.1 Create `page-header.js` component (custom element `<page-header>`) with role/title attributes
- [x] 3.2 Create `tab-nav.js` component (custom element `<tab-nav>`) with role/active attributes
- [x] 3.3 Add CSS utility classes to `academic.css` for logout button margin, container widths, etc.

## 4. Update student pages

- [x] 4.1 Update `student/dashboard.html`: replace auth boilerplate with `requireAuth()` + `displayUserInfo()` + `setupLogout()`; replace duplicated HTML with `<page-header>` and `<tab-nav>`; use `createForkSafe()` and `createDeliveryIssue`
- [x] 4.2 Update `student/minhas-tarefas.html`: same auth boilerplate replacement; replace duplicated HTML with components

## 5. Update teacher pages

- [x] 5.1 Update `teacher/turmas.html`: replace auth boilerplate; replace duplicated HTML; remove inline `loadOwnerOrgs()`, use shared version
- [x] 5.2 Update `teacher/turma-alunos.html`: replace auth boilerplate; replace duplicated HTML
- [x] 5.3 Update `teacher/tarefas.html`: replace auth boilerplate; replace duplicated HTML; remove inline `loadOwnerOrgs()` and `getTaskReposForOrg()`
- [x] 5.4 Update `teacher/acompanhamento.html`: replace auth boilerplate; replace duplicated HTML; remove inline `loadOwnerOrgs()` and `getTaskReposForOrg()`

## 6. Update task page

- [x] 6.1 Update `task/index.html`: replace auth boilerplate with `requireAuth()`; use `createForkSafe()` and `createDeliveryIssue()`

## 7. Dead code audit

- [x] 7.1 Search for functions in gitea-api.js that have no callers — found: `setBaseUrl`, `broadcastAuth`, `isOrgOwner`, `CACHE_KEY_ENROLLMENTS_PREFIX` (all removed)
- [x] 7.2 Search for unused CSS classes — found: `.tab-content`, `.btn-icon`, `.help-text`, `.prompt-overlay`, `.prompt-box` (all removed)
- [x] 7.3 Check for orphaned event handlers — found: `setupLogout()` duplicate click handler on `#logout-btn` (fixed by making `setupLogout()` a no-op)
- [x] 7.4 Remove dead code: cleaned up gitea-api.js exports, CSS classes, removed duplicate handler

## 8. Clean up unused components

- [x] 8.1 Delete unused components: all 16 files removed (`app-*`, `ui-*` that had zero imports)
- [x] 8.2 Check `package.json` — no references to the deleted components exist
- [x] 8.3 No unused specs in `openspec/specs/` — no files correspond to deleted components

## 9. Verify

- [x] 9.1 Run `node scripts/build.js` — build successful (cache bust: v=3296e0b)
- [x] 9.2 Verify no `localStorage` references — none found (all `sessionStorage`)
- [ ] 9.3 Spot-check each updated page loads without console errors (pending — open pages in browser)
