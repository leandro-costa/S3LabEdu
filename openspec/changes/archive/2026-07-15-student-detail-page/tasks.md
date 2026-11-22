## 1. Create `teacher/aluno-detalhes.html`

- [x] 1.1 Scaffold the HTML page with `<head>`, stylesheet links, `<page-header>`, `<tab-nav>`, and a `<div id="detail-content">` container
- [x] 1.2 Add imports: `gitea-api.js` (listForks, countCommitsSince, checkPullRequest, ensureAlunosTeam, listTeamMembers, addTeamMember, deleteRepo, requireAuth, displayUserInfo, getDisplayUrl)
- [x] 1.3 On page load, parse `owner` and `repo` from URL query params via `URLSearchParams`; show error if missing
- [x] 1.4 Fetch forks (`listForks`), team members (`ensureAlunosTeam` + `listTeamMembers`), and PR status (`checkPullRequest` for each fork owner); render table with username, repo link, commit count (loading state), status badge, and action buttons
- [x] 1.5 After table render, fetch commit counts via `countCommitsSince` for each fork owner and update the corresponding cells
- [x] 1.6 Implement `approveStudent(teamId, username, repoOwner, repoName, btn)` — calls `addTeamMember`, updates button to "✓ Aprovado"
- [x] 1.7 Implement `deleteFork(username, forkName, btn)` — confirmation dialog, calls `deleteRepo`, marks row as deleted

## 2. Modify `teacher/acompanhamento.html`

- [x] 2.1 Change "Detalhes" button to navigate: `window.location = 'aluno-detalhes.html?owner=X&repo=Y'`
- [x] 2.2 Remove `<ui-modal id="student-detail-modal">` element and the `ui-modal.js` import
- [x] 2.3 Remove `showStudentsDetail`, `approveStudent`, and `deleteFork` function definitions

## 3. Sync delta spec to main spec

- [x] 3.1 Sync `teacher-student-detail` spec (new capability) to `openspec/specs/teacher-student-detail/spec.md`
