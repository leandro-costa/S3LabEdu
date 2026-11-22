## 1. OAuth login — capture full_name

- [x] 1.1 In `oauth-callback.html`, capture `user.full_name` from the `/api/v1/user` response and store it as `teacher_full_name` or `student_full_name` in sessionStorage
- [x] 1.2 Add `teacher_full_name` and `student_full_name` to the BroadcastChannel payload in `oauth-callback.html`

## 2. gitea-api.js — return full_name in findUserByEmail + update displayUserInfo + AUTH_KEYS

- [x] 2.1 Modify `findUserByEmail()` to return `{ login, full_name, email }` from the first matching user instead of just the login string
- [x] 2.2 Update `displayUserInfo()` to read and display `full_name` from sessionStorage alongside email and username
- [x] 2.3 Add `'teacher_full_name'` and `'student_full_name'` to the `AUTH_KEYS` array

## 3. page-header — show full_name instead of email

- [x] 3.1 In `components/page-header.js`, read `${role}_full_name` from sessionStorage and display it as the primary identifier (bold text) instead of email; keep `(username)` in parentheses

## 4. turma-alunos.html — add full_name column

- [x] 4.1 Update `teacher/turma-alunos.html` table header from "Email" to "Nome Completo"
- [x] 4.2 Update the table cell to show `m.full_name || m.login` instead of `m.email`
- [x] 4.3 Update `findUserByEmail` call sites in bulk enroll to use `.login` on the returned object

## 5. detalhes-tarefa.html — show full_name in student rows

- [x] 5.1 In the enrolled members loop, display `m.full_name` (falling back to `m.login`) followed by the Gitea username in parentheses in the first column
- [x] 5.2 In the non-enrolled fork owners loop, display fork owner `full_name` if available; currently only `login` is used

## 6. Sync delta specs to main specs

- [x] 6.1 Sync `gitea-bridge` delta to `openspec/specs/gitea-bridge/spec.md`
- [x] 6.2 Sync `teacher-classes` delta to `openspec/specs/teacher-classes/spec.md`
- [x] 6.3 Sync `teacher-tasks` delta to `openspec/specs/teacher-tasks/spec.md`
