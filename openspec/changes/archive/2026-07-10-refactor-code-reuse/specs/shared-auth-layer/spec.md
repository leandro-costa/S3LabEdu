## ADDED Requirements

### Requirement: Centralized authentication check
The system SHALL provide a `requireAuth()` function that awaits `waitForAuth()`, checks for a valid OAuth token, and redirects to `../index.html` if not authenticated.

#### Scenario: Authenticated user does not redirect
- **WHEN** `requireAuth()` is called and `oauth_access_token` exists in `sessionStorage`
- **THEN** the function returns without redirecting

#### Scenario: Unauthenticated user redirects to index
- **WHEN** `requireAuth()` is called and `oauth_access_token` does not exist in `sessionStorage`
- **THEN** the redirects to `../index.html`

### Requirement: Centralized Gitea display URL
The system SHALL provide a `getDisplayUrl()` function that returns the Gitea base URL without the `/api/v1` suffix.

#### Scenario: Returns clean URL
- **WHEN** `getDisplayUrl()` is called and `gitea_base_url` ends with `/api/v1`
- **THEN** returns the URL without the `/api/v1` suffix

#### Scenario: Falls back to gitea_url
- **WHEN** `getDisplayUrl()` is called and `gitea_base_url` is not set
- **THEN** returns the value of `gitea_url`

### Requirement: Logout wiring helper
The system SHALL provide a `setupLogout()` function that finds the `#logout-btn` element and attaches a click listener that calls `window.logout()`.

#### Scenario: Logout button exists
- **WHEN** `setupLogout()` is called and a `#logout-btn` element exists in the DOM
- **THEN** attaches a click event listener that calls `window.logout()`

#### Scenario: Logout button does not exist
- **WHEN** `setupLogout()` is called and no `#logout-btn` element exists
- **THEN** the function does nothing (no error thrown)

### Requirement: User info display helper
The system SHALL provide a `displayUserInfo(role)` function that sets the text content of `#<role>-email-display` and `#<role>-gitea-display` elements from `sessionStorage`.

#### Scenario: Elements exist
- **WHEN** `displayUserInfo('student')` is called
- **THEN** sets `#student-email-display` text to `sessionStorage.student_email`
- **AND** sets `#student-gitea-display` text to `sessionStorage.student_gitea_user`
