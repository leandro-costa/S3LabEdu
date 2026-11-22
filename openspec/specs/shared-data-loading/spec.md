# shared-data-loading

## Purpose

Centralizes data-loading helpers (organization fetching, task repo discovery, cache key constants) for reuse across student and teacher pages. Reduces duplication of Gitea API calls and caching logic.

## Requirements

### Requirement: Shared loadOwnerOrgs function
The system SHALL provide a `loadOwnerOrgs()` function in `gitea-api.js` that fetches organizations via `listOwnerOrganizations()`, caches them in `sessionStorage` under `'academic_classes'`, and falls back to cached data on error.

#### Scenario: Successful fetch caches data
- **WHEN** `loadOwnerOrgs()` resolves successfully
- **THEN** the result is cached in `sessionStorage` under key `'academic_classes'`

#### Scenario: Failed fetch falls back to cache
- **WHEN** `loadOwnerOrgs()` fails and cached data exists
- **THEN** returns the cached data

#### Scenario: Failed fetch with no cache
- **WHEN** `loadOwnerOrgs()` fails and no cached data exists
- **THEN** throws the original error

### Requirement: Shared getTaskReposForOrg function
The system SHALL provide a `getTaskReposForOrg(orgName)` function that lists organization repos (all pages), checks for `type-task` topic, and extracts the `deadline-` topic value. Org repos that are forks are NOT excluded: student forks live in the student's own account, so a fork inside the class org is a teacher-owned task repo (e.g. forked from a teacher's template).

#### Scenario: Returns task repos with deadline
- **WHEN** `getTaskReposForOrg('2024-INF-POO')` is called
- **THEN** returns an array of repos that have the `type-task` topic
- **AND** each repo object includes a `deadline` property with the value from the `deadline-` topic

#### Scenario: Includes forked org repos
- **WHEN** `getTaskReposForOrg(orgName)` encounters a repo in the org that is a fork and has the `type-task` topic
- **THEN** the forked repo is included in results like any other task repo

### Requirement: Cache key constants
The system SHALL export named constants `CACHE_KEY_CLASSES`, `CACHE_KEY_TASKS`, `CACHE_KEY_ENROLLMENTS_PREFIX` from `gitea-api.js`.

#### Scenario: Constants are accessible
- **WHEN** any page imports from `gitea-api.js`
- **THEN** `CACHE_KEY_CLASSES` equals `'academic_classes'`
- **AND** `CACHE_KEY_TASKS` equals `'academic_tasks_cache'`
- **AND** `CACHE_KEY_ENROLLMENTS_PREFIX` equals `'academic_enrollments_'`
