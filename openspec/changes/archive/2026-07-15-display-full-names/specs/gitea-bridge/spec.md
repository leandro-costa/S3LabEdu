## MODIFIED Requirements

### Requirement: Gitea API module finds user by email
The system SHALL provide a function that searches for a Gitea user by email and returns the matching user object (login, full_name, and email).

#### Scenario: User found by email
- **WHEN** `findUserByEmail("student@example.com")` is called
- **THEN** the function SHALL make `GET /api/v1/users/search?q=student@example.com`
- **THEN** it SHALL return `{ login, full_name, email }` of the first matching user (instead of just the login string)

#### Scenario: No user found
- **WHEN** no Gitea user matches the given email
- **THEN** the function SHALL return `null`

### Requirement: OAuth login captures full user name
The OAuth login flow SHALL capture the user's full name from Gitea and store it in sessionStorage alongside email and username.

#### Scenario: Full name stored on login
- **WHEN** the OAuth callback receives user data from `GET /api/v1/user`
- **THEN** the system SHALL store `user.full_name` in `sessionStorage` as `teacher_full_name` or `student_full_name` depending on role

### Requirement: displayUserInfo shows full name
The `displayUserInfo` function SHALL read and display the user's full name from sessionStorage.

#### Scenario: Full name displayed
- **WHEN** `displayUserInfo(role)` is called
- **THEN** it SHALL also read `sessionStorage.getItem(role + '_full_name')` and display it

### Requirement: User info keys include full_name
The `AUTH_KEYS` array SHALL include `teacher_full_name` and `student_full_name` so they are broadcast to other tabs and cleaned up on logout.

#### Scenario: Full name cleared on logout
- **WHEN** the user logs out
- **THEN** `teacher_full_name` and `student_full_name` SHALL be removed from sessionStorage alongside other auth keys
