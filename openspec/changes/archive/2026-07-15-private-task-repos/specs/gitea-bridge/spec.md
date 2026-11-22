## MODIFIED Requirements

### Requirement: Gitea API module creates organization (non-admin route)

**BREAKING**: Organizations are now created as private instead of public.

The system SHALL create a Gitea organization for the authenticated user. It SHALL use the authenticated user route instead of the admin route. The organization SHALL be created as **private**.

#### Scenario: Private org created
- **WHEN** `createOrganization(name, description)` is called
- **THEN** the function SHALL call `POST /api/v1/orgs` with `{ username: name, description, visibility: 'private' }` instead of `/admin/users/{username}/orgs`

### Requirement: Gitea API module creates repositories

**BREAKING**: Repositories are now created as private instead of public.

The system SHALL provide a function to create a repository within a Gitea organization. The repository SHALL be created as **private**.

#### Scenario: Private repo created in org
- **WHEN** `createOrgRepo(org, name)` is called
- **THEN** the function SHALL make `POST /api/v1/orgs/{org}/repos` with `{ name, auto_init: true, private: true }`

## ADDED Requirements

### Requirement: Gitea API module adds team to repository
The system SHALL provide a function to add a team as a collaborator to a specific repository within an organization.

#### Scenario: Team added to repo
- **WHEN** `addTeamRepo(teamId, owner, repo)` is called
- **THEN** the function SHALL make `PUT /api/v1/teams/{teamId}/repos/{owner}/{repo}` and return the response
