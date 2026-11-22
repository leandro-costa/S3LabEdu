## Context

O sistema usa tópicos do Gitea (`type-task`, `deadline-YYYY-MM-DD`) para marcar repositórios como tarefas. A função `getRepoTopics` lê os tópicos usando o endpoint `/repos/{owner}/{repo}/topics`, que retorna 404 para repositórios que existem e têm tópicos visíveis na UI. O catch trata retornando `[]`, mas o 404 polui o console.

Ao aceitar uma tarefa, o sistema faz `createFork()` sem criar nenhum registro de entrega no fork do aluno.

## Goals / Non-Goals

**Goals:**
- Eliminar falsos 404 lendo tópicos via endpoint quebrado
- Criar issue de entrega no fork do aluno com `due_date` e label "entrega"

**Non-Goals:**
- Não muda o mecanismo de descoberta de tarefas (tópicos continuam sendo o marcador)
- Não altera o fluxo de PR (aluno ainda cria PR manualmente)

## Decisions

### 1. Substituir endpoint `/topics` por leitura do objeto repo

O endpoint `GET /repos/{owner}/{repo}/topics` retorna 404 mesmo para repos que têm tópicos (bug/versão do Gitea). O endpoint `GET /repos/{owner}/{repo}` (objeto do repo) SEMPRE retorna 200 e já inclui o campo `topics: [...]`.

**Decisão:** `getRepoTopics` passa a chamar `_fetch('/repos/{owner}/{repo}')` e retornar `result.topics || []` em vez do endpoint dedicado de tópicos.

`setRepoTopic` continua usando `PUT /repos/{owner}/{repo}/topics` para escrever (não apresenta o mesmo problema), mas internamente chama o `getRepoTopics` atualizado para ler os existentes.

### 2. Issue no fork

Após `createFork(owner, repo)` bem-sucedido, chamar nova função `createRepoIssue(owner, repo, title, body, dueDate)` que faz:

```
POST /repos/{student}/{repo}/issues
{
  "title": "Entrega: {taskName}",
  "body": "Issue de entrega automática.\n\nPrazo: {deadline}",
  "due_date": "{deadline}T23:59:59-03:00",
  "labels": ["entrega"]
}
```

**Dados necessários:** `taskName` e `deadline` já estão disponíveis nos callers — são lidos dos tópicos do repo original antes do fork.

**Onde implementar:** Nova função `createRepoIssue` em `gitea-api.js`, chamada após fork em `student/dashboard.html` e `task/index.html`.

## Risks / Trade-offs

- [Label não existe] → `POST` com label inexistente pode falhar. Mitigação: capturar erro e ignorar (issue sem label ainda serve como registro)
- [2 chamadas seguidas] → fork + issue = mais latência. Mitigação: aceitável, UX já mostra loading
