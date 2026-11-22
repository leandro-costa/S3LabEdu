## ADDED Requirements (updated)

### Requirement: New forks add professors as collaborators
When a student forks a task repo, the system SHALL automatically discover the professors (org owners) and add each as an individual collaborator with `write` permission on the fork, ensuring teachers can view commits, tags and issues.

#### Scenario: Professors added as collaborators after fork
- **WHEN** a student completes `createForkSafe(org, repo, forkName)`
- **THEN** the system SHALL discover org owners via `listOrgOwners(org)`
- **THEN** the system SHALL NOT rely on team membership endpoints (not accessible with student token)
- **THEN** for each owner found, the system SHALL call `addRepoCollaborator(studentLogin, forkName, ownerLogin, 'write')`

#### Scenario: No owners found
- **WHEN** no owners are found for the org
- **THEN** the system SHALL NOT throw an error
- **THEN** the system SHALL continue with post-fork processing normally

#### Scenario: Duplicate collaborator handled gracefully
- **WHEN** a professor is already a collaborator on the fork
- **THEN** the system SHALL NOT throw an error
- **THEN** the system SHALL continue processing remaining professors

### Requirement: addRepoCollaborator API function
The `gitea-api.js` module SHALL export a function `addRepoCollaborator(owner, repo, collaborator, permission)` that adds a user or org as a collaborator on a repository.

#### Scenario: Collaborator added via API
- **WHEN** `addRepoCollaborator(owner, repo, collaborator, 'write')` is called
- **THEN** the system SHALL make a `PUT /repos/{owner}/{repo}/collaborators/{collaborator}` request
- **THEN** the request body SHALL contain `{ permission: 'write' }`
