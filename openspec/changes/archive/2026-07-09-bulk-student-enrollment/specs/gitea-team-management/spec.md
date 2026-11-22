## ADDED Requirements

### Requirement: System looks up "alunos" team in organization
The system SHALL check if a team named "alunos" exists in the class's Gitea organization before attempting enrollment.

#### Scenario: Team exists
- **WHEN** the system queries `GET /api/v1/orgs/{org}/teams` for the class organization
- **THEN** it SHALL find the team named "alunos" and use it for member addition

#### Scenario: Team does not exist
- **WHEN** no team named "alunos" is found in the organization
- **THEN** the system SHALL create it via `POST /api/v1/orgs/{org}/teams` with name "alunos", description "Alunos da turma", and read permission on organization repositories

### Requirement: System adds student to "alunos" team
The system SHALL add a resolved student to the "alunos" team as a member.

#### Scenario: Student added to team
- **WHEN** a student's Gitea username is resolved and the "alunos" team is available
- **THEN** the system SHALL call `PUT /api/v1/teams/{teamId}/members/{username}` to add the student

#### Scenario: Student already in team
- **WHEN** the student is already a member of the "alunos" team
- **THEN** the system SHALL treat it as success without error

### Requirement: Team member addition uses the teacher's OAuth token
All team management API calls SHALL use the teacher's authenticated OAuth token for authorization.

#### Scenario: Token lacks permissions
- **WHEN** the teacher's token does not have permission to create teams or add members in the organization
- **THEN** the system SHALL show an error message indicating insufficient permissions
