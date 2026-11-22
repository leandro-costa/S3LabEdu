## MODIFIED Requirements

### Requirement: Teacher can fix access to private forks
The tracking dashboard SHALL provide a "Fixar Acesso" button per task row that grants the org owners write access to all private forks of that task repo, enabling data visibility for commits, tags and issues.

#### Scenario: Fix access button visible based on forks_count
- **WHEN** the tracking dashboard renders a task row
- **THEN** the system SHALL call `GET /repos/{org}/{repo}` to get the repository object with `forks_count`
- **THEN** the system SHALL call `listForks(org, repo)` to get accessible forks
- **THEN** the "Fixar Acesso" button SHALL be visible only if `forks_count > accessibleForks.length`
- **THEN** if the counts match, the button SHALL be hidden (all forks already accessible)

#### Scenario: Fix access discovers forks via org members
- **WHEN** the teacher clicks "Fixar Acesso" on a task row
- **THEN** the system SHALL list all org members via `GET /orgs/{org}/members`
- **THEN** for each member, the system SHALL check `GET /repos/{member}/{forkName}` where `forkName` is `{org}-{repo}`
- **THEN** members whose repo check succeeds SHALL be considered as having a fork

#### Scenario: Fix access grants org owners write access to forks
- **WHEN** forks are discovered
- **THEN** the system SHALL discover org owners via `listOrgOwners(org)`
- **THEN** for each fork (member/repo), the system SHALL call `addRepoCollaborator(member, forkName, owner.login, 'write')` for each org owner
- **THEN** the task data (commits, tags, collected) SHALL be re-read and displayed

#### Scenario: Fork discovery with correct name pattern
- **WHEN** building the fork name to check
- **THEN** the system SHALL use `forkName = \`${org}-${repo}\`` (e.g., `2026-inf-poo-2b-atividade-polimorfismo-banquete`)
- **THEN** the system SHALL skip org members whose login matches any org owner (e.g., `leandro`) since they are teachers, not students

#### Scenario: addRepoCollaborator failure is visible
- **WHEN** `addRepoCollaborator` fails for a given fork/owner pair
- **THEN** the system SHALL display a per-fork error message in the console
- **THEN** the system SHALL continue processing remaining forks
- **THEN** the button SHALL NOT show "✓ Fixado" unless all forks succeeded

### Requirement: Teacher tracking uses forkName for data fetches
The tracking dashboard SHALL use the compound fork name (`{org}-{repo}`) instead of the original repo name when fetching per-fork data (commits, tags, issues).

#### Scenario: Fork data fetches use correct fork name
- **WHEN** the tracking dashboard iterates over forks for data collection
- **THEN** the system SHALL use `listRepoTags(member, forkName)`, `countCommitsSince(member, forkName, date)`, etc.
- **THEN** `forkName` SHALL be `{org}-{repo}`
