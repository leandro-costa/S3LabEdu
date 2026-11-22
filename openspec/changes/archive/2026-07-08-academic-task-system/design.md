## Context

The project has a working web component architecture (vanilla Web Components, Shadow DOM, CSS custom properties, modular components/) used for static content sites. This change introduces a data-driven application with two profiles (teacher, student) and integration with the Gitea API. No backend — all data lives in localStorage (class, task, enrollment, acceptance metadata) and Gitea (repos, forks, organizations).

The Gitea API is used with a single admin token shared by all users:
- Listing organizations (teacher selects which org a class belongs to)
- Listing organization repos (teacher selects which repo a task links to)
- Creating forks (student forks a task repo into their namespace via token admin)
- Checking fork status via opção A — `GET /repos/{owner}/{repo}/forks` and filtering by student Gitea username

## Navigation Map

```
/academic/index.html (profile selector)
  ├── [Professor] → prompt admin token → /academic/teacher/#turmas
  │                                    → /academic/teacher/#tarefas
  │                                    → /academic/teacher/#acompanhamento
  └── [Aluno]     → prompt email + gitea username
                    → /academic/student/#dashboard
                    → /academic/student/#minhas-tarefas

/academic/task/{taskId} (public — no token required)
  → Shows task description, class, deadline
  → Form: email + Gitea username
  → Button: "Inscrever e Aceitar Tarefa"
```

## Goals / Non-Goals

**Goals:**
- Teacher can register classes linked to Gitea organizations with shareable enrollment links
- Teacher can register tasks linked to Gitea repos with auto-generated unique enrollment links
- Teacher tracking dashboard shows acceptance stats and fork delivery status per student (opção A)
- Student can access a task via enrollment link, enter email + Gitea username, auto-enroll in class and accept task
- Student dashboard shows enrolled classes, available tasks, and accepted tasks with delivery status
- All UI built with generic `ui-*` components — zero domain-specific components

**Non-Goals:**
- No backend server or database (reserved for future change)
- No OAuth or real authentication (single admin token, student identified by email)
- No real-time updates (manual refresh)
- No grade attribution or feedback

## Data Model (localStorage schemas)

```json
// class:{id} — class registration
{ "id": "class-uuid", "name": "ADS-2025.1", "description": "...",
  "giteaOrg": "ifba-ads", "createdAt": "2025-08-01" }

// task:{id} — task registration
{ "id": "task-uuid", "classId": "class-uuid", "name": "Projeto 1",
  "description": "CRUD em Java", "deadline": "2025-08-15",
  "repoOwner": "ifba-ads", "repoName": "projeto1", "enrollmentLink": "abc-123",
  "createdAt": "2025-08-01" }

// enrollment:{email} — student class enrollment (keyed by email for quick lookup)
{ "email": "aluno@ifba.edu.br", "giteaUser": "aluno-gitea",
  "classIds": ["class-uuid", ...], "enrolledAt": "2025-08-10" }

// acceptance:{email}:{taskId} — student task acceptance
{ "email": "aluno@ifba.edu.br", "taskId": "task-uuid",
  "giteaUser": "aluno-gitea", "acceptedAt": "2025-08-10" }
```

## Decisions

- **Single admin token**: Both teacher and student flows use the same admin Gitea token. Teacher configures it on first access. Token is reused for all Gitea API calls including student forks.
- **Per-task enrollment link**: Each task generates a unique hash used in `/academic/task/{hash}`. This link is public and serves as both class enrollment and task acceptance in one step.
- **Student identified by email**: Email is the unique student key. Gitea username is stored alongside for fork tracking. Student re-identifies by email on the dashboard (localStorage lookup).
- **Opção A for fork checking**: `GET /repos/{owner}/{repo}/forks` lists all forks, filtered by student Gitea username stored in acceptance record. More reliable than checking repo name directly (students may rename repos).
- **ui-form as container only**: Not schema-driven. `ui-form` is a styled form container with layout and validation helpers. Individual fields use `ui-input`, `ui-select`, `ui-datepicker` as atomic components with explicit HTML.
- **Profile selection via home page**: `/academic/index.html` presents two buttons — "Sou Professor" and "Sou Aluno" — which set a profile flag and reveal the appropriate view. Teacher stays in teacher mode; student stays in student mode.

## Risks / Trade-offs

- [Risk] Admin token in localStorage → Accessible to all JS on the same origin; acceptable for institutional internal tool
- [Risk] localStorage can be cleared → Data loss of class/task metadata would need re-entry; mitigated by eventual backend migration
- [Trade-off] Opção A (list forks + filter) vs Opção B (direct 200/404 check) → Opção A is slower but reliable even if students rename repos
- [Trade-off] Generic components only → Richer interactions (e.g., inline editing) may require future component extensions