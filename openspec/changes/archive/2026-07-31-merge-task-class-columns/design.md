## Context

The tracking dashboard (`acompanhamento.html`) currently shows separate "Tarefa" and "Turma" columns. Each row represents a task within a class org. The task name and class are tightly coupled — showing them separately wastes space and doesn't add clarity.

## Goals / Non-Goals

**Goals:**
- Merge "Tarefa" and "Turma" into a single column
- Show the Gitea repository link in the merged column
- Keep the table compact and scannable

**Non-Goals:**
- Change the underlying data model
- Modify filter behavior
- Affect other pages (tarefas.html, detalhes-tarefa.html)

## Decisions

**Column layout**: Task name (bold) on first line, org name + repo link on second line. This keeps the task name prominent while making the repo directly accessible.

**Repo link format**: `<a href="{giteaUrl}/{org}/{repo}" target="_blank">{org}/{repo}</a>` — consistent with existing repo links in detalhes-tarefa.html.

## Risks / Trade-offs

- [Risk] Table may look cramped on narrow screens → Mitigation: The merged column is wider than either original column, so horizontal space is actually gained
