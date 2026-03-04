# Client Guidelines

## Code Style
- Stack: React 18 + TypeScript + Vite + Tailwind + shadcn/ui.
- Prefer existing UI primitives from [../src/components/ui](../src/components/ui) and compose classes with `cn` from [../src/lib/utils.ts](../src/lib/utils.ts).
- Keep imports via alias `@/...` (configured in [../tsconfig.json](../tsconfig.json) and [../vite.config.ts](../vite.config.ts)); avoid deep relative paths when alias is available.
- Follow existing file naming and page layout patterns in [../src/pages](../src/pages) and [../src/components/landing](../src/components/landing).
- Use functional components and hooks; match the style used in [../src/pages/Auth.tsx](../src/pages/Auth.tsx) and [../src/components/landing/LeadForm.tsx](../src/components/landing/LeadForm.tsx).

## Architecture
- App providers and routing are centralized in [../src/App.tsx](../src/App.tsx) (`QueryClientProvider`, `TooltipProvider`, toasters, route table).
- Main pages live in [../src/pages](../src/pages); landing sections are split into focused components under [../src/components/landing](../src/components/landing).
- Route structure is intentionally small (`/`, `/auth`, `*`) in [../src/App.tsx](../src/App.tsx); keep additions minimal and explicit.

## Build and Test
- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build production bundle: `npm run build`
- Lint: `npm run lint`
- Run tests: `npm run test`
- Watch tests: `npm run test:watch`
- Vitest runs in `jsdom` with setup in [../vitest.config.ts](../vitest.config.ts) and [../src/test/setup.ts](../src/test/setup.ts).

## Project Conventions
- User-facing text must use i18n keys via `useTranslation()`; do not hardcode strings when a key belongs in locale files.
- i18n resources are initialized in [../src/i18n.ts](../src/i18n.ts); locale dictionaries are in [../src/locales](../src/locales).
- For forms, follow existing `zod` + `safeParse` + field error map pattern (examples: [../src/pages/Auth.tsx](../src/pages/Auth.tsx), [../src/components/landing/LeadForm.tsx](../src/components/landing/LeadForm.tsx)).
- Extend existing shadcn variants/components before introducing new custom UI primitives.

## Integration Points
- React Query is configured at app root in [../src/App.tsx](../src/App.tsx); use it for server-state flows when adding API integration.
- Current auth/lead flows persist to `localStorage` in [../src/pages/Auth.tsx](../src/pages/Auth.tsx) and [../src/components/landing/LeadForm.tsx](../src/components/landing/LeadForm.tsx).
- Path alias and test/build tooling are coordinated across [../tsconfig.json](../tsconfig.json), [../vite.config.ts](../vite.config.ts), and [../vitest.config.ts](../vitest.config.ts).

## Security
- Do not add secrets/tokens to frontend code, tests, or config files.
- Treat `localStorage` auth as development/demo behavior; avoid expanding plaintext credential storage patterns.
- Be careful with user data handling in auth/lead flows; preserve existing behavior unless task explicitly requests a flow change.
