## 1. Fix Gitea API functions

- [x] 1.1 Fix `createOrganization()` — change route from `/admin/users/{owner}/orgs` to `POST /api/v1/orgs`
- [x] 1.2 Fix `createFork()` — remove `Sudo` header and `giteaUser` parameter; fork goes to authenticated user
- [x] 1.3 Export updated function signatures from `gitea-api.js`

## 2. New Gitea API functions

- [x] 2.1 Implement `listOwnerOrganizations()` — calls `GET /api/v1/users/{username}/orgs` (username from `teacher_gitea_user` localStorage) to avoid `permission` field format ambiguity
- [x] 2.2 Implement `getRepoTopics(owner, repo)` — calls `GET /api/v1/repos/{owner}/{repo}/topics`
- [x] 2.3 Implement `setRepoTopic(owner, repo, topic)` — calls `PUT /api/v1/repos/{owner}/{repo}/topics`
- [x] 2.4 Implement `listTeamMembers(teamId)` — calls `GET /api/v1/teams/{teamId}/members`
- [x] 2.5 Export all new functions

## 3. Classes page — read from Gitea orgs

- [x] 3.1 Update `turmas.html` to fetch classes from `listOwnerOrganizations()` instead of `academic_classes`
- [x] 3.2 Update class creation flow: after creating org via `createOrganization()`, call `createOrgTeam(org, "alunos")`
- [x] 3.3 Add localStorage cache layer: write Gitea data to `academic_classes` on load, read from cache for instant render

## 4. Tasks page — read from Gitea repos

- [x] 4.1 Update `tarefas.html` to fetch tasks from repos in the class org filtered by `type:task` topic instead of `academic_tasks`
- [x] 4.2 Update task creation: after creating repo via `createOrgRepo()`, call `setRepoTopic()` for `type-task` and `deadline-YYYY-MM-DD` (hyphens, not colons — Gitea rejects `:` in topic names)
- [x] 4.3 Parse deadline from repo topics on read
- [x] 4.4 Add localStorage cache layer for tasks

## 5. Enrollment — read from team membership

- [x] 5.1 Update `turma-alunos.html` to list enrolled students from `listTeamMembers()` instead of localStorage
- [x] 5.2 Ensure bulk enrollment reads from Gitea (already writes to team)
- [x] 5.3 Add localStorage cache layer for enrollments

## 6. Student dashboard — read from Gitea

- [x] 6.1 Update `dashboard.html` to check enrollment via team membership
- [x] 6.2 Update `dashboard.html` to read available tasks from repos in the class org
- [x] 6.3 Update `minhas-tarefas.html` to read acceptances from forks instead of `academic_acceptances`
- [x] 6.4 Remove localStorage source-of-truth dependencies from student pages

## 7. Tracking dashboard — pending approvals

- [x] 7.1 Update `acompanhamento.html` to read enrollment counts from team members
- [x] 7.2 Update acceptance counts to read from forks
- [x] 7.3 Add "Pendentes de Aprovação" section: list forks where fork owner is not in "alunos" team
- [x] 7.4 Add "Aprovar" button that calls `addTeamMember(teamId, username)`

## 8. Enrollment link page

- [x] 8.1 Update `task/index.html` to require authentication; redirect to login if not authenticated
- [x] 8.2 Update to look up task by org/repo instead of localStorage
- [x] 8.3 Update fork call to use student's own token (no `Sudo` — already fixed in gitea-api.js)

## 9. Migration script (CANCELLED - still in development)

- [x] ~~9.1 Create `scripts/migrate-to-gitea-truth.html`~~ — CANCELLED, still in dev phase
- [x] ~~9.2 Migration: for each `academic_class` → ensure org exists, create "alunos" team~~ — CANCELLED
- [x] ~~9.3 Migration: for each `academic_task` → ensure repo exists with deadline topic~~ — CANCELLED
- [x] ~~9.4 Migration: for each `academic_enrollment` → add to "alunos" team~~ — CANCELLED
- [x] ~~9.5 Migration: verify forks exist for each `academic_acceptance`~~ — CANCELLED

## 10. Cleanup

- [x] 10.1 Remove localStorage reads as source of truth (keep as cache) — done across all pages
- [x] 10.2 Update main spec files to reflect new architecture — teacher-classes, teacher-tasks, teacher-tracking, student-tasks, task-enrollment-link, gitea-team-management, bulk-enrollment updated

## 11. Bug fixes & syntax corrections

- [x] 11.1 Fix `dashboard.html` — stray `;` in template literal causing `SyntaxError: missing ) after argument list`
- [x] 11.2 Fix `minhas-tarefas.html` — same stray `;` bug
- [x] 11.3 Replace inline `onclick` with dynamic data (template injections) by `data-*` attributes + `addEventListener` in all student pages
- [x] 11.4 Fix missing `}` in `task/index.html` try/catch nesting (Uncaught SyntaxError: Unexpected token 'catch')

## 12. Fork detection fix — forks live in student namespace, not org

- [x] 12.1 Fix `getAcceptedRepoNames()` in `dashboard.html` — iterate task repos, use `checkFork()` per repo instead of scanning org repos for forks
- [x] 12.2 Fix `getMyAcceptedTasks()` in `minhas-tarefas.html` — same approach: `checkFork()` per task repo
- [x] 12.3 Add `listUserRepos()` to `gitea-api.js` — `GET /api/v1/user/repos` for listing authenticated user's repos
- [x] 12.4 Refactor `getMyAcceptedTasks()` to use `listUserRepos()` + `fork.parent` — finds accepted tasks without requiring org membership

## 13. Commit counter on student page

- [x] 13.1 Add "Commits" column to `minhas-tarefas.html` table
- [x] 13.2 Count commits via `listCommits(giteaUser, repoName, forkCreatedAt)` — only commits after fork creation date

## 14. Enrollment link page — detect existing fork

- [x] 14.1 Before showing enrollment form in `task/index.html`, call `checkFork()` to detect if student already has a fork
- [x] 14.2 If fork exists, show "Você já aceitou esta tarefa!" with links to Gitea repo and "Minhas Tarefas" instead of the enrollment form

## 15. Delete fork repos from teacher tracking

- [x] 15.1 Add `deleteRepo(owner, repo)` to `gitea-api.js` — `DELETE /api/v1/repos/{owner}/{repo}`
- [x] 15.2 Add "Excluir" button for enrolled students' forks in the detail modal of `acompanhamento.html`
- [x] 15.3 Add "Excluir" button for pending/non-member forks in the same modal
- [x] 15.4 Add `window.deleteFork()` handler with confirmation dialog and error handling
