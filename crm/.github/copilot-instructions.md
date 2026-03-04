# Project Guidelines

## Code Style
- TypeScript + React (Vite) app based on CoreUI components; follow existing patterns in [src/components/_coreUI](../src/components/_coreUI) and page modules like [src/pages/Home/Home.tsx](../src/pages/Home/Home.tsx).
- RTK Query is used for API access; keep endpoints in [src/store/auth/auth.api.ts](../src/store/auth/auth.api.ts) and reuse `fetchBaseQuery` configs.

## Architecture
- App bootstraps i18n + Redux store, then renders `App` via `Provider` in [src/index.tsx](../src/index.tsx).
- Routing is handled in [src/App.tsx](../src/App.tsx) with `BrowserRouter` and `Suspense`; main shell is `DefaultLayout` in [src/layout/DefaultLayout.tsx](../src/layout/DefaultLayout.tsx).
- Content routes merge app routes and CoreUI demo routes in [src/components/_coreUI/AppContent.tsx](../src/components/_coreUI/AppContent.tsx), [src/_routes.tsx](../src/_routes.tsx), and [src/_coreui_routes.tsx](../src/_coreui_routes.tsx).
- Sidebar navigation is defined in a CoreUI nav config array at [src/_nav.tsx](../src/_nav.tsx).

## Build and Test
- Install and run dev server: `npm install`, then `npm run dev` (or `npm run start` for host/port setup).
- Build: `npm run build`.
- Lint: `npm run lint`.
- No test script is defined in [package.json](../package.json).

## Project Conventions
- API base is centralized in [src/config.ts](../src/config.ts): `config.apiUrl` is `${baseUrl}/api` and `baseUrl` switches between localhost and the production host.
- Auth headers are injected via [src/helpers/headerConfig.ts](../src/helpers/headerConfig.ts); it reads `localStorage.getItem('getMe')` and sets `Authorization: Bearer <access>`.
- Language/theme are stored in `localStorage` (see [src/config.ts](../src/config.ts)) and read on app load in [src/App.tsx](../src/App.tsx).

## Integration Points
- RTK Query auth endpoints include `/api/users/get-me`, `/api/jwt/create`, `/api/jwt/refresh`, and `/api/users/change-password` in [src/store/auth/auth.api.ts](../src/store/auth/auth.api.ts).
- i18n is initialized in [src/i18n/index.ts](../src/i18n/index.ts) with resources in [src/i18n](../src/i18n).

## Security
- Auth tokens are stored in `localStorage` under the `getMe` key and attached to requests in [src/helpers/headerConfig.ts](../src/helpers/headerConfig.ts); treat this as the source of truth for auth state when adding API calls.
