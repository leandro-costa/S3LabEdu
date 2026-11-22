## 1. API — enableRepoIssues

- [x] 1.1 Adicionar função `enableRepoIssues(owner, repo)` em `gitea-api.js` via `PATCH /repos/{owner}/{repo}` com `{ has_issues: true }` e exportá-la

## 2. task/index.html — habilitar issues e condicionar delivery

- [x] 2.1 Após `createForkSafe`, verificar `fork.has_issues` e chamar `enableRepoIssues` se necessário
- [x] 2.2 Envolver `createDeliveryIssue` em `if (deadlineDate)`

## 3. student/dashboard.html — habilitar issues e condicionar delivery

- [x] 3.1 Após `createForkSafe`, verificar `fork.has_issues` e chamar `enableRepoIssues` se necessário
- [x] 3.2 Envolver `createDeliveryIssue` em `if (deadline)`

## 4. Corrigir ativação de deadlines

- [x] 4.1 Remover `if (!fork.has_issues)` nos dois call sites — chamar `enableRepoIssues` sempre, com `await`
- [x] 4.2 Atualizar `enableRepoIssues` — já está com `has_issue_deadlines`
