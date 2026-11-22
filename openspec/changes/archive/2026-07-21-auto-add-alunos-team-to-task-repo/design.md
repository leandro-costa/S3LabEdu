## Context

Atualmente, `createTask()` em `teacher/tarefas.html` só chama `ensureAlunosTeam` e `addTeamRepo` quando um **novo repositório** é criado (linhas 147-149). Quando o professor seleciona um **repositório existente** (linhas 142-144), essas chamadas são puladas — o time "alunos" não ganha acesso de leitura, e a tarefa fica invisível para os alunos.

## Goals / Non-Goals

**Goals:**
- Garantir que o time "alunos" receba acesso de leitura ao repositório **em ambos os caminhos** de criação de tarefa (novo repo e repo existente)
- Preservar o comportamento atual para novos repositórios

**Non-Goals:**
- Não alterar o comportamento do `setRepoTopic` (tópicos já são aplicados em ambos os caminhos)
- Não adicionar novos recursos (como notificação aos alunos)

## Decisions

| Decisão | Alternativa | Razão |
|---------|-------------|-------|
| Extrair `ensureAlunosTeam` + `addTeamRepo` para ANTES do fork novo/existente | Duplicar as chamadas em ambos os branches | Código mais seco e à prova de futuros esquecimentos |

**Fluxo proposto:**
```
createTask():
  1. ensureAlunosTeam(org)           ← sempre, antes do branch
  2. if (new repo):
       createOrgRepo(org, repo)
     else:
       repo = task-repo value
  3. addTeamRepo(team.id, org, repo) ← sempre, depois do branch
  4. setRepoTopic(org, repo, 'type-task')
  5. if deadline: setRepoTopic(...)
```

## Risks / Trade-offs

- [Time "alunos" não existe] → `ensureAlunosTeam` cria automaticamente (já trata esse caso)
- [addTeamRepo em repo que já tem o time] → Gitea retorna erro "already exists", tratado no catch
- [Regression em novo repo] → Mesmo fluxo de antes, apenas reordenado. Sem risco
