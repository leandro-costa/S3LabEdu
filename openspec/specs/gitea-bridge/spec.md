# Gitea Bridge

## Purpose
Shared module for authenticating with and querying the Gitea API for repository and organization operations, including logout and token revocation.

## Requirements

### Requirement: Gitea API module manages the OAuth access token
The system SHALL provide a shared module that retrieves and uses the OAuth access token for all Gitea API calls.

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

### Requirement: Gitea API module creates organization (non-admin route)
The system SHALL create a Gitea organization for the authenticated user. It SHALL use the authenticated user route instead of the admin route. The organization SHALL be created as **private**.

#### Scenario: Private org created
- **WHEN** `createOrganization(name, description)` is called
- **THEN** the function SHALL call `POST /api/v1/orgs` with `{ username: name, description, visibility: 'private' }` instead of `/admin/users/{username}/orgs`

### Requirement: Gitea API module creates repositories
The system SHALL provide a function to create a repository within a Gitea organization. The repository SHALL be created as **private**.

#### Scenario: Private repo created in org
- **WHEN** `createOrgRepo(org, name)` is called
- **THEN** the function SHALL make `POST /api/v1/orgs/{org}/repos` with `{ name, auto_init: true, private: true }`

### Requirement: Gitea API module adds team to repository
The system SHALL provide a function to add a team as a collaborator to a specific repository within an organization.

#### Scenario: Team added to repo
- **WHEN** `addTeamRepo(teamId, owner, repo)` is called
- **THEN** the function SHALL make `PUT /api/v1/teams/{teamId}/repos/{owner}/{repo}` and return the response

### Requirement: Gitea API module fetches organization repos
The system SHALL provide a function to list repos within a Gitea organization.

#### Scenario: Repos fetched
- **WHEN** `listOrgRepos(orgName)` is called
- **THEN** the function SHALL make `GET /api/v1/orgs/{orgName}/repos` with the OAuth access token

### Requirement: Gitea API module creates forks
The system SHALL provide a function to fork a repo using the OAuth access token, accepting an optional custom fork name.

#### Scenario: Fork created with custom name
- **WHEN** `createFork(owner, repo, forkName)` is called with a `forkName`
- **THEN** the function SHALL make `POST /api/v1/repos/{owner}/{repo}/forks` with `{ name: forkName }` and return fork data

#### Scenario: Fork created with default name
- **WHEN** `createFork(owner, repo)` is called without `forkName`
- **THEN** the function SHALL make `POST /api/v1/repos/{owner}/{repo}/forks` with `{}` and return fork data

### Requirement: Gitea API module checks fork by listing and filtering
The system SHALL provide a function to check if a student has forked a repository by listing all forks and filtering by username.

#### Scenario: Fork found for student
- **WHEN** `checkFork(owner, repo, giteaUser)` is called and a fork owned by `giteaUser` exists
- **THEN** the function SHALL return the fork repository data

#### Scenario: No fork for student
- **WHEN** `checkFork(owner, repo, giteaUser)` is called and no fork is owned by `giteaUser`
- **THEN** the function SHALL return null

### Requirement: Gitea API module finds user by email
The system SHALL provide a function that searches for a Gitea user by email and returns the matching user object (login, full_name, and email).

#### Scenario: User found by email
- **WHEN** `findUserByEmail("student@example.com")` is called
- **THEN** the function SHALL make `GET /api/v1/users/search?q=student@example.com`
- **THEN** it SHALL return `{ login, full_name, email }` of the first matching user

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

### Requirement: Gitea API module adds a member to a team
The system SHALL provide a function to add a user as a member of a team.

#### Scenario: Member added to team
- **WHEN** `addTeamMember(teamId, username)` is called
- **THEN** the function SHALL make `PUT /api/v1/teams/{teamId}/members/{username}` and return the response

### Requirement: Gitea API module removes a member from an organization
The system SHALL provide a function to remove a user from an organization.

#### Scenario: Member removed from org
- **WHEN** `removeOrgMember(org, username)` is called
- **THEN** the function SHALL make `DELETE /api/v1/orgs/{org}/members/{username}`

### Requirement: Gitea API module fetches owner organizations
The system SHALL provide a function that returns organizations where the authenticated user is owner.

#### Scenario: Owner orgs fetched
- **WHEN** `listOwnerOrganizations()` is called
- **THEN** the function SHALL call `GET /api/v1/users/{username}/orgs` using the stored teacher username

### Requirement: Gitea API module manages repo topics
The system SHALL provide functions to read and write topics on repositories.

