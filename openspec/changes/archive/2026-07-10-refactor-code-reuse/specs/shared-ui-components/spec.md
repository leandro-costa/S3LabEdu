## ADDED Requirements

### Requirement: Page header custom element
The system SHALL provide a `<page-header>` custom element that renders the page title, user email, Gitea username, and a logout button. It SHALL accept a `role` attribute (`"student"` or `"teacher"`) and a `title` attribute.

#### Scenario: Renders student header
- **WHEN** `<page-header role="student" title="Painel do Aluno"></page-header>` is in the HTML
- **THEN** renders a `div.page-header` with the title "Painel do Aluno"
- **AND** displays the student email and Gitea user from `sessionStorage`
- **AND** includes a logout button with id `logout-btn`

#### Scenario: Renders teacher header
- **WHEN** `<page-header role="teacher" title="Painel do Professor"></page-header>` is in the HTML
- **THEN** renders using `teacher_email` and `teacher_gitea_user` from `sessionStorage`

### Requirement: Tab navigation custom element
The system SHALL provide a `<tab-nav>` custom element that renders navigation tabs. It SHALL accept a `role` attribute (`"student"` or `"teacher"`) and an `active` attribute for the current page.

#### Scenario: Renders student tabs
- **WHEN** `<tab-nav role="student" active="dashboard"></tab-nav>` is in the HTML
- **THEN** renders two tabs: "Dashboard" linking to `dashboard.html` (class `active`) and "Minhas Tarefas" linking to `minhas-tarefas.html`

#### Scenario: Renders teacher tabs
- **WHEN** `<tab-nav role="teacher" active="turmas"></tab-nav>` is in the HTML
- **THEN** renders three tabs: "Turmas" (`turmas.html`), "Tarefas" (`tarefas.html`), and "Acompanhamento" (`acompanhamento.html`)
- **AND** marks the matching tab with class `active`
