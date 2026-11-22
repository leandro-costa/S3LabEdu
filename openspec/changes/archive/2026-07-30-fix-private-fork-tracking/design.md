## Context

Tarefas são repos privados na org. Alunos forkam para o namespace pessoal — o fork também é privado. O time "alunos" tem `read` no repo original, mas NÃO no fork. O token do professor, ao tentar ler commits/tags/issues do fork do aluno, recebe 404 porque a org não é colaboradora do fork.

O professor (owner da org) precisa de acesso `read` aos forks dos alunos para que a tela de Acompanhamento e a tela de Detalhes da Tarefa funcionem.

## Goals / Non-Goals

**Goals:**
- Professor (owner da org) consegue ler commits, tags e issues dos forks privados
- Novos forks já nascem com o acesso correto
- Forks existentes podem ser corrigidos via botão na tela de Acompanhamento
- Alunos no time "alunos" NÃO ganham acesso aos forks uns dos outros

**Non-Goals:**
- Não mexer na visibilidade dos forks (continuam privados)
- Não criar time "professores" ou novas estruturas organizacionais
- Não alterar o fluxo de fork do aluno (só adicionar 1 passo)

## Decisions

### 1. `addRepoCollaborator` em vez de `addTeamRepo`

A API `PUT /repos/{owner}/{repo}/collaborators/{collaborator}` adiciona um usuário como colaborador direto. São adicionados USUÁRIOS individuais (owners), não a org como um todo.

Isolamento por owners:
```
  Fork do Aluno A (colab: owners individuais)
       ├── Professor X (owner) → ✅
       ├── Professor Y (owner) → ✅
       ├── Aluno B (membro "alunos") → ❌
       └── Aluno C (membro "alunos") → ❌
```

### 2. Descoberta de owners via permissions endpoint (NOVO)

O token do aluno não consegue listar membros do time Owners (`listTeamMembers` retorna 403). Foi descoberto que o endpoint `GET /users/{username}/orgs/{org}/permissions` funciona com o token do aluno e retorna `is_owner: true/false`.

```
  listOrgOwners(orgName):
    1. GET /orgs/{org}/members?limit=50  (pagina se necessário)
    2. Promise.all(
         members.map(m =>
           GET /users/{m.login}/orgs/{org}/permissions
         )
       )
    3. filter(is_owner === true)
    4. cache em sessionStorage('org_owners_{org}')
```

Isso substitui a abordagem anterior de listar membros do time Owners (que falhava silenciosamente).

### 3. Colaboração feita pelo ALUNO no pós-fork

O fork é criado com o token do aluno. Portanto o aluno (dono do fork) precisa fazer a chamada. Isso é feito imediatamente após `createForkSafe()`.

### 4. Botão "Fixar Acesso" usa `addTeamRepo` com time Owners (INALTERADO)

Para forks existentes, o professor não pode adicionar a org como colaboradora (não é dono do fork). Porém, no Gitea, um owner da org pode adicionar QUALQUER time da org a QUALQUER repo — mesmo forks de alunos, desde que o fork seja de um repo original da org.

O time "Owners" existe implicitamente em toda org do Gitea. Usar `addTeamRepo(ownersTeamId, aluno, fork-name)` dá aos owners da org acesso ao fork sem expor a alunos.

```
  PUT /teams/{ownersTeamId}/repos/{aluno}/{fork-name}
```

## Risks / Trade-offs

- [**Forks existentes**] → Botão "Fixar Acesso" resolve em lote. Aluno não precisa refazer fork.
- [**Token do aluno pode expirar**] → O pós-fork já executa outros `_fetch` com o token atual. Se expirar, o fork simplesmente falha (não há estado inconsistente).
- [**Gitea sem time Owners**] → Em instâncias antigas ou configuradas diferentemente o time pode ter outro nome (ex: "Administradores"). O código deve buscar por nome ou fallback para o primeiro time admin. LOW RISK — Forgejo/Gitea moderno sempre tem "Owners".
