## ADDED Requirements

### Requirement: Gitea API module manages the admin token
The system SHALL provide a shared module for storing, retrieving, and clearing a single Gitea admin API token.

#### Scenario: Admin token stored
- **WHEN** teacher enters the Gitea admin token in the setup prompt
- **THEN** the token SHALL be persisted in localStorage under the key `gitea_admin_token`

#### Scenario: Token cleared
- **WHEN** teacher clicks "Limpar Token"
- **THEN** the token SHALL be removed from localStorage

### Requirement: Gitea API module fetches organizations
The system SHALL provide a function to list Gitea organizations accessible with the admin token.

#### Scenario: Organizations fetched
- **WHEN** `listOrganizations()` is called
- **THEN** the function SHALL make `GET /api/v1/user/orgs` with the admin token

### Requirement: Gitea API module fetches organization repos
The system SHALL provide a function to list repos within a Gitea organization.

#### Scenario: Repos fetched
- **WHEN** `listOrgRepos(orgName)` is called
- **THEN** the function SHALL make `GET /api/v1/orgs/{orgName}/repos` with the admin token

### Requirement: Gitea API module creates forks
The system SHALL provide a function to fork a repo using the admin token.

#### Scenario: Fork created for student
- **WHEN** `createFork(owner, repo)` is called
- **THEN** the function SHALL make `POST /api/v1/repos/{owner}/{repo}/forks` with the admin token and return fork data

### Requirement: Gitea API module checks fork by listing and filtering (opção A)
The system SHALL provide a function to check if a student has forked a repository by listing all forks and filtering by username.

#### Scenario: Fork found for student
- **WHEN** `checkFork(owner, repo, giteaUser)` is called and a fork owned by `giteaUser` exists
- **THEN** the function SHALL return the fork repository data

#### Scenario: No fork for student
- **WHEN** `checkFork(owner, repo, giteaUser)` is called and no fork is owned by `giteaUser`
- **THEN** the function SHALL return null