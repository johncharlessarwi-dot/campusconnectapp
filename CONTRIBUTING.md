# Contributing to CampusConnect

Thank you for helping improve CampusConnect, a student-focused platform for university communities, accommodation discovery, marketplace activity, events and messaging.

## Before you start

1. Read the project overview in [README.md](README.md).
2. Review the [Community Safety Guidelines](docs/COMMUNITY-SAFETY-GUIDELINES.md).
3. Check existing issues and pull requests before starting duplicate work.
4. For a significant change, open an issue first to agree on scope.

## Local setup

Use a supported Node.js LTS release.

```bash
npm install
npm run dev
```

The repository currently defines these verification commands:

```bash
npm run lint
npm run build
```

Run both before submitting a pull request. If a command cannot run because a required external service or secret is unavailable, explain that limitation and include the exact output. Do not claim a check passed when it was not run.

## Change guidelines

- Keep changes focused and explain the user problem they solve.
- Preserve existing authentication, database and deployment configuration unless the change explicitly requires modifying them.
- Do not commit real API keys, service-role keys, passwords, access tokens, private student records or production data.
- Use environment variables for secrets and update `.env.example` only with safe placeholder names and values.
- Validate untrusted input on the server, not only in the browser.
- Check authorization on every operation that reads or changes private student, listing, message or account data.
- Avoid exposing private contact details, precise accommodation addresses or uploaded identity documents in public responses.
- Treat marketplace sellers, landlords and opportunities as unverified unless the product has actually completed a documented verification process.
- Make interactive controls keyboard accessible and provide labels for form fields.

## Pull request checklist

Before requesting review, confirm:

- [ ] The PR describes the user-facing problem and the chosen solution.
- [ ] The change is limited to the stated scope.
- [ ] `npm run lint` has been run.
- [ ] `npm run build` has been run.
- [ ] No secrets, private records or generated build output were added.
- [ ] Relevant safety, privacy and authorization implications are described.
- [ ] Screenshots or reproduction steps are included for visible UI changes.

## Review expectations

Reviews should focus on correctness, security, accessibility, maintainability and regressions. Be respectful and specific. A PR should be merged only after its changes have been reviewed and required checks have passed.

## Reporting security issues

Do not publish credentials, exploitable details or private user data in a public issue. Contact the repository maintainer privately and include the affected area, impact and safe reproduction details.
