## Why

O sistema de tópicos (`type-task`, `deadline-*`) para identificar tarefas funciona, mas tem dois problemas: (1) repos que existem sem tópicos geram falsos 404 no console quando o sistema tenta ler tópicos deles, poluindo o log e confundindo debug; (2) quando o aluno aceita uma tarefa (fork), não fica nenhum registro da entrega no repositório do aluno — apenas o fork vazio.

## What Changes

1. **Silenciar falsos 404 em `getRepoTopics`** — repositórios que existem mas nunca receberam tópicos retornam 404 da API do Gitea. O código já trata o erro (retorna `[]`), mas o warning continua aparecendo no console. Vamos suprimir silenciosamente.

2. **Criar issue no fork ao aceitar tarefa** — após `createFork()` bem-sucedido, criar uma issue no repositório do aluno com título, descrição e `due_date` copiado do prazo da tarefa original.

## Capabilities

### New Capabilities
- `fork-issue-tracking`: Criação automática de issue de entrega no fork do aluno ao aceitar uma tarefa

### Modified Capabilities
- `gitea-bridge`: `getRepoTopics` deve suprimir silenciosamente erros 404 sem poluir o console
- `student-tasks`: fluxo de aceitar tarefa agora inclui criação de issue no fork
- `task-enrollment-link`: fluxo de aceitar tarefa pelo link também inclui criação de issue

## Impact

- `components/gitea-api.js` — `getRepoTopics` suprime erro de console; nova função `createForkIssue`
- `student/dashboard.html` — `acceptTask` cria issue após fork
- `task/index.html` — criação de issue após fork pelo link de matrícula
