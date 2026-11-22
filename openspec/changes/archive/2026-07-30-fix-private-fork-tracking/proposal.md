## Why

Repositórios de tarefas foram tornados privados e forks de alunos também são privados. O professor (owner da org) não consegue mais ler commits, tags e issues nos forks dos alunos — a tela de Acompanhamento mostra `-` em todas as colunas exceto "Aceitaram". Isso inviabiliza o monitoramento de entregas.

## What Changes

- **Nova função `addRepoCollaborator`** na `gitea-api.js`: adiciona um usuário como colaborador em um fork de aluno.
- **Nova função `listOrgOwners`** na `gitea-api.js`: descobre os owners da org via endpoint `GET /users/{username}/orgs/{org}/permissions` (funciona com token de aluno), em vez de listar membros do time Owners (que retorna 403).
- **Pós-fork (aluno)**: após `createForkSafe`, usa `listOrgOwners` para descobrir professores e adiciona cada um como colaborador `write` automaticamente.
- **Botão "Fixar Acesso"** na tela de Acompanhamento: por linha de tarefa, varre todos os forks e adiciona o time Owners da org como colaborador. Resolve forks existentes sem depender do aluno. (Inalterado — usa token do professor que funciona com `addTeamRepo`.)
- A tela de Acompanhamento passa a refletir dados reais de commits, tags e issues.

## Capabilities

### New Capabilities
- `fork-org-collab`: adição da org como colaboradora `read` nos forks privados de tarefas, feita pelo aluno no pós-fork e pelo professor sob demanda via botão.

### Modified Capabilities
- `teacher-tracking`: adiciona botão "Fixar Acesso" na coluna Ações. Tracking passa a mostrar dados de commits, tags e issues quando a org tem acesso ao fork.

## Impact

- `components/gitea-api.js`: nova função `addRepoCollaborator(owner, repo, collaborator, permission)`
- `task/index.html`: pós-fork adiciona org como colaboradora
- `student/dashboard.html`: pós-fork adiciona org como colaboradora
- `teacher/acompanhamento.html`: botão "Fixar Acesso" + lógica de re-leitura após fixar
- `teacher/detalhes-tarefa.html`: beneficiário indireto (passa a receber dados reais)
