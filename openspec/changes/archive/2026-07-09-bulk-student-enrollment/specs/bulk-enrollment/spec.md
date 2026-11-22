## ADDED Requirements

### Requirement: Teacher can bulk-add students via textarea
The teacher page SHALL provide a textarea where the teacher can paste multiple student emails, one per line, and submit them for batch enrollment.

#### Scenario: Multiple emails pasted and submitted
- **WHEN** teacher pastes 3+ valid emails (one per line) into the textarea and clicks "Adicionar em Lote"
- **THEN** each email SHALL be processed sequentially: resolved to Gitea username, added to the class in localStorage, and added to the "alunos" Gitea team

#### Scenario: Single email in textarea
- **WHEN** teacher pastes a single email into the textarea
- **THEN** it SHALL be processed the same way as multiple emails

### Requirement: Bulk enrollment shows per-email status
The UI SHALL display real-time status for each email as it is processed.

#### Scenario: Email resolved and added
- **WHEN** an email is successfully resolved to a Gitea username and added to the team
- **THEN** the email SHALL show a success indicator (checkmark, "Adicionado")

#### Scenario: Email not found in Gitea
- **WHEN** an email does not match any Gitea user
- **THEN** the email SHALL show a warning indicator with "Não encontrado no Gitea"

#### Scenario: Error adding to team
- **WHEN** the Gitea API returns an error when adding the student to the team
- **THEN** the email SHALL show an error indicator with the error message

### Requirement: Enrollment records include resolved Gitea username
When a student's email is resolved to a Gitea username, the enrollment record in localStorage SHALL store the username.

#### Scenario: Enrollment saved with Gitea username
- **WHEN** email is resolved to `giteaUser` and the student is added to the class
- **THEN** the enrollment record SHALL include `{ email, giteaUser, classIds, enrolledAt }` with `giteaUser` populated

#### Scenario: Email not resolved
- **WHEN** email lookup fails
- **THEN** the enrollment record SHALL still be saved with `giteaUser: ""` and the teacher can retry later
