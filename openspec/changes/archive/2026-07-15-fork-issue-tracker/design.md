## Context

When a student forks a task repo, the fork inherits the parent's settings. If the task repo has Issue Tracker disabled, the student's fork also has it disabled — preventing teachers from creating review issues. Additionally, `createDeliveryIssue` is called unconditionally, creating an issue even for tasks without a deadline.

## Goals / Non-Goals

**Goals:**
- Enable Issue Tracker e deadlines em forks de alunos
- Criar delivery issue com `due_date` apenas quando a tarefa tem prazo

**Non-Goals:**
- Não modificar as settings do repositório original
- Não alterar o conteúdo da delivery issue

## Decisions

- **Sempre ativar deadlines no fork**: O fork herda `has_issues: true` do repo original, mas `has_issue_deadlines` pode não estar ativo. O PATCH é chamado **sempre** (não só quando `!fork.has_issues`), com `await` antes de criar a issue.
- **`enableRepoIssues(owner, repo)`**: Envia `PATCH /repos/{owner}/{repo}` com `{ has_issues: true, has_issue_deadlines: true }`.
- **Mesmo padrão em ambos call sites**: `task/index.html` e `student/dashboard.html` seguem: fork → `await enableRepoIssues` → delivery se houver prazo.

## Risks / Trade-offs

- **PATCH extra em todo fork**: Chamada adicional leve (só seta flags), 1 request a mais por fork.
- **PATCH pode falhar**: Se falhar, `due_date` não será aceito. Mitigação: `.catch()` silencioso.
