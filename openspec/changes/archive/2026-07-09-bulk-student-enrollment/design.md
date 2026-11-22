## Context

The academic task system stores student enrollments in localStorage only — there is no Gitea-side representation of "this student belongs to this class." Teachers add students one email at a time via `turma-alunos.html`. The Gitea API module (`gitea-api.js`) has no team-related functions, and no Gitea team/org membership is managed for students.

Classes are linked to a Gitea organization (selected at creation), but students are never added as members of that org or any team within it. This means students have no repository access within the class org — they rely on public repos or individual fork permissions.

## Goals / Non-Goals

**Goals:**
- Allow teachers to paste multiple student emails at once (one per line) in a textarea
- Resolve each email to a Gitea username via the Gitea API
- Create an "alunos" team in the class's Gitea organization if it doesn't exist
- Add each student with a resolved Gitea username to the "alunos" team
- Store enrollment records in localStorage as before, now with resolved Gitea usernames
- Show per-email status feedback (resolved, added to team, not found, error)

**Non-Goals:**
- Removing students from Gitea teams (de-enrollment deferred)
- Team permission management (default "alunos" team with read access to org repos)
- Student self-enrollment changes
- UI for viewing/managing team membership outside of enrollment

## Decisions

1. **Resolve email → Gitea username via `/api/v1/users/search?q=<email>`**
   - Gitea's user search endpoint supports querying by email and returns the matching user's `login` (username).
   - **Alternative considered**: Require teacher to provide Gitea usernames alongside emails — rejected because it doubles the data entry burden and the email is already known.

2. **Team named "alunos" per organization, created on first enrollment**
   - When the first batch enrollment happens for a class org, check if "alunos" team exists via `GET /orgs/{org}/teams`. If not, create it with `POST /orgs/{org}/teams`.
   - **Alternative considered**: One team per class — rejected because a student in multiple classes would need to be in multiple teams, and the org-level team is simpler to manage.

3. **Only add students with resolved Gitea usernames to the team**
   - If email lookup fails (user not found), the student is still saved in localStorage (for tracking) but not added to the Gitea team. The UI shows "Não encontrado no Gitea" for that email.
   - **Alternative considered**: Fail the entire batch if any email is unresolved — rejected because partial enrollment is better than blocking all students for one bad email.

4. **Sequential processing with per-email status**
   - Process emails one by one: lookup → if found → add to team → save to localStorage. Show real-time per-email status in the UI.
   - **Alternative considered**: Parallel processing — rejected because rate limits and error handling are simpler sequentially, and batch sizes are expected to be small (tens, not hundreds).

## Risks / Trade-offs

- **Risk: Gitea user not found by email** → Mitigation: Student is saved in localStorage but skipped for team membership. Teacher sees "Não encontrado" status.
- **Risk: Teacher token lacks permission to create teams or add members** → Mitigation: The OAuth/token must have org admin or owner privileges. Show clear error if team creation fails.
- **Risk: Student already in "alunos" team** → Mitigation: Gitea's `PUT /teams/{id}/members/{username}` returns appropriate status; treat duplicate as success.
- **Risk: Large batch (50+ emails)** → Mitigation: Sequential processing with visual progress indicator. Consider adding a "Cancelar" button.
- **Risk: "alunos" team name conflicts with existing team** → Mitigation: Use the team if it already exists; don't try to create a duplicate.
