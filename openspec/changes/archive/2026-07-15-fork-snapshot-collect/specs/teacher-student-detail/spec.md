# Teacher Student Detail

## ADDED Requirements

### Requirement: Student detail shows collection status per fork
The student detail page SHALL display a "Coleta" column per fork indicating whether the fork has a collection tag.

#### Scenario: Collection badge shown per student
- **WHEN** the teacher views the student detail page
- **THEN** for each fork, the system SHALL call `listRepoTags(username, forkName)` alongside existing commit and issue fetches
- **THEN** if a tag starting with `coleta-` exists, the column SHALL display ✅
- **THEN** if no such tag exists, the column SHALL display ✗
