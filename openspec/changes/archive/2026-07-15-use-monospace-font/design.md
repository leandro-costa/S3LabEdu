## Context

The app uses Poppins (sans-serif) loaded from Google Fonts via `<link>` tags in every HTML page. 10 pages include the Google Fonts preconnect and stylesheet links. The font is declared in 3 CSS rules in `academic.css` and 1 inline style in `teacher/turma-alunos.html`. Switching to a system monospace stack removes the external network dependency, eliminates render-blocking font loads, and gives the app a developer-oriented aesthetic.

## Goals / Non-Goals

**Goals:**
- Replace all `font-family: 'Poppins', sans-serif` with a monospace font stack
- Remove Google Fonts `<link>` and `<preconnect>` tags from all HTML pages
- Add `--font-family` as a CSS custom property in `design-tokens.css` for centralized control

**Non-Goals:**
- No changes to layout, spacing, colors, or theme structure
- Not adding a font subset or font-weight configuration — uses browser default weights
- Not adding a web font download — uses system fonts only

## Decisions

**Decision 1: System font stack over web font**
- Rationale: No external request, zero FOIT (Flash of Invisible Text), instant render, no CDN dependency. The app is already serverless; adding a font CDN is an unnecessary external dependency.
- Stack: `'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace` — JetBrains Mono is widely available on dev machines, Fira Code is popular, Consolas ships with Windows, Courier New is the universal fallback.

**Decision 2: CSS custom property for font-family**
- Rationale: A single `--font-family` token in `design-tokens.css` lets themes override the font later if needed, and avoids repeating the stack in every CSS rule.

**Decision 3: Remove Google Fonts HTML tags entirely**
- Rationale: No longer needed. Keeping them would load an unused font, wasting bandwidth. The tags appear in all 10 content HTML files — a single sed-like replacement across files is sufficient.

## Risks / Trade-offs

- **Font metrics differ from Poppins** → Text layout may shift slightly (line height, button width). Mitigation: Test key pages after change. The monospace stack uses similar x-height fonts, so the impact should be minimal.
- **JetBrains Mono not installed** → Falls through to Fira Code → Consolas → Courier New. All are readable monospace fonts. Acceptable.
- **Loss of Poppins visual identity** → The app will look more technical/terminal-like. This is intentional per the requirement.
