## Context

O `<tab-nav>` é um Web Component usado em todas as páginas teacher. Ele gera links `<a>` para as abas (Turmas, Tarefas, Acompanhamento) anexando `window.location.search` como query string. Isso tem dois problemas:

1. **Links congelados**: a query string é lida uma vez no `connectedCallback()`. Se a URL muda depois (via `history.replaceState`), os links não refletem a mudança — o parâmetro `org` se perde ao navegar.
2. **Vazamento de parâmetros**: a query string inteira é copiada para todas as abas. Parâmetros de página específica (`?owner=X&repo=Y`) poluem as URLs das outras páginas.

Cada página teacher já lê e respeita `?org=` individualmente. O problema é exclusivamente de navegação entre páginas.

## Goals / Non-Goals

**Goals:**
- Tab-nav re-renderiza links quando `org` muda (dropdown, navegação histórico)
- Tab-nav propaga apenas `?org=...` (filtra outros params)
- Padronizar `owner` → `org` em `detalhes-tarefa.html`

**Non-Goals:**
- Não mudar o mecanismo de navegação (links `<a>` com href continuam)
- Não introduzir sessionStorage, router ou SPA
- Não alterar comportamento das páginas student

## Decisions

### 1. CustomEvent + popstate em vez de método direto

| Opção | Prós | Contras |
|-------|------|---------|
| **A) Método `.update(org)` no tab-nav** | Simples, direto | Acoplamento: cada página chama o componente |
| **B) CustomEvent + popstate** | Desacoplado, qualquer código pode disparar, popstate cobre navegação histórico | Disparar evento extra no dropdown |
| **C) Interceptar clique nas abas** | Sempre fresco | Muda padrão de navegação, quebra Ctrl+Click |

**Escolha: B**. O evento `org-changed` é disparado por cada `orgChanged()` após `replaceState`. O tab-nav também escuta `popstate` para cobrir navegação voltar/avançar.

### 2. Re-renderizar links sem destruir o tab-nav

Em vez de reconstruir o `nav` inteiro, o tab-nav mantém referência aos elementos `<a>` e atualiza apenas o atributo `href`. Isso evita flash de DOM e preserva event listeners.

### 3. `owner` → `org` em detalhes-tarefa.html

O parâmetro `owner` conceitualmente é a organização (turma). Padronizar para `org` elimina a conversão manual em `detalhes-tarefa.html:34-41` que tentava inferir `org` do `document.referrer`.

## Risks / Trade-offs

- **Dropdown seleciona turma mas não navega**: se o usuário seleciona a turma no dropdown do `tarefas.html` e depois clica em "Acompanhamento", o `org` vai estar na URL corretamente. Mas se ele seleciona "Todas as turmas", navega sem `org`. Comportamento esperado e correto.
- **CustomEvent não escutado**: se outra página teacher for criada e esquecer de disparar `org-changed`, o tab-nav não atualiza. Risk baixo — páginas existentes já têm `orgChanged` e basta incluir o dispatch.
- **Sincronia entre abas do navegador**: o `popstate` só cobre a aba atual. Múltiplas abas não compartilham estado — isso é intencional (estado na URL, não em memória compartilhada).
