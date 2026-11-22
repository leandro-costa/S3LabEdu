## 1. API

- [x] 1.1 `acceptTask()` em `gitea-api.js` (fork, issues, professores como colaboradores, issue de entrega)
- [x] 1.2 Funções de arquivo: `getRepoFile`, `listRepoDir`, `changeRepoFiles`, `putRepoFile` (UTF-8 ↔ base64)
- [x] 1.3 `getTaskReposForOrg` retorna `questions` (tópico `questoes-individuais`)

## 2. Questões

- [x] 2.1 `components/task-questions.js`: `loadTaskQuestions`, `saveTaskQuestions`, `readAssignedQuestion`, `applyQuestionToReadme`, `distributeQuestions`

## 3. Telas

- [x] 3.1 `task/index.html` e `student/dashboard.html` usam `acceptTask`
- [x] 3.2 Formulário de tarefa: opção "Questões individuais", editor de questões, carga das questões de repositório existente, aviso de nome já existente
- [x] 3.3 Botão "Sortear questões" e tabela de resultado

## 4. Verificação

- [x] 4.1 Teste da lógica com API simulada (gravar, editar, apagar, sortear sem repetir, re-sortear, erro, fork oculto)
- [x] 4.2 Teste do formulário no navegador com API simulada
- [ ] 4.3 Teste num Forgejo real (criar, aceitar com 2+ alunos, sortear)
