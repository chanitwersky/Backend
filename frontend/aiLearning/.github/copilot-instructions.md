Project-specific Copilot instructions
===================================

Purpose
-------
Short, actionable guidance so an AI coding agent can be productive immediately in this Angular 20 project.

Quick architecture summary
--------------------------
- This is an Angular 20 single-page app (CLI v20.2.2). Entry files and configuration:
  - [src/app/app.config.ts](src/app/app.config.ts) — application providers (router, HttpClient, error listeners).
  - Router routes live in [src/app/app.routes.ts](src/app/app.routes.ts).
  - Root component: [src/app/app.ts](src/app/app.ts).

Important patterns and conventions
--------------------------------
- Components are authored as standalone components (see `standalone: true` in component decorators).
- Components declare their `imports` array directly in the decorator rather than using NgModule imports.
- HTTP client is provided globally via `provideHttpClient()` in `app.config.ts`.
- Authentication token handling: [src/app/service/auth.service.ts](src/app/service/auth.service.ts) writes the JWT to `localStorage` under the key `token`. There is currently no HTTP interceptor to attach the token automatically.
- The codebase uses Angular Signals for small local state (see `signal` in [src/app/app.ts](src/app/app.ts)).

Routing and naming gotchas (must-check)
------------------------------------
- `src/app/app.routes.ts` currently references `RegisterComponent` but does not import it; route paths and component names may be mismatched. Always verify that the component referenced by a route:
  - is imported at the top of `app.routes.ts`, and
  - matches the actual component class name and selector under `src/app/components/`.
- Example problem to fix: [src/app/components/logIn/log-in/log-in.ts](src/app/components/logIn/log-in/log-in.ts) defines a `RegisterComponent`-style API (selector/template filenames like `register.component.html`) but the files are named `log-in.*`. When updating routes or components, align filenames, `templateUrl`/`styleUrl`, and exported class names.

Developer workflows (commands to run)
-----------------------------------
- Start dev server: `npm start` (runs `ng serve`) — opens at http://localhost:4200/.
- Build: `npm run build` (production by default) or `npm run watch` for dev incremental builds.
- Tests: `npm test` (Karma + Jasmine). There are unit spec files beside components and services.

Integration points / external services
------------------------------------
- Backend API base used in-auth service: `http://127.0.0.1:5000/api/users` (see `AuthService.apiUrl`). Adjust when backend host/port changes.

Agent tasks & priorities (practical, non-aspirational)
----------------------------------------------------
- High priority fixes an agent can do immediately:
  1. Open `src/app/app.routes.ts`, add correct imports and fix any mismatched component-name -> file mappings.
  2. Normalize component files under `src/app/components/*` so `class`, `selector`, `templateUrl`, and filenames are consistent (example: ensure `RegisterComponent` and `log-in` files match names).
  3. Add an HTTP interceptor to attach `Authorization: Bearer <token>` from `localStorage` to outgoing requests, or document how callers must add the token.
  4. Add small unit tests for the `AuthService` behaviors around storing/removing `token` (tests exist pattern-wise next to files).
- Medium priority improvements:
  - Add route guards for protected routes.
  - Add README notes if backend host differs from `127.0.0.1:5000`.

What to run after edits
-----------------------
- After code changes, run:
  - `npm run build` to validate compilation.
  - `npm test` to run unit tests.
  - `npm start` then visit `http://localhost:4200/` to sanity-check UI changes.

Files to inspect first (examples)
--------------------------------
- [src/app/app.routes.ts](src/app/app.routes.ts)
- [src/app/app.config.ts](src/app/app.config.ts)
- [src/app/service/auth.service.ts](src/app/service/auth.service.ts)
- [src/app/components/logIn/log-in/log-in.ts](src/app/components/logIn/log-in/log-in.ts)
- [package.json](package.json) and [angular.json](angular.json) for CLI and script details

If you are unsure
-----------------
- Run the dev server and reproduce the issue: `npm start`. Use browser console and network inspector to validate routing and HTTP requests.
- When changing routes or component filenames, update both imports and `templateUrl`/`styleUrl` references — search for the component class name across `src/` to find all usages.

Feedback
--------
If anything above is unclear or you expect other conventions (naming, API hosts, or authentication flows), tell me which area to expand and I'll update this file.
