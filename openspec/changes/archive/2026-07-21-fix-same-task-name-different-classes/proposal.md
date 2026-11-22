## Why

Um aluno pode estar matriculado em múltiplas turmas que tenham tarefas com o mesmo nome (ex: "projeto-1" em "ads-2025-1" e "projeto-1" em "inf-2025-2"). Atualmente o sistema identifica tarefas aceitas apenas pelo nome do repositório (`r.name`), ignorando a turma. Isso faz com que a segunda tarefa com mesmo nome seja considerada como já aceita, bloqueando o aluno de aceitá-la.

## What Changes

- `getAcceptedRepoNames()` em `dashboard.html` passará a usar chave composta `${org}/${repo}` em vez de apenas `r.name`
- Filtro de tarefas disponíveis em `renderAvailableTasks()` passará a usar a mesma chave composta
- IDs de elementos DOM em `minhas-tarefas.html` passarão a incluir a turma para evitar conflitos de renderização

## Capabilities

### New Capabilities
- *(nenhuma)*

### Modified Capabilities
- `student-tasks`: a verificação de tarefas já aceitas deve considerar turma + repositório, não apenas o nome do repositório

## Impact

- `student/dashboard.html` — função `getAcceptedRepoNames()` e `renderAvailableTasks()`
- `student/minhas-tarefas.html` — IDs de elementos DOM e lógica de renderização