#### Scenario: Topics read from repo
- **WHEN** `getRepoTopics(owner, repo)` is called
- **THEN** the function SHALL call `GET /api/v1/repos/{owner}/{repo}/topics` and return the list of topics

#### Scenario: Topics set on repo
- **WHEN** `setRepoTopic(owner, repo, topic)` is called
- **THEN** the function SHALL read existing topics, append the new topic, and write via `PUT /api/v1/repos/{owner}/{repo}/topics`

### Requirement: Gitea API module lists team members
The system SHALL provide a function to list all members of a team.

#### Scenario: Team members listed
- **WHEN** `listTeamMembers(teamId)` is called
- **THEN** the function SHALL call `GET /api/v1/teams/{teamId}/members` and return the list of members

### Requirement: Gitea API module lists commits
The system SHALL provide a function to list commits in a repo, optionally filtered by date.

#### Scenario: Commits listed
- **WHEN** `listCommits(owner, repo, since)` is called
- **THEN** the function SHALL call `GET /api/v1/repos/{owner}/{repo}/commits` with an optional `since` parameter

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

### Requirement: Gitea API module provides Forgejo logout URL
The system SHALL expose a function that returns the Forgejo logout URL including a redirect back to the app's landing page.

#### Scenario: Logout URL returned
- **WHEN** `getForgejoLogoutUrl()` is called
- **THEN** it SHALL return `{gitea_url}/user/logout?redirect={origin}/index.html`

### Requirement: OAuth login captures full user name
The OAuth login flow SHALL capture the user's full name from Gitea and store it in sessionStorage alongside email and username.

#### Scenario: Full name stored on login
- **WHEN** the OAuth callback receives user data from `GET /api/v1/user`
- **THEN** the system SHALL store `user.full_name` in `sessionStorage` as `teacher_full_name` or `student_full_name` depending on role

### Requirement: Gitea API module creates repo tags
The system SHALL provide a function to create a Git tag on a repository via the Gitea API.

#### Scenario: Tag created on repo
- **WHEN** `createRepoTag(owner, repo, tagName, target?)` is called
- **THEN** the function SHALL make `POST /api/v1/repos/{owner}/{repo}/tags` with `{ tag_name: tagName, target: target || 'HEAD' }`
- **THEN** it SHALL return the created tag data

#### Scenario: Tag creation fails on empty repo
- **WHEN** the target repo has no commits
- **THEN** the function SHALL catch the error and return `null` instead of throwing

### Requirement: Gitea API module lists repo tags
The system SHALL provide a function to list all tags on a repository via the Gitea API.

#### Scenario: Tags listed for repo
- **WHEN** `listRepoTags(owner, repo)` is called
- **THEN** the function SHALL make `GET /api/v1/repos/{owner}/{repo}/tags`
- **THEN** it SHALL return the array of tag objects, each containing `name` and `commit` fields

### Requirement: API functions must verify Forgejo compatibility
Toda função de integração com a API do Gitea/Gitea SHALL ser verificada quanto à compatibilidade com Forgejo antes da implementação. Funções com comportamento divergente entre Gitea e Forgejo SHALL documentar essa diferença e tratar erros adequadamente.

#### Scenario: Endpoint testado em Forgejo antes da implementação
- **WHEN** uma nova função de API é adicionada ao módulo `gitea-api.js`
- **THEN** o desenvolvedor SHALL testar o endpoint contra uma instância Forgejo real
- **THEN** se o comportamento diferir do Gitea original, a função SHALL tratar o erro silenciosamente ou adaptar-se conforme a resposta

#### Scenario: Colaboração em forks respeita limitação do Forgejo
- **WHEN** o sistema precisa adicionar um colaborador a um fork de aluno
- **THEN** o sistema SHALL adicionar USUÁRIOS individuais (não organizações) como colaboradores, pois o Forgejo rejeita organizações como collaborator
- **THEN** a adição SHALL ser feita com o token do dono do fork (aluno)
- **THEN** falhas na adição SHALL ser silenciosas (catch) sem interromper o fluxo principal

#### Scenario: addTeamRepo em forks documentado como Forgejo-dependente
- **WHEN** `addTeamRepo` é chamado em um repositório fora da organização (fork de aluno)
- **THEN** o sistema SHALL tratar falhas silenciosamente, pois o comportamento varia entre versões do Forgejo

### Requirement: User info keys include full_name
The `AUTH_KEYS` array SHALL include `teacher_full_name` and `student_full_name` so they are broadcast to other tabs and cleaned up on logout.

#### Scenario: Full name cleared on logout
- **WHEN** the user logs out
- **THEN** `teacher_full_name` and `student_full_name` SHALL be removed from sessionStorage alongside other auth keys
