# Student Tasks

## ADDED Requirements

### Requirement: Student can see collection status per task
The student's task list in `minhas-tarefas.html` SHALL display whether a collection tag exists on the fork and the date of the most recent collection.

#### Scenario: Collection badge shown
- **WHEN** the student views accepted tasks
- **THEN** for each fork, the system SHALL call `listRepoTags(studentUser, forkName)`
- **THEN** if any tag starting with `coleta-` exists
- **THEN** the system SHALL show the most recent collection date in a "Coleta" column

#### Scenario: No collection indicator
- **WHEN** no tag starting with `coleta-` exists on the fork
- **THEN** the system SHALL display "-" in the "Coleta" column
