## Why

Ao criar uma tarefa usando um **repositório existente** (que já estava na organização), o time "alunos" não recebe acesso de leitura ao repositório. Isso faz com que a tarefa fique invisível para os alunos, mesmo após atualizarem a página. O `addTeamRepo` só é chamado no caminho de criação de novo repositório, deixando uma lacuna no fluxo de repositório existente.

## What Changes

- `addTeamRepo(team.id, org, repo)` passará a ser chamado **também** quando a tarefa usa um repositório existente (não apenas quando cria um novo)
- O `ensureAlunosTeam(org)` será chamado no caminho de repositório existente para garantir que o time "alunos" exista
- O fluxo de criação de tarefa com repositório existente passará a ser: `ensureAlunosTeam` → `addTeamRepo` → `setRepoTopic`

## Capabilities

### New Capabilities
- *(nenhuma — é uma correção em funcionalidade existente)*

### Modified Capabilities
- `teacher-tasks`: a criação de tarefa com repositório existente deve também conceder acesso ao time "alunos", não apenas adicionar tópicos

## Impact

- `teacher/tarefas.html` — função `createTask()`: adicionar `ensureAlunosTeam` e `addTeamRepo` no bloco de repositório existente
- Nenhuma mudança de API, dependência ou banco de dados
