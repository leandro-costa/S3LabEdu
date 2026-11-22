# UI Typography

## Purpose
Typography system for S3LabEdu — defines the font-family stack as a design token and removes external font dependencies.

## Requirements

### Requirement: Font-family defined as CSS custom property
The system SHALL define the primary font-family as a CSS custom property `--font-family` in `design-tokens.css`, set to a monospace system font stack.

#### Scenario: Font-family token exists in design-tokens.css
- **WHEN** the CSS is loaded
- **THEN** `--font-family` SHALL be defined in the `:root` block with value `'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace`

#### Scenario: Font-family token inheritable by all elements
- **WHEN** any element has `font-family: var(--font-family)` or inherits from `body`
- **THEN** the monospace font stack SHALL be applied

### Requirement: Body text uses monospace font stack
The system SHALL apply `--font-family` to the `body` element so all text inherits the monospace font by default.

#### Scenario: Body font-family applied
- **WHEN** the page renders
- **THEN** `body` SHALL have `font-family: var(--font-family)` applied via `academic.css`

### Requirement: Input fields and buttons use monospace font
Form controls (inputs, selects, buttons, textareas) SHALL use the same monospace font stack as body text.

#### Scenario: Form controls inherit monospace font
- **WHEN** an `<input>`, `<select>`, `<textarea>`, or `.btn` element renders
- **THEN** its `font-family` SHALL be `var(--font-family)`

### Requirement: No external font dependencies loaded
The system SHALL NOT load any external font files (Google Fonts or other CDN fonts) in any HTML page.

#### Scenario: No Google Fonts link tags
- **WHEN** any HTML page is loaded
- **THEN** there SHALL be no `<link href="https://fonts.googleapis.com/...">` tags in the `<head>`

#### Scenario: No Google Fonts preconnect tags
- **WHEN** any HTML page is loaded
- **THEN** there SHALL be no `<link rel="preconnect" href="https://fonts.googleapis.com">` or `<link rel="preconnect" href="https://fonts.gstatic.com">` tags in the `<head>`
