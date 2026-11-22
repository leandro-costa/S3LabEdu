# Teacher Tasks

## ADDED Requirements

### Requirement: Teacher can collect fork snapshots from task list
The task list in `/teacher/tarefas.html` SHALL show a "Coletar" button for each task that, when clicked, creates snapshot tags on all student forks.

#### Scenario: Collect button visible per task
- **WHEN** the teacher views the task list
- **THEN** each task row SHALL include a "Coletar" button in the Ações column

#### Scenario: Collect operation shows progress
- **WHEN** the teacher clicks "Coletar"
- **THEN** the button SHALL be disabled and show a loading indicator
- **THEN** the system SHALL call `listForks`, then `createRepoTag` on each fork
- **THEN** after all forks are processed, the button SHALL re-enable
- **THEN** a brief message SHALL appear with the count of successful tags and failures
- **THEN** a "Copiar script de coleta" button SHALL appear

#### Scenario: Script generation uses fork data
- **WHEN** the collection completes with at least one success
- **THEN** the system SHALL store the tag name and list of { username, clone_url } for successful tags
- **THEN** clicking "Copiar script de coleta" SHALL generate a `.bat` script and copy it to clipboard

#### Scenario: Collect button disabled during operation
- **WHEN** a collect operation is in progress for a task
- **THEN** the button SHALL remain disabled until the operation completes

#### Scenario: Re-collect prompts confirmation
- **WHEN** the teacher clicks "Coletar" and a `lastTagName` with today's date is already stored for that task
- **THEN** the system SHALL show a confirm prompt before proceeding
- **THEN** if confirmed, the same tag name SHALL be reused
