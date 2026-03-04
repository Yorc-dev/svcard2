# Project Guidelines

## Code Style
- Frontend is React + TypeScript + Tailwind + shadcn/ui. Reuse existing UI primitives from [client/src/components/ui](client/src/components/ui) and utility `cn` from [client/src/lib/utils.ts](client/src/lib/utils.ts).
- Keep frontend imports using alias `@/...` as configured in [client/tsconfig.json](client/tsconfig.json) and [client/vite.config.ts](client/vite.config.ts).
- i18n is required for user-facing text; use `useTranslation()` with keys from locale files under [client/src/locales](client/src/locales), initialized in [client/src/i18n.ts](client/src/i18n.ts).

## Architecture
- Frontend app shell and providers are in [client/src/App.tsx](client/src/App.tsx); routes live in [client/src/pages](client/src/pages).
- `crm/` is currently placeholder-only; avoid adding assumptions about CRM runtime.

## Build and Test
- Frontend (from `client/`):
  - `npm install`
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
  - `npm run test`
- Frontend tests run with Vitest (`jsdom`) per [client/vitest.config.ts](client/vitest.config.ts).
- Backend local (from `backend/`):
  - `pip install -r requirements.txt`
  - `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
- Dev containers (repo root):
  - `docker compose -f docker-compose.dev.yml up --build`

## Project Conventions
- For frontend forms, follow existing `zod` + `safeParse` validation pattern (example: [client/src/pages/Auth.tsx](client/src/pages/Auth.tsx), [client/src/components/landing/LeadForm.tsx](client/src/components/landing/LeadForm.tsx)).
- Prefer extending existing shadcn variants/components over introducing custom one-off UI primitives.

## Integration Points
- Frontend currently has localStorage-based auth/lead flows in [client/src/pages/Auth.tsx](client/src/pages/Auth.tsx) and [client/src/components/landing/LeadForm.tsx](client/src/components/landing/LeadForm.tsx); account for this when changing data flows.

## Security
- Treat credentials in compose/alembic configs as development-only and avoid copying them to new files: [docker-compose.dev.yml](docker-compose.dev.yml), [backend/alembic.ini](backend/alembic.ini).
- Do not introduce plaintext secrets or tokens in source, tests, or fixtures.
- Be careful changing auth-related UI logic that persists data in `localStorage` (see [client/src/pages/Auth.tsx](client/src/pages/Auth.tsx)).
- Backend routes currently show no auth dependency by default; if adding protected endpoints, wire dependencies explicitly at router level.
