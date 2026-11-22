## Why

O professor precisa aplicar uma tarefa em que cada aluno recebe uma questão diferente. Hoje o fork é uma cópia exata do repositório da tarefa, então todos recebem o mesmo README.md. Além disso, o fluxo de aceite estava duplicado em `task/index.html` e `student/dashboard.html`.

## What Changes

- **Questões no repositório da tarefa**: ao criar a tarefa, o professor pode marcar "Questões individuais" e cadastrar as questões, gravadas em `questoes/NN.md` no próprio repositório (o modelo dos alunos), em um único commit. O README.md recebe um bloco reservado (`<!-- s3lab:questao:inicio -->` … `<!-- s3lab:questao:fim -->`) e o repositório recebe o tópico `questoes-individuais`. As questões não são secretas.
- **Repositório existente**: ao escolher um repositório existente, ou digitar o nome de um que já existe, o formulário avisa e carrega as questões que ele já tem em `questoes/` para edição. Questões editadas atualizam o mesmo arquivo; as removidas são apagadas; as novas recebem o próximo número livre (um número apagado não é reaproveitado, para não mudar o significado de uma questão já sorteada).
- **Sorteio pelo professor**: tarefas com o tópico `questoes-individuais` mostram o botão "Sortear questões". Para cada fork sem questão, o sistema escolhe ao acaso uma das questões menos usadas — ninguém repete enquanto houver questões sobrando — e grava o bloco no README.md do fork com o token do professor (colaborador com escrita). O id fica no bloco (`id=NN`) e é o registro do sorteio: sortear de novo só atinge quem ainda não tem questão. O commit é do professor, portanto não conta como commit do aluno.
- **Aceite unificado**: `acceptTask(owner, repo, giteaUser, deadlineDate)` em `gitea-api.js` passa a ser usado pelas duas telas de aceite.

## Capabilities

### Modified Capabilities
- `teacher-tasks`: cadastro de questões individuais e sorteio
- `task-enrollment-link` / `student-tasks`: aceite usa a função compartilhada `acceptTask`

## Impact

- `components/gitea-api.js` — `acceptTask`, `getRepoFile`, `listRepoDir`, `changeRepoFiles`, `putRepoFile`; `getTaskReposForOrg` expõe `questions`
- `components/task-questions.js` — novo: carregar/gravar questões, aplicar a questão no README, sortear
- `teacher/tarefas.html` — formulário de questões, detecção de repositório existente, botão "Sortear questões"
- `task/index.html`, `student/dashboard.html` — usam `acceptTask`
- Requer a API de conteúdo do Forgejo com `POST /repos/{owner}/{repo}/contents` (vários arquivos em um commit)
