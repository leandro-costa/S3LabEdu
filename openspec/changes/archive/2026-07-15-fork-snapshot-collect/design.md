## Context

A página `/teacher/tarefas.html` lista todas as tarefas com nome, prazo, link do repositório e ações (copiar link, excluir). Não há mecanismo para o professor "coletar" o estado atual dos forks dos alunos. A API do Gitea suporta criação de tags via `POST /api/v1/repos/{owner}/{repo}/tags`, permitindo marcar um commit específico em cada fork.

## Goals / Non-Goals

**Goals:**
- Adicionar função `createRepoTag` em `gitea-api.js`
- Adicionar função `listRepoTags` em `gitea-api.js`
- Adicionar botão "Coletar" por tarefa em `tarefas.html`
- Criar tag `coleta-YYYY-MM-DD-HHmm` no commit HEAD de cada fork
- Mostrar feedback visual do progresso (spinner + resultado)
- Gerar script .bat de clone para o professor copiar e executar localmente
- Exibir indicador de coleta para o aluno em `minhas-tarefas.html`
- Exibir coluna "Coleta" em `acompanhamento.html` com indicador agregado por tarefa
- Exibir status de coleta por aluno em `detalhes-tarefa.html`

**Non-Goals:**
- Não adicionar agendamento automático de coleta
- Não alterar permissões de acesso aos forks
- Não fazer o clone server-side (o professor executa na máquina dele)

## Decisions

- **Usar tags do Git**: Tags são leves, imutáveis, e não interferem com o fluxo de trabalho dos alunos.
- **Formato da tag**: `coleta-YYYY-MM-DD-HHmm` — inclui data/hora para permitir múltiplas coletas sem conflito.
- **Script .bat**: Gera um arquivo batch com `git clone --branch <tag> <clone_url> <username>` para cada fork. O professor copia e cola no cmd.
- **Clone por tag**: `git clone --branch coleta-...` já baixa o repositório no estado da tag (detached HEAD), sem precisar de checkout adicional.
- **Visibilidade pro aluno**: `minhas-tarefas.html` chama `listRepoTags(studentUser, forkName)` e filtra tags `coleta-*`. Mostra a data da tag mais recente numa coluna "Coleta".
- **Sem confirmação**: Ação direta, sem modal de confirmação, para agilizar o uso (exceto re-coleta).
- **Tags no HEAD**: Usa o ref `HEAD` do fork para criar a tag no commit mais recente.
- **URL HTTPS no script**: Usa `clone_url` do objeto fork, que retorna URL HTTPS. O Git pede credenciais no terminal ou usa GCM.
- **Re-coleta com mesma tag**: Se o professor clicar "Coletar" de novo no mesmo dia, o sistema detecta `lastTagName` armazenado em memória e pergunta se quer re-tentar. Usa a mesma tag — forks que já têm a tag são ignorados (erro tratado como sucesso), forks sem a tag recebem a tag.
- **acompanhamento via API**: Cada task no acompanhamento itera sobre todos os forks e chama `listRepoTags(owner, forkName)` para detectar tags `coleta-*`. Mostra `X/Y` com ✅ (todos coletados) ou ⚠ (parcial). Sem cache — sempre busca da API.
- **detalhes-tarefa via API**: Cada fork na tabela individual recebe `listRepoTags(owner, forkName)` no mesmo loop assíncrono de commits/issues. Mostra ✅ ou ✗ por aluno.

## Risks / Trade-offs

- [Risk] Aluno pode continuar commitando após a coleta → A tag preserva o snapshot no momento da coleta. O fork continua normal.
- [Risk] Fork sem commits → A API retorna 404 para tags no HEAD. Tratar erro e pular.
- [Risk] Muitos forks (~100) → Requisições sequenciais podem demorar. Aceitável — é ação manual do professor.
- [Risk] Script .bat vaza credenciais se compartilhado → O script não contém senhas, apenas URLs públicas (o Git pede autenticação na hora).
