## Context

O sistema é 100% frontend estático (sem servidor). A autenticação e os dados vêm do Gitea via API. As correções envolvem ajustes localizados em arquivos HTML/JS.

## Goals / Non-Goals

**Goals:**
- `redirect_uri` em `login.html` deve ser dinâmica, não hardcoded
- `deleteTaskRepo` deve realmente excluir o repositório via API do Gitea
- Links e documentação quebrados devem ser corrigidos
- Feedback visual em ações destrutivas deve seguir o padrão do sistema

**Non-Goals:**
- Não muda arquitetura, fluxo de dados ou lógica de negócio
- Não adiciona novas funcionalidades
- Não altera o schema de specs existentes

## Decisions

### 1. `redirect_uri` — extrair base path do `window.location`

Em vez de `window.location.origin + '/s3lab-infra/S3LabEdu/oauth-callback.html'`, usar:

```js
const base = window.location.pathname.replace(/\/[^/]*$/, '');
const redirectUri = window.location.origin + base + '/oauth-callback.html';
```

Isso funciona em qualquer deploy: local (`/oauth-callback.html`), subpath (`/s3lab-infra/S3LabEdu/oauth-callback.html`), etc.

**Alternativa considerada:** usar `window.location.origin` + caminho fixo relativo à raiz. Rejeitada porque o deploy em Forgejo Pages usa subpath.

### 2. `deleteTaskRepo` — chamar `deleteRepo` do Gitea

A função já importa `deleteRepo` de `gitea-api.js` mas não a usa. Basta adicionar a chamada, com confirmação via `confirm()` e feedback no DOM.

**Decisão:** manter `confirm()` para ações destrutivas (é padrão em `teacher/turma-alunos.html` e `teacher/acompanhamento.html`). Após exclusão, mostrar mensagem de sucesso e re-renderizar.

### 3. Link `login-aluno.html` → `login.html`

Trocar `../login-aluno.html` por `../login.html` em `task/index.html`. Adicionar parâmetro `?redirect=task` se quiser redirecionar de volta após login, mas por ora só corrigir o link quebrado.

### 4. README — atualizar referências

Substituir `login-aluno.html` por `login.html` nas 3 ocorrências da documentação.

## Risks / Trade-offs

- **nenhum** — todas as correções são localizadas, sem efeito colateral
