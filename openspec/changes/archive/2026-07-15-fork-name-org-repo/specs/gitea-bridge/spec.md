## MODIFIED Requirements

### Requirement: Gitea API module creates forks
The system SHALL provide a function to fork a repo using the OAuth access token, accepting an optional custom fork name.

#### Scenario: Fork created with custom name
- **WHEN** `createFork(owner, repo, forkName)` is called with a `forkName`
- **THEN** the function SHALL make `POST /api/v1/repos/{owner}/{repo}/forks` with `{ name: forkName }` and return fork data

#### Scenario: Fork created with default name
- **WHEN** `createFork(owner, repo)` is called without `forkName`
- **THEN** the function SHALL make `POST /api/v1/repos/{owner}/{repo}/forks` with `{}` and return fork data
