## Why

Quando um aluno dá fork em uma tarefa, o repositório forkado mantém o mesmo nome do original. Se duas turmas diferentes (orgs) têm tarefas com o mesmo nome (ex: `atividade-1`), os forks colidem no namespace do aluno — o segundo fork falha ou sobrescreve. Renomear o fork para `{org}-{repo}` elimina a colisão.

## What Changes

- **`createFork(owner, repo)`** → **`createFork(owner, repo, forkName)`**: aceitar nome customizado para o fork
- **`createForkSafe`**: repassar `forkName`
- **Todos os callers**: passar `forkName = \`${owner}-${repo}\``
- **Delivery issue e links**: usar nome real do fork (do response da API)

## Capabilities

### New Capabilities
*(none)*

### Modified Capabilities
- `gitea-bridge`: `createFork()` aceita parâmetro `forkName`

## Impact

- `components/gitea-api.js` — `createFork()` + `createForkSafe()` aceitam `forkName`
- `student/dashboard.html` — passar `forkName` + usar `fork.name` no delivery issue
- `student/minhas-tarefas.html` — passar `forkName` + link corrigido para `forkName`
- `task/index.html` — passar `forkName` + link/delivery issue com `fork.name`
