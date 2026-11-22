## 1. Corrigir createTask para conceder acesso ao time "alunos" em repositórios existentes

- [x] 1.1 Mover `ensureAlunosTeam(org)` para antes do branch novo/existente em `createTask()` em `teacher/tarefas.html`
- [x] 1.2 Mover `addTeamRepo(team.id, org, repo)` para depois do branch, garantindo que seja chamado tanto para repo novo quanto existente
- [x] 1.3 Remover as chamadas duplicadas de `ensureAlunosTeam` e `addTeamRepo` de dentro do bloco `else` (novo repo)
- [x] 1.4 Verificar que a variável `team` está acessível no escopo correto após a refatoração

## 2. Verificação

- [x] 2.1 Criar tarefa com novo repositório — confirmar que alunos veem a tarefa
- [x] 2.2 Criar tarefa com repositório existente — confirmar que alunos veem a tarefa
- [x] 2.3 Verificar que o time "alunos" aparece nos colaboradores do repositório no Gitea em ambos os casos
