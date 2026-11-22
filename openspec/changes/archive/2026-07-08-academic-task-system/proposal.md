## Why

Professors at IFBA need a digital workflow to manage programming assignments integrated with Gitea. Currently there is no centralized system to create classes, link tasks to repositories, and track student forks and submissions. This system bridges the gap between classroom management and version control, running as a static frontend that interacts with the Gitea API and localStorage, with a future backend planned.

## What Changes

- Create pages for two access profiles: Professor and Aluno
- Professor flow: manage classes linked to Gitea organizations, create tasks linked to repos, generate enrollment links per task, track student acceptance and fork delivery
- Student flow: access a task via unique link → provide email + Gitea username → automatic enrollment in the class + task acceptance. Dashboard shows enrolled classes, available tasks, and accepted tasks with delivery status
- Integrate with Gitea API for organization/repo/fork operations using a single admin token
- Reuse and extend existing web component architecture with new generic `ui-*` components only
- Store enrollment, class, task, and acceptance metadata in localStorage (future backend will replace this)
- New capability: `task-enrollment-link` — unique per-task enrollment link that handles class enrollment + task acceptance in one step

## Capabilities

### New Capabilities
- `teacher-classes`: Teacher creates and manages classes linked to Gitea organizations
- `teacher-tasks`: Teacher creates tasks linked to Gitea repositories, generates enrollment links per task
- `teacher-tracking`: Teacher dashboard tracking student task acceptance and fork delivery via Gitea API (opção A — list forks and filter)
- `student-tasks`: Student informs email + Gitea username, views enrolled classes, available tasks, accepted tasks with fork status
- `task-enrollment-link`: Public page per task — student registers email + Gitea username, auto-enrolls in class, accepts task via fork
- `gitea-bridge`: Client-side integration with Gitea API using admin token for org/repo/fork operations

### Modified Capabilities
- (none)

## Impact

- **pages/**: `/academic/index.html` (profile selector), `/academic/teacher/` (teacher views), `/academic/student/` (student dashboard), `/academic/task/{id}` (public enrollment page)
- **components/**: New generic `ui-table`, `ui-input`, `ui-select`, `ui-modal`, `ui-status-badge`; existing `app-header`, `app-footer`, `ui-card`, `ui-grid`, `ui-section-title` reused
- **tokens/**: New academic theme variant in design-tokens.css
- **No backend**: localStorage + Gitea API with a single admin token — pure client-side app