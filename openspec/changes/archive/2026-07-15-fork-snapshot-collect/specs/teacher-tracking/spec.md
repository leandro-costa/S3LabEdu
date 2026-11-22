# Teacher Tracking

## ADDED Requirements

### Requirement: Tracking dashboard shows collection status
The tracking dashboard SHALL display a "Coleta" column per task showing how many forks have the snapshot tag.

#### Scenario: Collection column displayed per task
- **WHEN** teacher views the tracking dashboard
- **THEN** each task row SHALL include a "Coleta" column
- **THEN** the system SHALL iterate over all forks and call `listRepoTags(fork.owner.login, fork.name)` for each fork
- **THEN** forks with at least one tag starting with `coleta-` SHALL be counted as collected
- **THEN** the column SHALL display `X/Y` where X is collected forks and Y is total forks
- **THEN** if X equals Y, the count SHALL be followed by ✅
- **THEN** if X is less than Y, the count SHALL be followed by ⚠️
- **THEN** if no fork has a `coleta-` tag, the column SHALL display "—"
