## MODIFIED Requirements

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
