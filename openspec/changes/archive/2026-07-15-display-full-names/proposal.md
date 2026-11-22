## Why

The app currently displays Gitea usernames and emails everywhere (header, student tables, detail views), but never shows the user's full/real name — which is what teachers and students actually recognize. The Gitea API already returns `full_name` on every user endpoint; we just don't read or display it.

## What Changes

- **OAuth login**: Capture `user.full_name` from the Gitea `/api/v1/user` endpoint and store it in sessionStorage as `teacher_full_name` / `student_full_name`
- **Header**: Show full name (instead of email) in `<page-header>`, with username in parentheses
- **Student table** (`turma-alunos.html`): Replace the "Email" column with "Nome Completo" using `m.full_name` from `listTeamMembers`
- **Student detail** (`detalhes-tarefa.html`): Add `m.full_name` to the "Gitea" column display
- **findUserByEmail**: Return the full user object (login + full_name + email) instead of just the login string, so callers can display the full name
- **displayUserInfo**: Add `full_name` to the data it reads from sessionStorage

## Capabilities

### New Capabilities

None — this modifies existing features.

### Modified Capabilities

- `gitea-bridge`: OAuth login flow now captures `full_name` from `/api/v1/user` and stores it; `findUserByEmail` returns full user object; `displayUserInfo` reads and displays `full_name`
- `teacher-classes`: Enrolled student table in `turma-alunos.html` shows full name instead of email
- `teacher-tasks`: Student detail view in `detalhes-tarefa.html` shows full name alongside Gitea username

## Impact

- `oauth-callback.html` — capture `user.full_name` from API response, store in sessionStorage
- `components/gitea-api.js` — `displayUserInfo()` reads full_name; `findUserByEmail()` returns user object; add full_name to AUTH_KEYS
- `components/page-header.js` — display full_name from sessionStorage instead of email
- `teacher/turma-alunos.html` — replace email column with full name
- `teacher/detalhes-tarefa.html` — display full_name in student rows
- All teacher pages that call `displayUserInfo('teacher')` — update if needed
