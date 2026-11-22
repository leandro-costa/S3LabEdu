## Why

Adding students to a class is currently one-by-one via email, with no integration to Gitea — students are not added to any team or organization in Gitea, so they have no repository access within the class org. Teachers need to enroll multiple students at once and have them automatically added as members of the "alunos" team in the class's Gitea organization, giving them access to view and fork task repositories.

## What Changes

- Replace single email input with a textarea accepting one email per line for bulk enrollment
- Add Gitea team management: create/find an "alunos" team within the class organization, add enrolled students as team members
- Lookup Gitea username by email via Gitea API (`/api/v1/users/search?q=<email>`)
- Update enrollment records in localStorage to include Gitea username when resolved
- Update `turma-alunos.html` UI to show bulk input and enrollment status feedback

## Capabilities

### New Capabilities
- `bulk-enrollment`: Textarea for multiple emails, one per line; resolve Gitea usernames; add students to class in localStorage
- `gitea-team-management`: Create "alunos" team in a Gitea organization if it doesn't exist; add members to that team

### Modified Capabilities
- `teacher-classes`: Student enrollment now includes bulk input and Gitea team membership
- `gitea-bridge`: New functions for user lookup by email, team creation, and team member management
- `teacher-tracking`: Enrollment display updated to reflect Gitea team membership status

## Impact

- `pages/academic/teacher/turma-alunos.html`: Replace single-input form with textarea + "Adicionar em Lote" button; show per-email enrollment status (found/not found/added)
- `components/gitea-api.js`: New functions: `findUserByEmail()`, `listOrgTeams()`, `createTeam()`, `addTeamMember()`, `getTeamByName()`
- `openspec/specs/teacher-classes/spec.md`: Updated with bulk enrollment requirements
- `openspec/specs/gitea-bridge/spec.md`: Updated with team management function specs
- `openspec/specs/teacher-tracking/spec.md`: Updated to reflect team membership status
