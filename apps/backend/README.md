# ITSM Backend (NestJS + Prisma)

This service provides authentication, users, tickets, messages, attachments, assets, worklogs, feedback, and audit logging.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm -C apps/backend prisma:generate
pnpm -C apps/backend prisma:migrate
pnpm -C apps/backend build
pnpm -C apps/backend start:prod
```

Default env (.env):

```bash
PORT=3000
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d
DATABASE_URL="file:./dev.db"
```

## Scripts

```bash
pnpm -C apps/backend start        # dev
pnpm -C apps/backend start:dev    # watch
pnpm -C apps/backend build        # compile
pnpm -C apps/backend test         # unit tests
pnpm -C apps/backend test:e2e     # e2e
```

## API Overview

- Auth/Users
  - POST /users/register { fullName, email, password }
  - POST /users/login { email, password } -> { accessToken }
  - GET /users/me (Bearer)
- Tickets
  - POST /tickets (Bearer)
  - GET /tickets?status=&priority=&assigneeId=&requesterId=&q= (Bearer)
  - GET /tickets/:id (Bearer)
  - PATCH /tickets/:id (Bearer)
  - PATCH /tickets/:id/status (ADMIN/IT_AGENT)
  - PATCH /tickets/:id/assign (ADMIN/IT_AGENT)
- Messages
  - GET /tickets/:ticketId/messages (Bearer)
  - POST /tickets/:ticketId/messages (Bearer)
- Attachments
  - POST /attachments/upload (form-data: file, ticketId?, messageId?) (Bearer)
  - Static files served at /uploads/<storageKey>
- Assets
  - POST /assets (ADMIN/IT_AGENT)
  - GET /assets (Bearer)
  - POST /assets/:id/assign (ADMIN/IT_AGENT)
  - PATCH /assignments/:assignmentId/return (ADMIN/IT_AGENT)
  - POST /assets/:id/service-logs (ADMIN/IT_AGENT)
  - POST /assets/:id/licenses (ADMIN/IT_AGENT)
- Worklogs (ADMIN/IT_AGENT)
  - POST /worklogs
  - GET /worklogs?itUserId=&ticketId=
- Feedback (Requester only)
  - POST /tickets/:ticketId/feedback (Bearer)

## Notes

- Change JWT_SECRET in production.
- Consider moving to Postgres in production; update DATABASE_URL.
- Uploaded files saved to ./uploads.
