## Why

Professores precisam "coletar" o estado atual de todos os forks de uma tarefa em um momento específico (ex.: data limite) para poder referenciar e avaliar o trabalho dos alunos naquele ponto. Sem isso, não há como congelar o estado das entregas — o fork continua evoluindo.

## What Changes

- Adicionar função `createRepoTag` em `gitea-api.js` para criar tags via API do Gitea
- Adicionar botão "Coletar forks" na página `/teacher/tarefas.html` por tarefa
- Ao clicar, criar uma tag `coleta-YYYY-MM-DD-HHmm` em todos os forks da tarefa
- Exibir progresso e resultado da operação

## Capabilities

### New Capabilities
- `fork-snapshot-collect`: Capacidade de criar snapshots (tags) em todos os forks de uma tarefa a partir da interface do professor

### Modified Capabilities
- `gitea-bridge`: Adicionar função `createRepoTag` à API
- `teacher-tasks`: Adicionar ação de coleta na listagem de tarefas

## Impact

- `components/gitea-api.js`: nova função `createRepoTag(owner, repo, tagName, target?)`
- `teacher/tarefas.html`: novo botão e lógica de coleta
- Nenhuma mudança em modelos de dados ou storage
