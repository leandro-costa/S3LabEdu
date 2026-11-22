## Context

Hoje cada tela teacher tem seu próprio filtro de org independente. O professor seleciona a turma em `tarefas.html`, navega para `acompanhamento.html`, e o filtro volta pro default. A solução é usar query params na URL como fonte de verdade compartilhada.

```
     tarefas.html                     acompanhamento.html
  ┌────────────────────┐           ┌────────────────────┐
  │ [ADS          ▼]   │           │ [ADS          ▼]   │
  │ onchange:          │           │ onload:            │
  │ replaceState       │           │ URLSearchParams    │
  │ (?org=ADS)         │           │ .get('org') → ADS  │
  │                    │  naviga   │                    │
  │ Tarefas  Acomp     │ ────────▶ │ Tarefas  Acomp     │
  │  href="tarefas     │           │  href="acompanha   │
  │  .html?org=ADS"    │           │  mento.html?org=   │
  └────────────────────┘           │  ADS"              │
                                   └────────────────────┘
```

## Goals / Non-Goals

**Goals:**
- Filtro de org persiste entre telas via query param na URL
- Navegação (tabs, voltar, links manuais) preserva o param
- Funciona com botão Voltar/Forward do browser
- Nenhuma mudança no comportamento interno de cada tela (cada uma mantém seus filtros específicos)

**Non-Goals:**
- Não alterar o layout ou colunas de nenhuma tela
- Não remover "Todas as turmas" ou "Filtrar por Tarefa"
- Não mudar a lógica de carregamento de dados
- Não adicionar sessionStorage ou estado global

## Decisions

1. **Query param `?org=`** — padrão consistente com o já usado em `turma-alunos.html?org=X`. Sem colisão com outros params.

2. **`history.replaceState` no onchange** — atualiza a URL sem recarregar a página. O navegador não empilha uma entrada nova no histórico (não quebra o back button para cada mudança de filtro).

3. **`tab-nav.js` preserva `location.search`** — abordagem mais simples: concatena `window.location.search` em cada href. Se a URL atual já tem `?org=ADS`, todos os links da tab-nav ganham `?org=ADS`.

4. **`turma-alunos.html`** — atualmente tem `<nav>` manual em vez de `<tab-nav>`. Migrar para `<tab-nav>` para que ganhe automaticamente a preservação de query params (e future-proof para outras melhorias no componente).

## Risks / Trade-offs

- **Múltiplos query params** — se no futuro outra tela usar `?page=2&org=ADS`, o `location.search` preserva tudo. Sem risco.
- **`turma-alunos.html`** — migrar de `<nav>` manual para `<tab-nav>` pode afetar estilos se houver CSS específico. Mitigação: o componente `tab-nav.js` já usa `class="tab-nav"` que é estilizada pelo `academic.css` da mesma forma que o `<nav>` manual.
