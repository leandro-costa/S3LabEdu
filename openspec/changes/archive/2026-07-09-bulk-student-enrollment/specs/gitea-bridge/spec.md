## ADDED Requirements

### Requirement: Gitea API module finds user by email
The system SHALL provide a function that searches for a Gitea user by email and returns the matching user's login (username).

#### Scenario: User found by email
- **WHEN** `findUserByEmail("student@example.com")` is called
- **THEN** the function SHALL make `GET /api/v1/users/search?q=student@example.com` and return the `login` of the first matching user

#### Scenario: No user found
- **WHEN** no Gitea user matches the given email
- **THEN** the function SHALL return `null`

### Requirement: Gitea API module lists organization teams
The system SHALL provide a function to list all teams in a Gitea organization.

#### Scenario: Teams listed
- **WHEN** `listOrgTeams(orgName)` is called
- **THEN** the function SHALL make `GET /api/v1/orgs/{orgName}/teams` and return the list of teams

### Requirement: Gitea API module creates a team in an organization
The system SHALL provide a function to create a named team in a Gitea organization with read permission on organization repositories.

#### Scenario: Team created
- **WHEN** `createOrgTeam(orgName, teamName)` is called
- **THEN** the function SHALL make `POST /api/v1/orgs/{orgName}/teams` with `{ name: teamName, description: "...", permission: "read" }` and return the created team

### Requirement: Gitea API module finds team by name in organization
The system SHALL provide a function to find a team by name within a Gitea organization, returning the team ID and details.

#### Scenario: Team found by name
- **WHEN** `getTeamByName(orgName, "alunos")` is called and the team exists
- **THEN** the function SHALL return the matching team object (including `id`)

#### Scenario: Team not found
- **WHEN** no team with the given name exists in the organization
- **THEN** the function SHALL return `null`

### Requirement: Gitea API module adds a member to a team
The system SHALL provide a function to add a user as a member of a team.

#### Scenario: Member added to team
- **WHEN** `addTeamMember(teamId, username)` is called
- **THEN** the function SHALL make `PUT /api/v1/teams/{teamId}/members/{username}` and return the response
