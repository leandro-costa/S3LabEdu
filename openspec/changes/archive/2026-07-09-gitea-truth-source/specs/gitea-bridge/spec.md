## ADDED Requirements

### Requirement: Gitea API module filters orgs by owner
The system SHALL provide a function that returns only organizations where the authenticated user is owner.

#### Scenario: Owner orgs filtered
- **WHEN** `listOwnerOrganizations()` is called
- **THEN** the function SHALL call `GET /api/v1/users/{username}/orgs` using the stored teacher username to avoid `permission` field format ambiguity

### Requirement: Gitea API module manages repo topics
The system SHALL provide functions to read and write topics on repositories.

#### Scenario: Topics read from repo
- **WHEN** `getRepoTopics(owner, repo)` is called
- **THEN** the function SHALL call `GET /api/v1/repos/{owner}/{repo}/topics` and return the list of topics

#### Scenario: Topics set on repo
- **WHEN** `setRepoTopic(owner, repo, topic)` is called
- **THEN** the function SHALL add the topic via `PUT /api/v1/repos/{owner}/{repo}/topics`

### Requirement: Gitea API module lists team members
The system SHALL provide a function to list all members of a team.

#### Scenario: Team members listed
- **WHEN** `listTeamMembers(teamId)` is called
- **THEN** the function SHALL call `GET /api/v1/teams/{teamId}/members` and return the list of members

## MODIFIED Requirements

### Requirement: Gitea API module creates organization (non-admin route)
The system SHALL create a Gitea organization for the authenticated user (no longer using the admin route).

#### Scenario: Org created
- **WHEN** `createOrganization(name, description)` is called
- **THEN** the function SHALL call `POST /api/v1/orgs` with `{ username: name, description, visibility: 'public' }` instead of `/admin/users/{username}/orgs`

### Requirement: Gitea API module lists authenticated user repos
The system SHALL provide a function to list all repos accessible to the authenticated user.

#### Scenario: User repos listed
- **WHEN** `listUserRepos()` is called
- **THEN** the function SHALL call `GET /api/v1/user/repos` and return the list including personal forks

### Requirement: Gitea API module deletes a repository
The system SHALL provide a function to delete a repository.

#### Scenario: Repo deleted
- **WHEN** `deleteRepo(owner, repo)` is called
- **THEN** the function SHALL call `DELETE /api/v1/repos/{owner}/{repo}`

### Requirement: Gitea API module creates fork without Sudo
The system SHALL fork a repository into the authenticated user's namespace (no longer using the `Sudo` header).

#### Scenario: Fork created
- **WHEN** `createFork(owner, repo)` is called without a `giteaUser` parameter
- **THEN** the function SHALL call `POST /api/v1/repos/{owner}/{repo}/forks` without the `Sudo` header, and the fork SHALL go to the authenticated user's namespace

## REMOVED Requirements

### Requirement: Gitea API module creates organization with team in one call
**Reason**: The `createOrganization()` function creates the org; team creation is a separate step called after org creation in the UI flow.
**Migration**: The turmas page creates the org, then immediately creates the "alunos" team via `createOrgTeam()`.
