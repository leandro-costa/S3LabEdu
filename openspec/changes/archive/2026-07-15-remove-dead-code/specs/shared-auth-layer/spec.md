## REMOVED Requirements

### Requirement: Logout wiring helper

**Reason**: The `#logout-btn` element is now handled by the `<page-header>` web component (`page-header.js:22`), which directly calls `window.logout()`. The `setupLogout()` function became a no-op and is no longer needed.

**Migration**: No migration needed — `setupLogout()` was already a no-op. Pages that called it can safely remove the call.
