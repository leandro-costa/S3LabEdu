## REMOVED

### Requirement: Animação fade-in (removida)
O módulo `ui-fade-in.js` e o atributo `data-fade` foram removidos. A animação fade-in foi descartada por simplicidade.

#### Justificativa
- Redução de complexidade (1 arquivo JS + CSS e 8 atributos no HTML)
- A página carrega sem efeitos de entrada, simplificando a manutenção
- O comportamento do original (fade-in com IntersectionObserver) não era crítico para a experiência
