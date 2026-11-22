## 1. Merge accepted tasks into dashboard

- [x] 1.1 In `student/dashboard.html`, add imports needed for accepted tasks (`listUserRepos`, `countCommitsSince`, `listRepoTags`) to the existing `gitea-api.js` import
- [x] 1.2 Add `getMyAcceptedTasks()` function to `student/dashboard.html` that lists user forks via `listUserRepos()`, filters forks whose parent has `type-task` topic, and collects taskName, orgName, deadline, forkName, forkCreatedAt
- [x] 1.3 Add a "Tarefas Aceitas" section header and table to `render()` in `student/dashboard.html` with columns Tarefa, Turma, Repositório, Prazo, Status, Commits, Coleta
- [x] 1.4 Populate each accepted task row: repo link to `{giteaUrl}/{user}/{forkName}`, commit count via `countCommitsSince`, status badge (`entregue`/`aceita` via `ui-status-badge`/`ui-inline`), collection date via `listRepoTags` (`coleta-` prefix), "—" when no tag
- [x] 1.5 Ensure the accepted tasks section re-renders after accepting a task (call the merged render path from `acceptTask`)

## 2. Convert Minhas Tarefas page to redirect

- [x] 2.1 Replace `student/minhas-tarefas.html` body with a meta-refresh redirect to `dashboard.html` (same pattern as `student/index.html`)

## 3. Update student navigation

- [x] 3.1 In `components/tab-nav.js`, reduce `STUDENT_TABS` to a single Dashboard tab (`dashboard.html`, label "Dashboard", id `dashboard`)
- [x] 3.2 Verify `student/dashboard.html` keeps `<tab-nav role="student" active="dashboard">` working with the single tab

## 4. Verify

- [x] 4.1 Manual check: load `student/dashboard.html` — sections Minhas Turmas, Tarefas Disponíveis, Tarefas Aceitas all render; accepting a task refreshes the accepted table
- [x] 4.2 Manual check: open `student/minhas-tarefas.html` — redirects to `dashboard.html`; student tab bar shows only "Dashboard"
