## Context

The student area currently has two pages behind a tab bar: `student/dashboard.html` (enrolled class cards + available tasks table with "Aceitar" buttons) and `student/minhas-tarefas.html` (accepted tasks table with per-fork status, commit count, and collection tag date). Both are static HTML pages loading `gitea-api.js` directly; `tab-nav.js` owns the student tab bar. `student/index.html` already redirects to `dashboard.html`.

The accepted-tasks logic in `minhas-tarefas.html` (detect forks via `listUserRepos`, count commits via `countCommitsSince`, delivery status, `listRepoTags` for `coleta-` tags) is self-contained and can be lifted into the dashboard page.

## Goals / Non-Goals

**Goals:**
- One student dashboard page showing Minhas Turmas, Tarefas Disponíveis, and Tarefas Aceitas
- Preserve existing links/bookmarks via a redirect from `minhas-tarefas.html`
- Keep all Gitea data fetching in `gitea-api.js`; no backend changes

**Non-Goals:**
- Refactoring the shared data-loading logic or extracting a common module
- Changing teacher screens or the accept-task flow (fork creation, collaborators, delivery issue)
- URL param persistence on the student dashboard (not part of this change)

## Decisions

1. **Merge by adding a section to `dashboard.html`, not by inlining `minhas-tarefas.html` via iframe or fetch.**
   The accepted-tasks logic is ~110 lines of script. Inlining it into the dashboard's existing module script keeps one render path and reuses the same page lifecycle (`render()` after accept) so the accepted table refreshes right after a student accepts a task.
   - Alternative considered: keeping both pages and making the dashboard link out — rejected, defeats the purpose of the merge.

2. **`minhas-tarefas.html` becomes a meta-refresh redirect to `dashboard.html`.**
   Same pattern already used by `student/index.html`. Cheaper and more robust than server-side redirects (static hosting, no backend).
   - Alternative considered: deleting the file outright — rejected; existing bookmarks/links would 404.

3. **Single student tab in `tab-nav.js`.**
   `STUDENT_TABS` is reduced to one "Dashboard" entry. The tab bar markup stays (harmless with one item) and `active="dashboard"` keeps working.
   - Alternative considered: removing `<tab-nav>` from student pages — rejected; minimal change and consistent with the teacher area's pattern.

4. **Section order: Minhas Turmas → Tarefas Disponíveis → Tarefas Aceitas.**
   Overview first (classes), then actionable items (available), then progress (accepted). Existing dashboard order preserved; accepted tasks appended after.

## Risks / Trade-offs

- [Dashboard page grows and makes more Gitea API calls per load] → Reuses the existing `student_orgs_cache`/`student_tasks_cache` sessionStorage caches; the accepted-tasks fetch (`listUserRepos`) is a single call, same cost as before.
- [Redirect from `minhas-tarefas.html` loses the old tab highlight] → Redirect lands on the dashboard which has exactly one tab; no highlight needed.
- [Single dashboard tab changes student navigation mental model] → Matches the goal of the change; "Minhas Tarefas" URL still works via redirect.

## Migration Plan

1. Merge accepted-tasks rendering into `student/dashboard.html`
2. Convert `student/minhas-tarefas.html` to a redirect
3. Update `STUDENT_TABS` in `components/tab-nav.js`
4. Rollback: restore the two files from git history and revert the tab list

## Open Questions

None.
