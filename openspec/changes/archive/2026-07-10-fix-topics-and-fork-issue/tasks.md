## 1. Gitea API — correção 404 e nova função createRepoIssue

- [x] 1.1 Corrigir `getRepoTopics` em `gitea-api.js` — ler tópicos do objeto repo (`GET /repos/{owner}/{repo}`) em vez do endpoint `/topics` que retorna 404
- [x] 1.2 Adicionar função `createRepoIssue(owner, repo, title, body, dueDate)` em `gitea-api.js`

## 2. Dashboard do Aluno — criar issue ao aceitar tarefa

- [x] 2.1 Modificar `acceptTask` em `student/dashboard.html` para chamar `createRepoIssue` após fork bem-sucedido

## 3. Link de Matrícula — criar issue ao aceitar tarefa

- [x] 3.1 Modificar fluxo de aceitação em `task/index.html` para chamar `createRepoIssue` após fork bem-sucedido
