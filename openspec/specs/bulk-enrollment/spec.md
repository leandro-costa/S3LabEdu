# Bulk Enrollment

## Purpose
Teacher-side bulk enrollment capability for adding multiple students to a class by email, with per-email status tracking and Gitea user resolution.

## Requirements

### Requirement: Teacher can bulk-add students via textarea
The teacher page SHALL provide a textarea where the teacher can paste multiple student emails, one per line, and submit them for batch enrollment.

#### Scenario: Multiple emails pasted and submitted
- **WHEN** teacher pastes 3+ valid emails (one per line) into the textarea and clicks "Adicionar em Lote"
- **THEN** each email SHALL be processed sequentially: resolved to Gitea username, and added to the "alunos" Gitea team
- **THEN** enrollment records are NOT written to localStorage (Gitea is source of truth)

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

### Requirement: Enrollment uses Gitea team directly
Bulk enrollment SHALL add students directly to the "alunos" Gitea team. No localStorage records are written.

#### Scenario: Team membership is enrollment
- **WHEN** a student's email is resolved and added to the "alunos" team
- **THEN** the student IS enrolled in the class (org)
- **THEN** the enrollment list is refreshed from Gitea team members
