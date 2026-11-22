# Fork Snapshot Collect

## Purpose
Teacher interface for creating snapshot tags on all student forks of a task repository.

## Requirements

### Requirement: Teacher can collect forks via snapshot tag
The system SHALL allow a teacher to create a Git tag on all forks of a task repository to record the current state of each fork.

#### Scenario: Teacher collects forks from task list
- **WHEN** the teacher clicks the "Coletar" button for a task in `/teacher/tarefas.html`
- **THEN** the system SHALL list all forks of the task repo via `listForks(org, repo)`
- **THEN** for each fork, the system SHALL create a tag `coleta-YYYY-MM-DD-HHmm` on the fork's HEAD commit
- **THEN** the button SHALL show a loading state during the operation
- **THEN** after completion, the system SHALL display how many forks were tagged and how many failed

#### Scenario: Fork without commits is skipped
- **WHEN** a fork has no commits (empty repo)
- **THEN** the system SHALL skip that fork silently and continue with the remaining forks

#### Scenario: Tag already exists
- **WHEN** a tag with the same name already exists on a fork (unlikely due to timestamp)
- **THEN** the system SHALL overwrite the existing tag

### Requirement: Snapshot tag format
Tags SHALL follow the format `coleta-YYYY-MM-DD-HHmm` using the server's current time at the moment of collection.

#### Scenario: Tag name generated with current timestamp
- **WHEN** the collection is triggered
- **THEN** the tag name SHALL be `coleta-{current date}-{current hour and minute}` in the local timezone of the browser

### Requirement: Teacher can copy a batch clone script
After a successful collection, the system SHALL generate a PowerShell script that clones each fork at the collection tag into a hierarchical folder structure `org/repo/coleta-YYYY-MM-DD-HHmm/<gitea_username>`, overwriting existing student folders.

#### Scenario: Copy script button appears after collection
- **WHEN** the collection operation completes with at least one successful tag
- **THEN** a "Copiar script de coleta" button SHALL appear
- **THEN** clicking it SHALL copy a PowerShell script to the clipboard

#### Scenario: Script clones each fork at the snapshot tag
- **WHEN** the teacher pastes and runs the script in PowerShell
- **THEN** the script SHALL ensure the hierarchy `<org>/<repo>/<tag>` exists via `mkdir -Force "<org>/<repo>/<tag>"` (creating `org` and `org/repo` if needed)
- **THEN** the script SHALL `Set-Location "<org>/<repo>/<tag>"`
- **THEN** for each fork, the script SHALL check if a subfolder named after the student's Gitea username exists and if so remove it via `Remove-Item -Recurse -Force`
- **THEN** for each fork, the script SHALL run `git clone --branch <tag> <clone_url> <gitea_username>`
- **THEN** each fork SHALL be cloned into `org/repo/coleta-YYYY-MM-DD-HHmm/<gitea_username>`
- **THEN** the script SHALL restore the initial location via `Set-Location $initialLocation` so a subsequent script runs from the original directory

#### Scenario: Existing student folder is overwritten
- **WHEN** the script is run a second time for the same org/repo/tag and a student subfolder already exists
- **THEN** the existing folder SHALL be removed before cloning, ensuring a fresh clone at the tag

### Requirement: Teacher can re-collect with same tag for retry
The system SHALL detect when a collection already exists for today and offer to retry only the forks that are missing the tag.

#### Scenario: Second click prompts retry
- **WHEN** the teacher clicks "Coletar" on a task that already has a stored `lastTagName` matching today's date
- **THEN** the system SHALL prompt: "Já existe coleta para hoje. Tentar novamente?"
- **THEN** if the teacher confirms, the system SHALL re-run the collection with the same tag name
- **THEN** forks that already have the tag SHALL be treated as already collected (error caught, counted as success)
- **THEN** forks without the tag SHALL receive the tag normally

### Requirement: Teacher sees collection status per task in acompanhamento
The acompanhamento page SHALL show a "Coleta" column per task indicating how many forks have the collection tag, with a visual warning if not all forks are tagged.

#### Scenario: Collection count shown per task
- **WHEN** the teacher views `/teacher/acompanhamento.html`
- **THEN** for each task, the system SHALL iterate over all forks and call `listRepoTags(owner, forkName)` per fork
- **THEN** forks with at least one tag starting with `coleta-` SHALL be counted as "collected"
- **THEN** the column SHALL display `X/Y` where X is the count of forks with the tag and Y is the total number of forks
- **THEN** if X === Y, display a ✅ checkmark; if X < Y, display a ⚠️ warning

#### Scenario: No collection tag on any fork
- **WHEN** no fork has a tag starting with `coleta-`
- **THEN** the column SHALL display "—"

### Requirement: Teacher sees collection status per student in detalhes-tarefa
The detalhes-tarefa page SHALL show a "Coleta" column per student indicating whether their fork has the collection tag.

#### Scenario: Student collection status shown
- **WHEN** the teacher views `/teacher/detalhes-tarefa.html`
- **THEN** for each fork, the system SHALL call `listRepoTags(owner, forkName)` alongside the existing commit and issue fetches
- **THEN** if a tag starting with `coleta-` exists, the column SHALL display ✅
- **THEN** if no such tag exists, the column SHALL display ✗

### Requirement: Student can see collection status
The system SHALL display to the student, on `minhas-tarefas.html`, whether a collection tag exists on their fork and the date of the most recent collection.

#### Scenario: Student sees collection date
- **WHEN** the student loads `minhas-tarefas.html`
- **THEN** for each accepted task, the system SHALL call `listRepoTags(studentUser, forkName)`
- **THEN** if any tag starting with `coleta-` exists, the system SHALL display the date of the most recent tag in a "Coleta" column
- **THEN** if no collection tag exists, the system SHALL display "-" in that column
