## Context

The project uses vanilla JS web components (Shadow DOM, `observedAttributes`, `attributeChangedCallback`) with no framework or bundler. Dates are currently formatted inline as `new Date(d).toLocaleDateString('pt-BR')` in 6 places across 5 page files, plus `new Date().getFullYear()` in the footer. The component will follow the same `ui-*` naming and structural patterns as existing components like `ui-status-badge` and `ui-card`.

## Goals / Non-Goals

**Goals:**
- Eliminate all 6 inline `toLocaleDateString` expressions by using `<ui-date>` tags
- Eliminate `new Date().getFullYear()` in footer by using `<ui-date format="year">`
- Support absolute date formatting with configurable locale and format style
- Support relative date formatting (e.g., "há 2 dias", "em 3 meses")
- Support year-only format for copyright
- Show a configurable fallback string when `value` is present but empty/invalid
- Use `new Date()` (current time) when `value` attribute is absent
- Zero new dependencies – use `Intl.DateTimeFormat` and `Intl.RelativeTimeFormat`
- Follow existing component conventions: Shadow DOM, attribute observation, class-based

**Non-Goals:**
- Do NOT add a date picker or date input (already covered by `ui-datepicker`)
- Do NOT add a build step or bundler
- Do NOT add timezone conversion logic (dates are treated as UTC/local per spec)
- Do NOT add server-side rendering support

## Decisions

1. **Single `<ui-date>` component vs. separate components** → **Single component** with a `format` attribute (`short | long | relative | year`). Simpler API surface, fewer files.

2. **Shadow DOM rendering via `innerHTML`** → Follows the established pattern in `ui-status-badge.js`, `ui-card.js` etc. Lightweight, no extra dependencies.

3. **`Intl.RelativeTimeFormat` for relative dates** → Handles locale-aware relative formatting natively. No library needed.

4. **Attribute name: `value` instead of `datetime`** → Simpler, more natural for JSON/template interpolation (`${t.deadline}`).

5. **Value-absent vs value-present-but-empty semantics**:
   - Attribute `value` **absent** → component uses `new Date()` ("now")
   - Attribute `value` present, but empty/invalid → component shows `fallback` (`-`)
   - This allows `<ui-date format="year">` for copyright (no value needed) while `<ui-date value="">` explicitly opts into fallback display

6. **Locale attribute with fallback to `pt-BR`** → The app is consistently pt-BR, but the `locale` attribute allows future flexibility.

7. **Re-rendering strategy** → Re-render on `attributeChangedCallback` and `connectedCallback`, same as existing components. No diffing or virtual DOM.

## Relative Time Thresholds (format="relative")

| Difference | Display (pt-BR) |
|---|---|
| < 1 minuto | "agora" |
| 1-59 minutos | "há N minutos" / "em N minutos" |
| 1-23 horas | "há N horas" / "em N horas" |
| 1-6 dias | "há N dias" / "em N dias" |
| 7-29 dias | "há N semanas" / "em N semanas" |
| 30-364 dias | "há N meses" / "em N meses" |
| 1+ ano | "há N anos" / "em N anos" |

## Risks / Trade-offs

- **Invalid date strings** → Component silently falls back to `fallback` text. No console errors to avoid noise.
- **`Intl.RelativeTimeFormat` browser support** → Supported in all modern browsers. No fallback needed for target browsers.
- **Performance** → Minimal, since `Intl.DateTimeFormat` instances are created per render call. Could cache formatters by locale/format key if profiling shows need.
