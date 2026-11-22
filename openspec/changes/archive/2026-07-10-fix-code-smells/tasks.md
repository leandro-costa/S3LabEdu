## 1. Redirect URI e Links Quebrados

- [x] 1.1 Corrigir `redirect_uri` em `login.html` — substituir caminho hardcoded `/s3lab-infra/S3LabEdu/oauth-callback.html` por cálculo dinâmico baseado em `window.location`
- [x] 1.2 Corrigir link para `login-aluno.html` em `task/index.html` — apontar para `login.html`

## 2. Delete Task Repo

- [x] 2.1 Corrigir `deleteTaskRepo` em `teacher/tarefas.html` — chamar `deleteRepo` do Gitea e mostrar feedback no DOM

## 3. Documentação

- [x] 3.1 Atualizar `README.md` — substituir referências a `login-aluno.html` por `login.html` (3 ocorrências)
