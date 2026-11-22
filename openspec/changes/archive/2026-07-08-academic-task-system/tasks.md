## 1. Entry Point & Profile Selection

- [x] 1.1 Add academic theme variant to `tokens/design-tokens.css`
- [x] 1.2 Create `pages/academic/` directory structure (teacher/, student/)
- [x] 1.3 Create `pages/academic/academic.css` — shared layout styles
- [x] 1.4 Create `pages/academic/index.html` — profile selector with "Sou Professor" and "Sou Aluno" buttons
- [x] 1.5 Implement admin token prompt for teacher flow (stored in localStorage)
- [x] 1.6 Implement email + Gitea username prompt for student flow (stored in localStorage)

## 2. Generic UI Components

- [x] 2.1 Create `components/ui-table.js` — configurable table with columns, rows, sort
- [x] 2.2 Create `components/ui-form.js` — styled form container (not schema-driven)
- [x] 2.3 Create `components/ui-input.js` — styled text input with label and validation state
- [x] 2.4 Create `components/ui-select.js` — styled dropdown with label
- [x] 2.5 Create `components/ui-datepicker.js` — styled date input
- [x] 2.6 Create `components/ui-modal.js` — overlay dialog with header, body, footer slots
- [x] 2.7 Create `components/ui-status-badge.js` — colored badge (Entregue, Pendente, Aceita)

## 3. Gitea API Bridge

- [x] 3.1 Create `components/gitea-api.js` — shared module with: setToken, getToken, clearToken, listOrganizations, listOrgRepos, createFork, checkFork
- [x] 3.2 `checkFork` implementation uses opção A — `GET /repos/{owner}/{repo}/forks` and filters by student Gitea username
- [x] 3.3 Handle API errors with user-facing messages

## 4. Teacher Pages

- [x] 4.1 Create `pages/academic/teacher/turmas.html`, `tarefas.html`, `acompanhamento.html` — separate pages for each teacher view
- [x] 4.2 Implement Turmas section — class creation form + class list table with action links
- [x] 4.3 Implement Tarefas section — class selector dropdown + task creation form + task list with enrollment link copy button
- [x] 4.4 Implement Acompanhamento section — filterable table of all tasks (class + task dropdown) with acceptance/delivery counts
- [x] 4.5 Implement student-per-task detail view — modal or inline expand listing students with fork status (opção A)

## 5. Public Task Enrollment Page

- [x] 5.1 Create `pages/academic/task/index.html` — loads task data from URL hash, displays task details
- [x] 5.2 Implement enrollment form — email + Gitea username fields
- [x] 5.3 Implement "Inscrever e Aceitar" flow — validate task hash, create enrollment + fork + acceptance record
- [x] 5.4 Handle edge cases: invalid link, already enrolled, fork already exists, API error

## 6. Student Dashboard

- [x] 6.1 Create `pages/academic/student/dashboard.html`, `minhas-tarefas.html` — separate pages for each student view
- [x] 6.2 Implement enrolled classes view — cards/table showing classes with active task count
- [x] 6.3 Implement available tasks view — table of tasks per class with "Aceitar" button
- [x] 6.4 Implement accept task from dashboard — fork API call + save acceptance
- [x] 6.5 Implement "Minhas Tarefas" view — table of accepted tasks with fork status (Aceita / Entregue) checked via opção A

## 7. Verify

- [ ] 7.1 Full teacher flow: create class → create task → copy enrollment link → see task in tracking dashboard
- [ ] 7.2 Full student enrollment flow: access public task link → enter data → see success → dashboard shows enrollment and task
- [ ] 7.3 Fork delivery tracking: teacher sees "Entregue" when fork exists, "Pendente" when not
- [ ] 7.4 Student dashboard: minhas tarefas shows correct Aceita/Entregue status
- [ ] 7.5 Edge cases: invalid link, duplicate fork, API errors
- [ ] 7.6 Responsive layout on mobile