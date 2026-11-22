## MODIFIED Requirements

### Requirement: Student can view available tasks from repos
The system SHALL display tasks (repos with `type-task` topic) from the student's orgs that the student has not yet forked.

#### Scenario: Available tasks listed
- **WHEN** student views the available tasks section
- **THEN** the system SHALL call `listOrgRepos(org)` and `getRepoTopics(org, repo)` for each org
- **THEN** repos with `type-task` topic SHALL be shown with repo name, deadline, and an "Aceitar" button
- **THEN** the repo name SHALL be displayed as plain text only — no clickable link to the original repository
- **THEN** repos already forked by the student SHALL be excluded — detected by calling `checkFork(org, repo, giteaUser)` per task repo (forks live in the student's personal namespace, not inside the org)
