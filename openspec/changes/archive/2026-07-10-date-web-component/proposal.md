## Why

The codebase has 6 occurrences of `new Date(date).toLocaleDateString('pt-BR')` repeated across teacher, student, and task pages, plus `new Date().getFullYear()` in the footer. This duplication makes the code harder to maintain, error-prone (missing null checks, inconsistent fallback), and forces a hardcoded locale. A reusable web component eliminates duplication, centralizes formatting logic, and allows runtime locale switching.

## What Changes

- Create a new `<ui-date>` web component in `components/ui-date.js` that displays a formatted date string
- Support attributes: `value` (ISO date string), `locale` (default `pt-BR`), `format` (`short` | `long` | `relative` | `year`), `fallback` (default `-`)
- **Behavior**: when `value` is absent → uses `new Date()` (now); when `value` is present but empty/null/invalid → shows fallback
- Replace all inline `toLocaleDateString` expressions across pages with `<ui-date value="...">` tags
- Replace `new Date().getFullYear()` in `app-footer.js` with `<ui-date format="year">`
- Keep the component zero-dependency, using `Intl.DateTimeFormat` and `Intl.RelativeTimeFormat`

## Capabilities

### New Capabilities
- `ui-date`: A reusable web component for displaying formatted dates with locale, format, and fallback support

### Modified Capabilities
- *(none – no spec-level requirements are changing)*

## Impact

- **New file**: `components/ui-date.js`
- **Modified files**: `components/app-footer.js`, `pages/academic/teacher/tarefas.html`, `pages/academic/teacher/acompanhamento.html`, `pages/academic/task/index.html`, `pages/academic/student/minhas-tarefas.html`, `pages/academic/student/dashboard.html`
- **No new dependencies** – uses native `Intl.DateTimeFormat` and `Intl.RelativeTimeFormat`
- **No breaking changes** – existing date display behavior is preserved
