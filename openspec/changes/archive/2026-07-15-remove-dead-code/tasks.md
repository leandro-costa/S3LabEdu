## 1. Pages — Remove setupLogout() import and call

- [x] 1.1 Remove `setupLogout` from import and remove `setupLogout()` call in `teacher/turmas.html`
- [x] 1.2 Remove `setupLogout` from import and remove `setupLogout()` call in `teacher/tarefas.html`
- [x] 1.3 Remove `setupLogout` from import and remove `setupLogout()` call in `teacher/acompanhamento.html`
- [x] 1.4 Remove `setupLogout` from import and remove `setupLogout()` call in `student/dashboard.html`
- [x] 1.5 Remove `setupLogout` from import and remove `setupLogout()` call in `student/minhas-tarefas.html`

## 2. gitea-api.js — Remove dead functions and clean up exports

- [x] 2.1 Remove `function setupLogout() {}` (lines 33-34)
- [x] 2.2 Remove `function isOrgOwner()` definition (lines 359-368)
- [x] 2.3 Remove `function broadcastAuth()` definition (lines 402-406) and `window.broadcastAuth = broadcastAuth` (line 417)
- [x] 2.4 Remove `setupLogout`, `isOrgOwner`, `logout`, `isTeamMember` from the export statement (line 419)

## 3. Spec — Update shared-auth-layer

- [x] 3.1 Remove the "Logout wiring helper" requirement section from `openspec/specs/shared-auth-layer/spec.md`
