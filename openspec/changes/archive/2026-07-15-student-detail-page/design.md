## Context

Currently, `teacher/acompanhamento.html` contains all tracking logic inline: a task table with summary counts plus a modal (`<ui-modal>`) that opens when clicking "Detalhes" on any task row. The `showStudentsDetail()` function inside that page queries forks, members, PRs, and commits, builds a table of rows, and appends it to the modal. Two action functions (`approveStudent`, `deleteFork`) are also defined globally on the page.

The new design extracts the modal content and its associated logic into a dedicated page `teacher/aluno-detalhes.html`. The page receives task identity via URL query params (`?owner=X&repo=Y`), loads data on mount, and renders the same table inline (not inside a modal).

## Goals / Non-Goals

**Goals:**
- Create a standalone, addressable page for per-task student details
- Move all detail-related logic (`showStudentsDetail`, `approveStudent`, `deleteFork`) out of `acompanhamento.html`
- Keep existing UI appearance and behavior identical
- Preserve all existing Gitea API calls and data-fetching logic

**Non-Goals:**
- No changes to `gitea-api.js` or any backend logic
- No changes to existing specs or requirements
- No new API endpoints or data models

## Decisions

1. **New page at `teacher/aluno-detalhes.html`** — follows existing page naming convention (`turma-alunos.html`, `tarefas.html`). The name combines "aluno" (student) and "detalhes" (details) to match the app's Portuguese UI.

2. **Query parameters `?owner=<org>&repo=<repo>`** — matches the enrollment link pattern already used (`?owner={org}&repo={repo}`). No need for URL encoding of special characters since org/repo names are alphanumeric.

3. **Inline script (no framework)** — the existing page uses vanilla JS modules with `<script type="module">`. The new page follows the same pattern for consistency.

4. **Reuse existing Gitea API imports** — `listForks`, `countCommitsSince`, `checkPullRequest`, `ensureAlunosTeam`, `listTeamMembers`, `addTeamMember`, `deleteRepo`, `requireAuth`, `displayUserInfo`, `getDisplayUrl` — all already exist and are unchanged.

5. **Navigation instead of modal** — "Detalhes" button changes from `onclick="showStudentsDetail(...)"` to `onclick="window.location='aluno-detalhes.html?owner=X&repo=Y'"`. The new page handles parameters on load via `URLSearchParams`.

6. **No duplicate code** — the data-fetching and rendering logic is moved wholesale from the modal function into the new page's script. The `acompanhamento.html` loses the modal element, the three global functions, and the `ui-modal.js` import.

## Risks / Trade-offs

- **Page load vs modal open** — navigating to a new page is slower than opening a modal (full page load). Mitigation: the detail page is a secondary action (not the main workflow), so the trade-off is acceptable for better addressability.
- **Lost parent page state** — navigating away from `acompanhamento.html` loses scroll position and filter state. Mitigation: browser back button returns to the previous state; page state is reconstructed from URL/filters (already stored in select elements which restore from URL params).
