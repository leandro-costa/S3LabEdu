## 1. Gitea API team functions

- [x] 1.1 Implement `findUserByEmail(email)` — calls `GET /api/v1/users/search?q=<email>` and returns the first matching user's `login`
- [x] 1.2 Implement `listOrgTeams(orgName)` — calls `GET /api/v1/orgs/{org}/teams`
- [x] 1.3 Implement `getTeamByName(orgName, teamName)` — calls `listOrgTeams()` and filters by name
- [x] 1.4 Implement `createOrgTeam(orgName, teamName)` — calls `POST /api/v1/orgs/{org}/teams` with read permission
- [x] 1.5 Implement `addTeamMember(teamId, username)` — calls `PUT /api/v1/teams/{id}/members/{username}`
- [x] 1.6 Export all new functions from `gitea-api.js`

## 2. Bulk enrollment UI

- [x] 2.1 Replace single email input in `turma-alunos.html` with a textarea (placeholder: "Um email por linha")
- [x] 2.2 Add "Adicionar em Lote" button that reads all lines from the textarea
- [x] 2.3 Add a status area below the textarea showing per-email progress (processing/success/not found/error)
- [x] 2.4 Implement sequential processing: for each email, call `findUserByEmail()` then save enrollment in localStorage

## 3. Team management integration

- [x] 3.1 Before batch enrollment, call `getTeamByName(org, "alunos")` and create the team if it doesn't exist via `createOrgTeam()`
- [x] 3.2 For each successfully resolved student, call `addTeamMember(teamId, username)`
- [x] 3.3 Handle errors: show per-email status for API failures (permission denied, Gitea unavailable)
- [x] 3.4 Treat "already a member" response as success

## 4. Update enrollment record

- [x] 4.1 When `findUserByEmail()` succeeds, save the enrollment with `giteaUser` populated in `localStorage['academic_enrollments']`
- [x] 4.2 When `findUserByEmail()` fails, save enrollment with `giteaUser: ""` and show "Não encontrado" in the status area
- [x] 4.3 Add "Tentar novamente" button for students with unresolved Gitea username

## 5. Update tracking dashboard

- [x] 5.1 Add "Matriculados" column to the tracking dashboard showing enrollment count per class from localStorage
- [x] 5.2 Ensure dashboard counts include students added via bulk enrollment
