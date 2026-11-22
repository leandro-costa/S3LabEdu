## MODIFIED Requirements

### Requirement: Teacher tracking dashboard with filters
(Unchanged behavior, but enrollment and acceptance counts are now derived from Gitea.)

#### Scenario: Dashboard overview displayed
- **WHEN** teacher accesses the tracking dashboard
- **THEN** the system SHALL show a filterable table with:
  - Task name (from repo name)
  - Class name (from org name)
  - Enrolled students: count of "alunos" team members in the class org
  - Students who accepted: count of forks of the task repo
  - Students who delivered: count of forks with open PRs

### Requirement: Dashboard shows pending approvals for unlinked forks
The system SHALL display a "Pendentes de Aprovação" section listing forks by users not in the "alunos" team.

#### Scenario: Pending forks listed
- **WHEN** teacher views the tracking dashboard
- **THEN** the system SHALL show a section with forks from users who are not members of the "alunos" team, with an "Aprovar" button for each

#### Scenario: Teacher approves pending fork
- **WHEN** teacher clicks "Aprovar" on a pending fork
- **THEN** the system SHALL call `addTeamMember(teamId, username)` and move the student to the enrolled list

### Requirement: Teacher can view student list per task with fork status
(Unchanged — already reads forks and PRs from Gitea.)

#### Scenario: Student list per task
- **WHEN** teacher selects a task row
- **THEN** the system SHALL display a list of students (Gitea username) from the "alunos" team, and for each student check fork and PR status from the Gitea API

### Requirement: Teacher can delete a student's fork from the detail modal
The system SHALL allow the teacher to delete a student's fork repository from the detail modal to enable re-acceptance with a fresh repo.

#### Scenario: Fork deleted from modal
- **WHEN** teacher clicks "Excluir" next to a student fork (enrolled or pending)
- **THEN** the system SHALL show a confirmation dialog, call `deleteRepo(username, repoName)` (`DELETE /api/v1/repos/{username}/{repo}`), and refresh the modal

#### Scenario: Delete button shown for enrolled students
- **WHEN** the detail modal lists an enrolled student who has a fork
- **THEN** the system SHALL show an "Excluir" button alongside their fork status

#### Scenario: Delete button shown for pending forks
- **WHEN** the detail modal lists a pending/unlinked fork
- **THEN** the system SHALL show both "Aprovar" and "Excluir" buttons in the action column
