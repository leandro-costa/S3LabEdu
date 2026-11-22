## MODIFIED Requirements

### Requirement: Gitea API module manages the OAuth access token
The system SHALL provide a shared module that retrieves and uses the OAuth access token (instead of a hardcoded admin token) for all Gitea API calls.

#### Scenario: Access token retrieved from localStorage
- **WHEN** the module needs to authenticate a Gitea API request
- **THEN** it SHALL retrieve the access token from `localStorage.getItem('oauth_access_token')`

#### Scenario: Token automatically refreshed when expired
- **WHEN** the access token is expired
- **THEN** the module SHALL call the refresh endpoint before retrying the API request

### Requirement: Gitea API module fetches organizations (simplified)
The system SHALL provide a function to list Gitea organizations accessible with the current user's OAuth access token. The function SHALL NOT accept an owner parameter — it always returns orgs for the authenticated user via `/user/orgs`.

#### Scenario: Organizations fetched for authenticated user
- **WHEN** `listOrganizations()` is called without arguments
- **THEN** the function SHALL make `GET /api/v1/user/orgs` with the OAuth access token

### Requirement: Gitea API module fetches organization repos
(Unchanged behavior, using OAuth token instead of admin token.)

#### Scenario: Repos fetched
- **WHEN** `listOrgRepos(orgName)` is called
- **THEN** the function SHALL make `GET /api/v1/orgs/{orgName}/repos` with the OAuth access token

### Requirement: Gitea API module creates forks
(Unchanged behavior, using OAuth token instead of admin token.)

#### Scenario: Fork created for student
- **WHEN** `createFork(owner, repo)` is called
- **THEN** the function SHALL make `POST /api/v1/repos/{owner}/{repo}/forks` with the OAuth access token and return fork data

### Requirement: Gitea API module checks fork by listing and filtering
(Unchanged behavior, using OAuth token instead of admin token.)

#### Scenario: Fork found for student
- **WHEN** `checkFork(owner, repo, giteaUser)` is called and a fork owned by `giteaUser` exists
- **THEN** the function SHALL return the fork repository data

#### Scenario: No fork for student
- **WHEN** `checkFork(owner, repo, giteaUser)` is called and no fork is owned by `giteaUser`
- **THEN** the function SHALL return null

## REMOVED Requirements

### Requirement: Gitea API module manages the admin token
**Reason**: Replaced by OAuth access token flow.
**Migration**: The module now retrieves tokens via `localStorage.getItem('oauth_access_token')` instead of `localStorage.getItem('gitea_admin_token')`.

### Requirement: Gitea API module fetches organizations with owner parameter
**Reason**: The admin-only route `/admin/users/{owner}/orgs` required Gitea admin privileges. With personal OAuth tokens, teachers are not necessarily admins. The function now always uses `/user/orgs` for the authenticated user.
**Migration**: Remove the `owner` parameter from `listOrganizations()`. Update callers in `turmas.html` and `tarefas.html` to call `listOrganizations()` without arguments.
