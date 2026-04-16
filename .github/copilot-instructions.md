# Copilot Instructions for prueba-angular-bc

This file contains project-specific guidance for AI coding agents.
For generic Angular CLI usage and local setup, see [README.md](../README.md).

## Project Snapshot

- Angular 21 app with standalone components and lazy route loading.
- UI stack: Tailwind CSS v4 + PrimeNG/PrimeIcons.
- Package manager: pnpm (`packageManager` is `pnpm@10.33.0`).
- Unit tests run with Angular's `@angular/build:unit-test` target (Vitest in this repo).

## Commands Agents Should Use

- Install deps: `pnpm install`
- Dev server: `pnpm start` (or `npm start` if pnpm is unavailable)
- Build: `pnpm build`
- Tests: `pnpm test`
- Watch build: `pnpm watch`

## Architecture and Boundaries

- Main app shell and providers:
  - `src/main.ts`
  - `src/app/app.config.ts`
  - `src/app/app.ts`
- Route-driven features live in `src/app/features/` and are lazy-loaded from `src/app/app.routes.ts`.
- Cross-cutting/shared logic:
  - `src/app/core/services/`
  - `src/app/core/interfaces/`
  - `src/app/shared/components/`
- Keep feature-specific logic inside its feature folder; promote to `core` only when reused.

## Code Conventions (Repo-Specific)

- Prefer `inject()` over constructor injection.
- Use signals (`signal`, `computed`, `toSignal`) for local reactive state.
- Use native control flow (`@if`, `@for`, `@switch`) in templates.
- Use Reactive Forms (see `src/app/core/services/perfil-form.ts`).
- Keep `ChangeDetectionStrategy.OnPush` for components.
- Avoid `ngClass` and `ngStyle`; use `class`/`style` bindings.
- Do not add `standalone: true` in decorators (Angular 20+ default).

## Routing and Step Flow Notes

- The profile flow is nested under `entrenador` in `src/app/app.routes.ts`.
- `src/app/core/services/stepper.ts` infers step index from URL path and `NavigationEnd` events.
- If route segments are renamed, update step mapping logic and related tests together.

## Form and Validation Notes

- `src/app/core/services/perfil-form.ts` centralizes typed form creation and dynamic validators.
- Age-dependent document validation is updated reactively; preserve this behavior when editing.
- Input masking for document fields is implemented in feature code (`crear-perfil`), not in shared directives.

## HTTP and Environment Notes

- Use `src/app/core/services/http-client.ts` as the default API wrapper before adding direct `HttpClient` usage.
- Keep API response typing aligned with `src/app/core/interfaces/http-client.ts`.
- External API base URL is in `src/environments/environment.ts`.

## Paths and Imports

- Prefer configured TS path aliases:
  - `@core/*`
  - `@shared/*`
  - `@features/*`
  - `@env/*`
- Keep imports stable and avoid deep relative paths when an alias exists.

## Safety Checklist for Agent Edits

- Preserve existing route behavior in `app.routes.ts`.
- Keep templates accessible (labels, semantics, and keyboard support).
- Do not introduce `any`; prefer inferred types or `unknown`.
- Run `pnpm test` after non-trivial logic changes.
