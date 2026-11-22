## 1. gitea-api.js — Make organization and repo creation private

- [x] 1.1 Change `visibility: 'public'` to `visibility: 'private'` in `createOrganization()` (line 223 in `components/gitea-api.js`)
- [x] 1.2 Change `private: false` to `private: true` in `createOrgRepo()` (line 262 in `components/gitea-api.js`)

## 2. gitea-api.js — Add addTeamRepo function

- [x] 2.1 Add `addTeamRepo(teamId, owner, repo)` function that calls `PUT /api/v1/teams/{teamId}/repos/{owner}/{repo}`
- [x] 2.2 Add `addTeamRepo` to the export statement in `components/gitea-api.js`

## 3. teacher/tarefas.html — Add team alunos as collaborator after creating repo

- [x] 3.1 Import `ensureAlunosTeam` and `addTeamRepo` in `teacher/tarefas.html`
- [x] 3.2 After `createOrgRepo()` succeeds, call `ensureAlunosTeam(org)` then `addTeamRepo(team.id, org, repo)` before setting topics

## 4. Specs — Sync delta specs to main specs

- [x] 4.1 Sync `gitea-bridge` delta (modified createOrganization + modified createOrgRepo + added addTeamRepo) to `openspec/specs/gitea-bridge/spec.md`
- [x] 4.2 Sync `teacher-tasks` delta (modified task creation flow) to `openspec/specs/teacher-tasks/spec.md`
- [x] 4.3 Sync `teacher-classes` delta (modified class creation with private org) to `openspec/specs/teacher-classes/spec.md`