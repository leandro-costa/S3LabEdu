## MODIFIED Requirements

### Requirement: Student can view available tasks from repos
The system SHALL display tasks (repos with `type-task` topic) from the student's orgs that the student has not yet forked.

#### Scenario: Available tasks listed
- **WHEN** student views the available tasks section
- **THEN** the system SHALL call `listOrgRepos(org)` and `getRepoTopics(org, repo)` for each org
- **THEN** repos with `type-task` topic SHALL be shown with repo name, deadline, and an "Aceitar" button
- **THEN** the repo name SHALL be displayed as plain text only — no clickable link to the original repository
- **THEN** repos already forked by the student SHALL be excluded — detected by calling `checkFork(org, repo, giteaUser)` per task repo, using a compound key `${org}/${repo}` to distinguish tasks with the same name in different classes
- **THEN** the same task name in different classes SHALL be treated as separate tasks

### Requirement: Student can view accepted tasks without org membership
The system SHALL detect a student's accepted tasks even when the student is not a member of the class org, by listing the student's own repos and inspecting fork parents.

#### Scenario: Accepted tasks from personal repos
- **WHEN** student accesses "Minhas Tarefas"
- **THEN** the system SHALL call `listUserRepos()` (`GET /api/v1/user/repos`), filter for repos where `r.fork === true && r.owner.login === giteaUser`, and verify the parent repo has topic `type-task`
- **THEN** for each fork, display the parent repo name, deadline, fork link, and status
- **THEN** multiple accepted tasks with the same repo name from different classes SHALL all be displayed
