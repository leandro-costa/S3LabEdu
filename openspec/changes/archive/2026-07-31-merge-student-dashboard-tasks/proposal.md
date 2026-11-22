## Why

The student area currently has two separate pages — `dashboard.html` (enrolled classes + available tasks) and `minhas-tarefas.html` (accepted tasks) — that are navigated via tabs. This splits closely related information across pages, forcing the student to switch tabs to see their full task picture. Merging them into a single dashboard gives a complete overview at a glance.

## What Changes

- Merge the "Tarefas Aceitas" view from `student/minhas-tarefas.html` into `student/dashboard.html` as a new section, keeping the existing "Minhas Turmas" and "Tarefas Disponíveis" sections
- Update `components/tab-nav.js` so the student role has a single "Dashboard" tab instead of "Dashboard" + "Minhas Tarefas"
- Make `student/minhas-tarefas.html` redirect to `dashboard.html` (same pattern as `index.html`) so existing links and bookmarks keep working
- Remove the duplicated task data fetching from `minhas-tarefas.html` (fork detection, commit count, delivery status, collection tags are all computed on the merged dashboard)

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `student-tasks`: Requirements change — the accepted tasks view (fork listing, commit count, delivery status, collection date) moves from a separate `minhas-tarefas.html` page to a section of the single student dashboard; the dashboard is the only student page.

## Impact

- `student/dashboard.html`: gains "Tarefas Aceitas" section (fork detection via `listUserRepos`, commit count, status badge, collection tag date) merged from `minhas-tarefas.html`
- `student/minhas-tarefas.html`: becomes a redirect to `dashboard.html`
- `components/tab-nav.js`: `STUDENT_TABS` reduced to a single Dashboard tab
- `openspec/specs/student-tasks/spec.md`: delta spec for the merged dashboard requirements
- No API or backend changes — data sources (Gitea API via `gitea-api.js`) stay the same
