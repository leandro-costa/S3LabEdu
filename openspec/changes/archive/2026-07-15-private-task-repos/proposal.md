## Why

Repositórios de tarefa e organizações (turmas) são criados como públicos, expondo código e estrutura de turmas para qualquer um na instância Gitea. Alunos devem acessar apenas as turmas em que estão matriculados. Tornar organizações e repositórios privados, adicionando o time "alunos" como colaborador (leitura), garante isolamento entre turmas e segurança por matrícula.

## What Changes

- **`createOrganization()`**: criar organizações como `visibility: 'private'` em vez de `'public'`
- **`createOrgRepo()`**: criar repositórios como `private: true` em vez de `private: false`
- **Nova função `addTeamRepo(teamId, org, repo)`**: adiciona um time como colaborador de um repositório via `PUT /teams/{teamId}/repos/{org}/{repo}`
- **Fluxo de criação de tarefa**: após criar o repo, adicionar o time "alunos" da organização como colaborador

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `gitea-bridge`: `createOrganization()` passa a criar orgs privadas; `createOrgRepo()` passa a criar repositórios privados; adicionar requirement para nova função `addTeamRepo()`
- `teacher-tasks`: fluxo de criação de tarefa passa a incluir adicionar time "alunos" como colaborador do repo
- `teacher-classes`: fluxo de criação de turma passa a criar orgs privadas

## Impact

- `components/gitea-api.js` — `createOrganization()` muda `visibility: 'public'` → `'private'`; `createOrgRepo()` muda `private: false` → `private: true`; adicionar `addTeamRepo()`
- `teacher/tarefas.html` — após `createOrgRepo()`, chamar `addTeamRepo()` com o time "alunos"
- `openspec/specs/gitea-bridge/spec.md` — atualizar requirement de `createOrganization()`
