## Why

The academic system currently stores classes, tasks, enrollments, and acceptances in localStorage, duplicating data that already exists in Gitea (organizations, repositories, team members, forks, pull requests). This causes inconsistency — data in localStorage can diverge from what's actually in Gitea. Making Gitea the single source of truth eliminates duplication, ensures data is always current, and lets teachers manage everything directly through Gitea if they prefer.

## What Changes

- **BREAKING**: Classes are no longer stored in localStorage — each Gitea organization where the teacher is owner IS a class
- **BREAKING**: Tasks are no longer stored in localStorage — each repository in the class organization IS a task
- **BREAKING**: Enrollments are no longer stored in localStorage — members of the "alunos" team in the class organization ARE the enrolled students
- Acceptances are no longer stored in localStorage — forks of the task repository in student namespaces ARE the acceptances
- Fork without team membership → aparece como "Pendente de Aprovação" no dashboard do professor
- `createFork()` sem `Sudo` — aluno usa o próprio token
- `createOrganization()` usa rota para usuário autenticado em vez de rota admin
- Ao criar org (turma), criar time "alunos" automaticamente
- Ao criar repo (tarefa), adicionar tópico `deadline:YYYY-MM-DD`
- Migration script para importar dados existentes do localStorage

## Capabilities

### New Capabilities
- `gitea-org-as-class`: Derive classes from Gitea organizations where the teacher is owner
- `gitea-repo-as-task`: Derive tasks from repositories in a class organization with `type:task` topic
- `team-membership-as-enrollment`: Derive enrollments from "alunos" team members
- `fork-as-acceptance`: Derive acceptances from forks; forks without team membership are pending approval
- `migration-import`: One-time script to migrate existing localStorage data into Gitea

### Modified Capabilities
- `teacher-classes`: Source of truth changes from localStorage to Gitea organizations; org creation creates "alunos" team
- `teacher-tasks`: Source of truth changes from localStorage to Gitea repositories; deadline stored as topic
- `teacher-tracking`: Shows pending approvals (forks without team membership)
- `student-tasks`: Reads tasks and enrollments from Gitea instead of localStorage
- `bulk-enrollment`: Writes directly to Gitea team (already implemented)
- `gitea-team-management`: "alunos" team created on org creation; enrollment = team membership
- `task-enrollment-link`: Page requires authentication; fork is the acceptance record
- `gitea-bridge`: Fix `createOrganization()` route (remove admin); fix `createFork()` (remove Sudo); add topics, `listOwnerOrganizations()`, `listTeamMembers()`

## Impact

- `components/gitea-api.js`: Fix `createOrganization()` route; remove `Sudo` from `createFork()`; add topic functions, `listOwnerOrganizations()`, `listTeamMembers()`
- `pages/academic/teacher/turmas.html`: Read classes from Gitea orgs instead of localStorage; after creating org, create "alunos" team
- `pages/academic/teacher/tarefas.html`: Read tasks from Gitea repos filtered by `type:task` topic; add deadline topic on repo creation
- `pages/academic/teacher/acompanhamento.html`: Add "Pendentes de Aprovação" section showing forks without team membership
- `pages/academic/student/dashboard.html`: Read enrollments from team membership, tasks from repos
- `pages/academic/student/minhas-tarefas.html`: Read acceptances from forks
- `pages/academic/task/index.html`: Require authentication; fork with student's own token
- localStorage: `academic_classes`, `academic_tasks`, `academic_enrollments`, `academic_acceptances` become cache-only
