# Gitea Team Management

## Purpose
Lookup and management of Gitea teams for student enrollment, supporting "alunos" team discovery, creation, and member addition.

## Requirements

### Requirement: "alunos" team created automatically with org
The system SHALL create the "alunos" team automatically when a new class organization is created.

#### Scenario: Team created on org creation
- **WHEN** a teacher creates a new organization via `createOrganization()`
- **THEN** the system SHALL immediately call `createOrgTeam(orgName, 'alunos')`
- **THEN** the team SHALL have name "alunos", description "Alunos da turma", and read permission

#### Scenario: Team already exists
- **WHEN** the "alunos" team already exists when creating the org
- **THEN** the system SHALL treat it as success

### Requirement: System looks up "alunos" team in organization
The system SHALL check if a team named "alunos" exists in the class's Gitea organization before listing members.

#### Scenario: Team exists
- **WHEN** the system queries `GET /api/v1/orgs/{org}/teams` for the class organization
- **THEN** it SHALL find the team named "alunos" and use it for member listing

#### Scenario: Team does not exist
- **WHEN** no team named "alunos" is found in the organization
- **THEN** the system SHALL create it via `POST /api/v1/orgs/{org}/teams`

### Requirement: System lists team members
The system SHALL list all members of the "alunos" team via `listTeamMembers(teamId)`.

#### Scenario: Members listed
- **WHEN** the teacher views the student list for a class
- **THEN** the system SHALL call `GET /api/v1/teams/{teamId}/members`
- **THEN** the returned members SHALL be the enrolled students

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

### Requirement: Team membership IS enrollment
The "alunos" team membership in a class org SHALL be the single source of truth for enrollment. No localStorage enrollment records are needed.

#### Scenario: Truth source
- **WHEN** the system needs to determine if a student is enrolled in a class
- **THEN** it SHALL check if the student is a member of the "alunos" team in that org
- **WHEN** the teacher views enrolled students
- **THEN** it SHALL list the "alunos" team members via API
