## Context

O Gitea API aceita `{ name: 'fork-name' }` no body do `POST /repos/{owner}/{repo}/forks` para definir o nome do fork. Atualmente `createFork` envia `{}` (vazio), deixando o Gitea usar o nome original.

## Goals / Non-Goals

**Goals:**
- Fork nomeado como `{org}-{repo}` para evitar colisão entre turmas
- Delivery issue criado no fork com o nome correto
- Links para o fork apontando para o nome correto

**Non-Goals:**
- Não alterar `checkFork` (busca por owner, não por nome)
- Não alterar `listForks` (usado pelo teacher, não muda)

## Decisions

- **`createFork` retorna o fork**: o response já contém `fork.name` — callers usam esse valor.
- **`forkName = \`${owner}-${repo}\`**: consistente com a sanitização já aplicada em nomes (só `[a-z0-9-]`).

## Risks / Trade-offs

- [**Fork renomeado quebra link existente**] → Só afeta forks futuros. Forks existentes mantêm o nome original.
- [**`createDeliveryIssue` precisa do nome correto**] → Capturar `fork.name` do response resolve.
