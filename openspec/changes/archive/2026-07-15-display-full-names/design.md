## Context

Currently the app identifies users exclusively by Gitea username (`login`) and email. The `<page-header>` component shows email as the primary identifier with username in parentheses. Student tables show username and email columns. The Gitea API already returns `full_name` on every user/team endpoint but the codebase never reads it.

The change requires modifying 5 files across the auth flow, shared components, and teacher pages.

## Goals / Non-Goals

**Goals:**
- Capture `full_name` from Gitea during OAuth login and store in sessionStorage
- Replace email with full name as the primary user identifier in the page header
- Add full name column to the student enrollment table (`turma-alunos.html`)
- Add full name display to the student detail view (`detalhes-tarefa.html`)
- Return full user object from `findUserByEmail()` so callers can access `full_name`

**Non-Goals:**
- No changes to Gitea API calls or backend
- No changes to student-facing pages (dashboard, minhas-tarefas) unless they also display user info in headers
- No database or persistence changes

## Decisions

1. **Store full_name in sessionStorage** alongside existing `_email` and `_gitea_user` keys. Keys follow the same naming pattern: `teacher_full_name`, `student_full_name`. This is consistent, survives page navigation, and is cleared on logout via the existing `AUTH_KEYS` mechanism.

2. **Header: Replace email with full_name** — `<page-header>` shows `full_name` as the bold primary text instead of email, keeping `(username)` in parentheses. Email is removed from the header since it's less meaningful than the real name.

3. **findUserByEmail returns object instead of string** — Change from returning `users.data[0].login` to returning `{ login, full_name, email }` from the first match. This is a **BREAKING** change for callers; they must use `.login` instead of the raw return value. Each caller (`turma-alunos.html` bulk enroll) needs updating.

4. **Student table: Add full_name column** — Replace the "Email" column header with "Nome Completo", showing `m.full_name || m.login` as the cell value. Email can still be accessed via `m.email` if needed.

5. **Detail view: Concatenate full_name + login** — Show "Full Name (login)" in the student detail rows, falling back to just "login" if full_name is empty.

## Risks / Trade-offs

- **findUserByEmail breaking change** — callers that destructure the return value (e.g., `const login = await findUserByEmail(...)`) will break since the return is now an object. Mitigation: update all call sites in the same change; there are only 2 callers (`turma-alunos.html` bulk enroll and potentially others).
- **Full name may be empty** — Gitea users might not have a `full_name` set. Mitigation: always fall back to `login` when `full_name` is falsy.
