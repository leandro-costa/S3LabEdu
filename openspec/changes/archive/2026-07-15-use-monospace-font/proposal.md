## Why

The app currently uses Poppins (sans-serif) loaded from Google Fonts, requiring an external network request. Switching to a system monospace font removes the external dependency, loads instantly, and gives the app a technical/developer-oriented appearance consistent with code-focused tools.

## What Changes

- Replace `font-family: 'Poppins', sans-serif` with `'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace` in all CSS rules
- Replace the inline `font-family:Poppins,sans-serif` in `teacher/turma-alunos.html`
- Remove the Google Fonts `<link>` and `<preconnect>` tags for Poppins from all HTML pages
- Add a CSS custom property `--font-family` to `design-tokens.css` for centralized font control

## Capabilities

### New Capabilities
- `ui-typography`: Typography system for the app — defines font-family as a design token and removes external font dependencies

### Modified Capabilities
- *(none — no existing spec defines font-family requirements)*

## Impact

- `css/academic.css` — 3 `font-family` declarations updated
- `css/design-tokens.css` — `--font-family` token added to each theme block
- `teacher/turma-alunos.html` — inline style updated
- All 10 content HTML files — Poppins Google Fonts `<link>` and `<preconnect>` removed
