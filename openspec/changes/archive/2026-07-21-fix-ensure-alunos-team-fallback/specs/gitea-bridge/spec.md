## MODIFIED Requirements

### Requirement: System looks up "alunos" team in organization
The system SHALL check if a team named "alunos" exists in the class's Gitea organization before listing members.

#### Scenario: Team lookup handles null response
- **WHEN** the system queries `GET /api/v1/orgs/{org}/teams` for the class organization
- **THEN** the system SHALL handle a null/undefined response gracefully by treating it as an empty array

### Requirement: System ensures "alunos" team exists
The system SHALL create the "alunos" team automatically when needed, with a fallback lookup if the creation response is incomplete.

#### Scenario: Team creation returns incomplete response
- **WHEN** the system calls `POST /api/v1/orgs/{org}/teams` and the response has no `id`
- **THEN** the system SHALL log a warning with the response details via `console.warn`
- **THEN** the system SHALL attempt a fallback lookup via `getTeamByName`
- **THEN** the system SHALL succeed if the team is found via fallback
