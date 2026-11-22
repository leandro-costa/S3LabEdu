## Context

O botão "Fixar Acesso" em `teacher/acompanhamento.html` usa `listForks()` + `addTeamRepo()` – fluxo que funciona no Gitea original mas não no Forgejo:

1. `GET /repos/{org}/{repo}/forks` → retorna 0 forks no Forgejo (só expõe forks que o token do professor já tem acesso)
2. `PUT /teams/{id}/repos/{aluno}/{fork}` → falha no Forgejo para repos fora da org

Investigação mostrou que:
- `GET /orgs/{org}/members` lista 34 membros (inclusive o professor `leandro`)
- `GET /repos/{membro}/{org}-{repo}` retorna 200 para 28 alunos que têm fork (forkName = `{org}-{repo}`)
- A página web UI mostra 28 forks, confirmando a lista

## Goals / Non-Goals

**Goals:**
- Fazer o "Fixar Acesso" descobrir forks reais e adicionar owners como colaboradores nos forks dos alunos
- Propagar erros visíveis em vez de `.catch(() => {})` silencioso
- Mostrar o botão "Fixar Acesso" apenas quando `forks_count` (total real) for diferente de `listForks` (acessíveis)

**Non-Goals:**
- Não alterar o fluxo de render da tabela para itens individuais (continua usando `listForks` – depois do Fixar Acesso o professor passa a ser collaborator e o `listForks` funciona)
- Não alterar `gitea-api.js` (funções `listOrgOwners` e `addRepoCollaborator` já existem)

## Decisions

### 1. Descoberta de forks via membros da org em vez de listForks

| Alternativa | Prós | Contras |
|---|---|---|
| **A: listForks + addTeamRepo** (atual) | Funciona no Gitea | Não descobre forks no Forgejo; addTeamRepo falha |
| **B: org members + GET /repos/{member}/{forkName}** | Funcionou no teste (28/28) | Requer N+1 chamadas (1 p/ membro) |
| **C: repos/search?q=forkName&fork=true** | 401 por token inválido no teste | Token de aluno não funciona |

**Decisão: B** – já validado com 28 forks encontrados.

### 2. Concessão via addRepoCollaborator em vez de addTeamRepo

| Alternativa | Prós | Contras |
|---|---|---|
| **A: addTeamRepo (atual)** | 1 chamada por fork | Falha no Forgejo |
| **B: addRepoCollaborator** | Funciona para collab em repo alheio (se teacher tiver permissão) | Requer N chamadas (1 p/ owner por fork) |

**Decisão: B** – a ser testado se o Forgejo permite org owner adicionar-se como collaborator em fork de membro.

### 3. Nome do fork

O fork é criado com nome `{org}-{repo}` (ex: `2026-inf-poo-2b-atividade-polimorfismo-banquete`), definido em change `fork-name-org-repo`. A descoberta e o `addRepoCollaborator` usam `forkName = \`${org}-${repo}\``.

### 4. Owners resolvidos via listOrgOwners

Em vez de `listOrgTeams(org)` + buscar time "Owners", usar `listOrgOwners(org)` que já existe e retorna owners checando `GET /users/{login}/orgs/{org}/permissions`.

### 5. Visibilidade condicional do botão via forks_count

O repositório no Forgejo tem o campo `forks_count` (total real de forks). A `getRepoTopics` já busca `GET /repos/{org}/{repo}` que retorna esse campo. Basta adicionar uma função `getRepo(owner, repo)` ou reusar a requisição existente para comparar `forks_count` com `listForks.length` e decidir se mostra o botão.

| Alternativa | Prós | Contras |
|---|---|---|
| **A: forks_count do repo + listForks** | Sem calls extras (getRepo já é usado) | listForks retorna 0 antes de fixar |
| **B: forks_count + members scan** | Preciso sem depender de listForks | Muitas chamadas só pra decidir visibilidade |

**Decisão: A** – `forks_count` vem do `GET /repos/{org}/{repo}` (já usado em `getRepoTopics`). Se `forks_count > listForks.length`, mostra o botão. Se forem iguais (já fixado), esconde.

## Risks / Trade-offs

- [**addRepoCollaborator pode falhar**] → Se o Forgejo não permitir que org owner adicione collaborator em fork de membro, precisamos de fallback UX orientando o aluno a reaceitar. Mitigação: sem `.catch()` silencioso – mostrar erro real.
- [**N+1 chamadas na descoberta**] → 34 alunos = 34 GETs. Impacto aceitável pois é ação manual do professor.
- [**Membros sem fork geram 404**] → Esperado, ignorado silenciosamente.
- [**Professor incluso na lista de membros**] → Skip quando `member.login` está entre os owners (e.g., `leandro`).

## Open Questions

- O `addRepoCollaborator` com token do professor funciona no Forgejo para forks de alunos? → Pendente de teste.
- Após adicionar, o `listForks` no re-render vai retornar os forks? → Sim, se o professor se tornou collaborator.
- O `forks_count` já está disponível na resposta de `GET /repos/{org}/{repo}`? → Sim, campo padrão da API Gitea/Forgejo.
