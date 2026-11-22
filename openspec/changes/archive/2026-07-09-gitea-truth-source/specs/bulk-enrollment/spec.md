## MODIFIED Requirements

### Requirement: Teacher can bulk-add students via textarea
(Unchanged.)

#### Scenario: Multiple emails pasted and submitted
- **WHEN** teacher pastes emails (one per line) into the textarea and clicks "Adicionar em Lote"
- **THEN** each email SHALL be processed: resolved to Gitea username and added to the "alunos" Gitea team

### Requirement: Enrollment is complete when student added to team
(Behavior changed — no localStorage record needed beyond cache.)

#### Scenario: Enrollment complete after team add
- **WHEN** a student is added to the "alunos" team
- **THEN** the enrollment SHALL be considered complete
