## 1. Create the `<ui-date>` Web Component

- [x] 1.1 Create `components/ui-date.js` with basic class, Shadow DOM, and `customElements.define`
- [x] 1.2 Implement `observedAttributes` (`value`, `locale`, `format`, `fallback`) with reactive re-render
- [x] 1.3 Implement short absolute format using `Intl.DateTimeFormat` with locale support
- [x] 1.4 Implement long absolute format using `Intl.DateTimeFormat` with month names
- [x] 1.5 Implement year format (`Intl.DateTimeFormat` with `{ year: 'numeric' }`)
- [x] 1.6 Implement relative format using `Intl.RelativeTimeFormat` (past, future, and "agora")
- [x] 1.7 Handle absent vs present-but-empty `value` semantics:
      - No `value` attribute → use `new Date()` (current date/time)
      - `value` present but empty/invalid/null → show `fallback` (default `-`)
- [x] 1.8 Add inline styles and ensure the component renders as an inline element (`display: inline`)

## 2. Migrate Existing Pages to Use `<ui-date>`

- [x] 2.1 Replace `new Date().getFullYear()` in `components/app-footer.js` with `<ui-date format="year"></ui-date>`
- [x] 2.2 Add `<script>` import of `ui-date.js` in `pages/academic/teacher/tarefas.html`
- [x] 2.3 Replace the deadline `toLocaleDateString` expression in `tarefas.html` with `<ui-date value="${t.deadline}">`
- [x] 2.4 Add `<script>` import and replace expression in `pages/academic/teacher/acompanhamento.html`
- [x] 2.5 Add `<script>` imports and replace both deadline expressions in `pages/academic/task/index.html`
- [x] 2.6 Add `<script>` import and replace expression in `pages/academic/student/minhas-tarefas.html`
- [x] 2.7 Add `<script>` import and replace expression in `pages/academic/student/dashboard.html`

## 3. Verify and Clean Up

- [x] 3.1 Verify no remaining `toLocaleDateString` calls exist in page files
- [x] 3.2 Verify no remaining `new Date().getFullYear()` for display exists (footer already updated)
- [x] 3.3 Test component renders correctly with all format modes in the browser (manual verification)
