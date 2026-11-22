## MODIFIED Requirements

### Requirement: Teacher can list enrolled students per class from team membership
The system SHALL display a list of all students enrolled in a class by reading the "alunos" team members via `listTeamMembers()`. The table SHALL show each student's full name (from `full_name`), Gitea username, and email.

#### Scenario: Student list displayed
- **WHEN** teacher accesses the student management page for a class (identified by org name)
- **THEN** the system SHALL call `listTeamMembers(teamId)` for the "alunos" team
- **THEN** show a table of enrolled students with their full name, Gitea username, and email
- **THEN** the full name column SHALL fall back to the Gitea username when `full_name` is empty
