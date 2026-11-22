## Context

`teacher/tarefas.html:120` recebe o nome do repo do input `task-new-repo` e passa direto pro Gitea sem sanitizar. O mesmo padrão de sanitização já existe em `teacher/turmas.html:82` para nomes de org.

## Goals / Non-Goals

**Goals:**
- Sanitizar nome do repo antes de enviar ao Gitea
- Consistente com a sanitização de org em `turmas.html`

**Non-Goals:**
- Não alterar validação de outros campos
- Não adicionar feedback visual sobre a transformação

## Decisions

- **Replicar o mesmo regex de `turmas.html`**: `.toLowerCase().replace(/[^a-z0-9-]/g, '-')` — consistência e simplicidade.

## Risks / Trade-offs

- Nenhum — padrão já usado e testado em `turmas.html`
