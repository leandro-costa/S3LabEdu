## Context

`gitea-api.js` é o módulo central de API. Todas as páginas o importam. Algumas funções se tornaram mortas ou redundantes após refactors. A remoção é puramente mecânica — sem mudança de comportamento observável.

## Goals / Non-Goals

**Goals:**
- Remover `setupLogout()` e seu uso em 5 páginas (logout já é tratado por `<page-header>`)
- Remover `isOrgOwner()` (nunca chamada)
- Remover `broadcastAuth()` (nunca chamada, exposta em `window`)
- Remover `logout` do export (acessado via `window.logout` global)
- Remover `isTeamMember` do export (só usada internamente por `isOrgOwner`, que será removida)

**Non-Goals:**
- Não alterar comportamento de logout
- Não alterar comportamento de autenticação
- Não refatorar outras funções
- Não adicionar novas funcionalidades

## Decisions

- **Remoção completa, não depreciação**: Como nenhuma dessas funções tem uso externo real, removê-las de uma vez é mais limpo que marcar como deprecated.
- **Manter `window.logout`**: O `<page-header>` chama `window.logout()` diretamente. A função `logout()` permanece, só sai do export ES module.
- **Não criar alias nem fallback**: Nenhuma página importa essas funções do export (exceto `setupLogout`, que será removida das páginas primeiro).

## Risks / Trade-offs

- **Risco mínimo**: As funções removidas são puro código morto — nenhuma delas executa lógica atualmente (`setupLogout` é vazia, `isOrgOwner` não é chamada, `broadcastAuth` não é chamada).
- **Se algo quebrar**: Será erro de import JS (`undefined is not a function`) em página que ainda tenta chamar `setupLogout()`. As tasks garantem remoção ordenada: primeiro páginas, depois definição.
