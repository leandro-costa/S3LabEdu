## Why

A landing page HTML monolítica (`index.html` com 847 linhas) mistura estilo, estrutura e lógica em um único arquivo, dificultando manutenção, reuso e evolução. A refatoração para Web Components nativos (Custom Elements v1 + Shadow DOM + HTML Templates + ES Modules) trará encapsulamento real de CSS, componentes reaproveitáveis com parâmetros, e separação clara de responsabilidades sem dependências de frameworks.

## What Changes

- Extrair cada seção da landing page em um Web Component independente
- Criar componentes base reutilizáveis (botão, card, grid, container, fade-in)
- Implementar sistema de temas via CSS Custom Properties (design tokens)
- Substituir JS inline avulso por controllers encapsulados nos componentes
- Adotar ES Modules (`type="module"`) para carregamento
- Manter zero dependências externas (sem frameworks, sem build tools)
- Preservar aparência visual, responsividade e acessibilidade atuais

## Capabilities

### New Capabilities

- `ui-card`: Card genérico — modo serviço (icon + title + desc) e modo depoimento (quote + author + city)
- `ui-grid`: Grid responsivo parametrizável via atributo `cols`
- `ui-two-col`: Layout duas colunas com slots `image`/`text` e atributo `reverse`
- `ui-section-title`: Título + subtítulo padronizados para seções
- `ui-steps`: Lista de passos numerados via CSS counter
- `ui-fade-in`: Animação de entrada CSS-first (`view-timeline`) com fallback JS mínimo
- `ui-theme-picker`: Seletor de temas de cor com persistência em localStorage
- `app-header`: Header fixo com menu mobile via checkbox hack (zero JS)
- `app-hero`: Seção hero parametrizável
- `app-contact-form`: Formulário de contato com validação e evento customizado
- `app-footer`: Footer com navegação e copyright

### Modified Capabilities

*Nenhuma — primeira versão do projeto com Web Components.*

## Impact

- `index.html` será simplificado para importar e montar os componentes
- Todo CSS será movido para Shadow DOM ou folhas de design tokens compartilhadas
- JavaScript será modularizado em arquivos `.js` com `export class`
- Estrutura de diretórios: `components/`, `tokens/`, `index.html`
- Navegadores modernos (Chromium, Firefox, Safari) — sem fallback para legacy
