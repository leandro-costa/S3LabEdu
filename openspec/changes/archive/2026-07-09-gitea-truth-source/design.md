## Context

The academic system currently maintains duplicate state in localStorage while Gitea already has all the structure needed. Four localStorage arrays (`academic_classes`, `academic_tasks`, `academic_enrollments`, `academic_acceptances`) mirror what Gitea already knows.

The system already creates orgs and repos via the teacher's pages, reads forks and PRs from Gitea for tracking, and uses OAuth tokens for authentication. What remains is shifting reads to Gitea and fixing two functions that still assume admin privileges: `createOrganization()` (uses `/admin/users/`) and `createFork()` (uses `Sudo` header).

## Goals / Non-Goals

**Goals:**
- Classes derived from Gitea organizations where teacher is owner
- Tasks derived from repositories with `type:task` topic in the class org
- Enrollments derived from "alunos" team membership
- Acceptances derived from forks of task repos
- Forks without team membership listed as pending approval for the teacher
- Create "alunos" team automatically when creating an org
- Store deadline as repo topic on task creation
- localStorage becomes a read-through cache, not source of truth

**Non-Goals:**
- Removing localStorage entirely (retained as cache)
- Changing how forks and PRs work (already Gitea-native)
- Multi-org or cross-org task assignment
- Changing student authentication (OAuth already in place)

## Decisions

1. **Task metadata stored as repo topics**
   - Store `deadline:YYYY-MM-DD` and `type:task` as topics on repos.
   - Topics are searchable via API and don't pollute the repo description.

2. **Class metadata stored as org description**
   - Class name = org name, class description = org description.

3. **LocalStorage as read-through cache**
   - On page load, fetch from Gitea, write to localStorage, render from localStorage. Background refresh on subsequent loads.

4. **Fork without team membership = pending approval**
   - The tracking dashboard lists all forks of task repos.
   - Forks by users NOT in the "alunos" team appear in a "Pendentes de Aprovação" section.
   - Teacher clicks "Aprovar" → `addTeamMember(teamId, username)`.

5. **`createOrganization()` uses `/orgs` instead of `/admin/users/{user}/orgs`**
   - The admin route requires global admin. The authenticated user route (`POST /orgs`) creates an org owned by the caller.
   - **Alternative considered**: Keep admin route — rejected because teachers use personal OAuth tokens, not admin tokens.

6. **`createFork()` removes `Sudo` header**
   - With the student's own OAuth token, the fork goes to their namespace automatically.
   - **Alternative considered**: Keep `Sudo` — rejected because it only works with admin tokens.

## Risks / Trade-offs

- **Risk: Orgs used for non-class purposes** → Mitigation: Filter by ownership
- **Risk: Deadline metadata lost if topic removed** → Mitigation: Teacher can re-set it. Consider description as fallback.
- **Risk: Migration fails for some records** → Mitigation: Run per-teacher; show per-class status; allow retry
- **Risk: Forks by non-students appear as pending** → Mitigation: Teacher can ignore; only approve known students

## Migration Plan

1. Run migration script per teacher:
   - For each `academic_class` → ensure org exists, create "alunos" team
   - For each `academic_task` → ensure repo exists with deadline topic
   - For each `academic_enrollment` → ensure student is in "alunos" team
   - For each `academic_acceptance` → verify fork exists
2. Rollback: Keep localStorage data intact during migration
