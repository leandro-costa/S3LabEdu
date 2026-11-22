## Context

The system currently has two nearly-identical login pages (`login-professor.html`, `login-aluno.html`) that both collect email, Gitea username, Gitea URL, and Client ID. After OAuth authentication, the `oauth-callback.html` overrides the email and username with values from the Gitea API (`/api/v1/user`), making the form fields for email and username redundant. The role (professor vs student) is detected automatically from the `restricted` flag in the API response.

## Goals / Non-Goals

**Goals:**
- Single unified login page (`login.html`)
- Only collect Gitea URL and Client ID from the user
- Remove redundant email and Gitea username fields
- Remove `login-professor.html` and `login-aluno.html`

**Non-Goals:**
- No change to the OAuth PKCE flow itself
- No change to sessionStorage keys or internal page behavior
- No change to role detection mechanism

## Decisions

1. **Unified form with only 2 fields** — Gitea URL and Client ID are the only configuration the user needs. Email and username come from the Gitea API.
2. **Single redirect URI** — `window.location.origin + '/pages/academic/oauth-callback.html'` remains the same for the unified login.
3. **No fallback for email/user** — The callback will use only API data (`apiEmail`, `apiUsername`). If the API returns empty, the sessionStorage keys will be set to empty strings (acceptable edge case — the user can re-login).
4. **Keep existing sessionStorage keys** — `teacher_email`, `teacher_gitea_user`, `student_email`, `student_gitea_user` remain unchanged. Internal pages depend on these keys.

## Risks / Trade-offs

- **API unavailability** → If the API call to `/api/v1/user` fails, the callback currently falls back to form data. With removal, the fallback is empty. Mitigation: the callback catches fetch errors and shows a clear error message.
- **No email in Gitea user profile** → Gitea creates users with optional email. If empty, `apiEmail` could be null. Mitigation: the system already works with empty email (just shows blank).
