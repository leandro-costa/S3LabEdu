## Context

`createOrgTeam` chama `_fetch` que retorna `null` quando `res.json()` falha (resposta vazia). `ensureAlunosTeam` não trata esse caso e lança erro mesmo se o time foi criado.

## Goals / Non-Goals

**Goals:**
- Garantir fallback para `getTeamByName` quando `createOrgTeam` retornar time sem `id`
- Adicionar logs de diagnóstico (console.warn/error)

**Non-Goals:**
- Não alterar o comportamento de `_fetch` (pode afetar outros callers)

## Decisions

| Decisão | Razão |
|---------|-------|
| Fallback `getTeamByName` após `createOrgTeam` sem `id` | O time pode ter sido criado mesmo sem resposta JSON válida |
| `console.warn` nos fallbacks | Diagnóstico sem quebrar a UX com alerts |
| `console.error` com detalhes antes de lancar erro | Rastreabilidade em produção/desenvolvimento |

## Risks / Trade-offs

- [Team não foi criado realmente] → `getTeamByName` também não acha → erro original é preservado
- [Performance] Chamada extra `getTeamByName` só ocorre no fallback, não no fluxo normal
