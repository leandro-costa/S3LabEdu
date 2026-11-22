## ADDED Requirements

### Requirement: Display formatted date as text

The `<ui-date>` web component SHALL render a formatted date string inside its shadow root. It SHALL accept a `value` attribute containing an ISO 8601 date string or a date-compatible value.

**Behavior matrix:**
- `value` attribute **absent** → component MUST use `new Date()` (current date/time)
- `value` attribute **present but empty/`null`/invalid** → component SHALL display the `fallback` string (default `-`)
- `value` attribute **present with valid date** → component SHALL format and display the date

#### Scenario: Valid date renders formatted text
- **WHEN** `<ui-date value="2025-03-15"></ui-date>` is inserted into the DOM
- **THEN** the component's shadow root SHALL contain a text node displaying a formatted date for the `pt-BR` locale (e.g., `15/03/2025`)

#### Scenario: Invalid date shows fallback
- **WHEN** `<ui-date value="not-a-date"></ui-date>` is inserted into the DOM
- **THEN** the component's shadow root SHALL display the fallback string (`-`)

#### Scenario: Attribute present but empty shows fallback
- **WHEN** `<ui-date value=""></ui-date>` is inserted into the DOM
- **THEN** the component's shadow root SHALL display the fallback string (`-`)

#### Scenario: Attribute absent uses current date
- **WHEN** `<ui-date format="relative"></ui-date>` is inserted into the DOM with no `value` attribute
- **THEN** the component SHALL render using `new Date()` (current time, e.g., `agora`)

#### Scenario: Custom fallback text
- **WHEN** `<ui-date value="" fallback="Sem prazo"></ui-date>` is inserted into the DOM
- **THEN** the shadow root SHALL display `Sem prazo`

### Requirement: Support absolute date format styles

The component SHALL support a `format` attribute with values `short`, `long`, `relative`, or `year`. The `short` format SHALL produce a locale-specific short date (e.g., `15/03/2025` for pt-BR). The `long` format SHALL produce a full date string (e.g., `15 de março de 2025` for pt-BR). The `year` format SHALL produce only the 4-digit year (e.g., `2026`).

#### Scenario: Short format
- **WHEN** `<ui-date value="2025-03-15" format="short"></ui-date>` is inserted
- **THEN** the display SHALL be a short localized date string

#### Scenario: Long format
- **WHEN** `<ui-date value="2025-03-15" format="long"></ui-date>` is inserted
- **THEN** the display SHALL be a full localized date string with month name

#### Scenario: Year format
- **WHEN** `<ui-date format="year"></ui-date>` is inserted (no `value` attribute)
- **THEN** the display SHALL be the current 4-digit year (e.g., `2026`)

### Requirement: Display relative dates

The component SHALL support `format="relative"` to display dates relative to the current time (e.g., `há 2 dias`, `em 3 meses`, `agora`). It SHALL use `Intl.RelativeTimeFormat` with the configured locale.

#### Scenario: Past date shows "há X tempo"
- **WHEN** `<ui-date value="2025-03-10T12:00:00" format="relative"></ui-date>` is inserted and current time is 2025-03-15T12:00:00
- **THEN** the display SHALL be `há 5 dias`

#### Scenario: Future date shows "em X tempo"
- **WHEN** `<ui-date value="2025-03-20T12:00:00" format="relative"></ui-date>` is inserted and current time is 2025-03-15T12:00:00
- **THEN** the display SHALL be `em 5 dias`

#### Scenario: Current time shows "agora"
- **WHEN** `<ui-date value="2025-03-15T12:00:00" format="relative"></ui-date>` is inserted and current time is 2025-03-15T12:00:00
- **THEN** the display SHALL be `agora`

### Requirement: Configurable locale

The component SHALL accept a `locale` attribute (default `pt-BR`) that controls the language used for date formatting and relative time labels.

#### Scenario: Custom locale
- **WHEN** `<ui-date value="2025-03-15" locale="en-US"></ui-date>` is inserted
- **THEN** the display SHALL use English formatting (e.g., `3/15/2025` for short format)

### Requirement: Attribute reactivity

The component SHALL observe `value`, `locale`, `format`, and `fallback` attributes. Changing any of these attributes after insertion SHALL trigger a re-render.

#### Scenario: Dynamic attribute change
- **WHEN** a `<ui-date value="2025-03-15"></ui-date>` element has its `value` attribute changed to `2025-04-01`
- **THEN** the display SHALL update to reflect the new date without page reload

### Requirement: Custom element registration

The component SHALL be registered with `customElements.define('ui-date', UiDate)` following project conventions.

#### Scenario: Component is defined
- **WHEN** `components/ui-date.js` is loaded
- **THEN** `customElements.get('ui-date')` SHALL return the component class
