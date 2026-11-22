## ADDED Requirements

### Requirement: Commit count determines delivery status
The system SHALL use commit count > 0 to determine "Entregue" status, replacing all PR-based checks.

#### Scenario: Student page shows entregue based on commits
- **WHEN** the student's minhas-tarefas page renders a fork with `countCommitsSince > 0`
- **THEN** the status SHALL show "entregue"
- **WHEN** the fork has 0 commits
- **THEN** the status SHALL show "aceita"
- **THEN** no "Criar Pull Request" button SHALL be shown

#### Scenario: Teacher detail page shows entregue based on commits
- **WHEN** the teacher's detalhes-tarefa page loads
- **THEN** the student status SHALL be updated to "entregue" when commit count is fetched and > 0

#### Scenario: Acompanhamento counts delivery via commits
- **WHEN** the acompanhamento page counts delivered tasks
- **THEN** delivery SHALL be based on `countCommitsSince > 0` instead of PR existence
