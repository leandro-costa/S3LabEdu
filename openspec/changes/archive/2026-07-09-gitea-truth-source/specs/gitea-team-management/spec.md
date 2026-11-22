## MODIFIED Requirements

### Requirement: System looks up "alunos" team in organization
(Unchanged.)

#### Scenario: Team exists
- **WHEN** the system queries `GET /api/v1/orgs/{org}/teams`
- **THEN** it SHALL find the team named "alunos"

#### Scenario: Team does not exist
- **WHEN** no team named "alunos" is found
- **THEN** the system SHALL create it via `POST /api/v1/orgs/{org}/teams`

### Requirement: "alunos" team created when class org is created
The system SHALL create the "alunos" team automatically when a new class (Gitea organization) is created.

#### Scenario: Team created on org creation
- **WHEN** teacher creates a new class
- **THEN** the system SHALL create the org and immediately create the "alunos" team with read permission on org repos

### Requirement: Enrollment is the only source of team membership
The "alunos" team in Gitea IS the enrollment record — there is no separate enrollment data store.

#### Scenario: Enrollment = team membership
- **WHEN** checking if a student is enrolled
- **THEN** the system SHALL check membership in the "alunos" team; if the student is a member, they are enrolled
