## Context

Atualmente `createOrganization()` cria orgs públicas (`visibility: 'public'`) e `createOrgRepo()` cria repositórios públicos (`private: false`). Alunos acessam tarefas via fork — precisam de visibilidade do repo original. A equipe "alunos" já existe por organização, mas não está vinculada aos repositórios de tarefa.

## Goals / Non-Goals

**Goals:**
- Organizações (turmas) criadas como privadas — só membros veem
- Repositórios de tarefa criados como privados
- Time "alunos" adicionado como colaborador (leitura) automaticamente na criação da tarefa
- Fork continua funcionando (alunos no time "alunos" têm permissão de leitura para fork)

**Non-Goals:**
- Não alterar permissões de orgs ou repositórios já existentes
- Não alterar o fluxo de fork do aluno
- Não adicionar interface para gerenciar permissões manualmente

## Decisions

- **Org privada via `visibility: 'private'`**: A Gitea API aceita `public`, `limited` e `private` para orgs. `private` garante que apenas membores veem a org. Alunos são automaticamente membros ao serem adicionados ao time "alunos" via `addTeamMember()`.
- **Usar endpoint `PUT /teams/{id}/repos/{owner}/{repo}`**: É o endpoint nativo do Gitea para adicionar um time como colaborador de um repositório específico. O time já tem permissão `read`, então o acesso será somente leitura.
- **Adicionar após `createOrgRepo()` no fluxo de criação**: A nova função `addTeamRepo()` será chamada logo após criar o repo, antes de setar as topics. Se falhar, a criação da tarefa falha — repo privado sem o time não é acessível.
- **Reusar `ensureAlunosTeam()`**: O time "alunos" já é garantido em outras páginas. No fluxo de criar tarefa, chamamos `ensureAlunosTeam(org)` antes de `addTeamRepo()`.

## Risks / Trade-offs

- [**Orgs e repos existentes continuam públicos**] → Migração manual se necessário, fora do escopo
- [**Falha em `addTeamRepo()` bloqueia criação**] → Comportamento desejado: repo privado sem time "alunos" é inacessível
- [**Time "alunos" pode não existir**] → Chamar `ensureAlunosTeam()` antes de `addTeamRepo()` garante que o time existe
