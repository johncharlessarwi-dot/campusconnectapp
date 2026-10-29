# Student data handling principles

CampusConnect may process student profiles, organization memberships, event participation, announcements, and messages. Apply these safeguards to any feature that touches student information.

## Minimize

- Collect only fields required for the feature's stated purpose.
- Avoid placing private contact details in public profiles by default.
- Do not expose private group membership or message content in public endpoints.

## Access

- Scope reads and writes to the authenticated user's role and organization.
- Re-check authorization on the server for every sensitive mutation.
- Treat exports and admin search as privileged operations.

## Logging and retention

- Do not log passwords, tokens, private message bodies, or unnecessary personal data.
- Define retention and deletion behavior before launching a new data collection flow.
- Restrict backups and incident exports to authorized operators.

## User support

Provide a clear process for correcting inaccurate profile data and reporting suspected account misuse.