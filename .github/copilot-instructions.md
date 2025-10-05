## Purpose
This file gives focused, actionable guidance for AI coding agents working in this repository so they can be productive immediately.

## Big picture (what this project is)
### Copilot Instructions – Sistema de Agendamiento Educativo

Este repositorio es una aplicación NestJS (TypeScript) que gestiona agendamiento de clases, profesores, estudiantes, usuarios y roles. Está preparada para trabajar con Prisma + PostgreSQL y sigue las convenciones típicas de NestJS (módulos, controllers, services).

Entry point: `src/main.ts` (levanta `AppModule`). Ejemplo simple presente en `src/app.controller.ts` y `src/app.service.ts`.

## Key files to inspect before editing
- `src/main.ts` — app bootstrap and listen port (process.env.PORT || 3000).
- `src/app.module.ts` — where new modules/providers/controllers are wired.
- `src/app.controller.ts` and `src/app.service.ts` — canonical examples for controllers and providers.
- `src/app.controller.spec.ts` — unit-test example for controllers.
- `test/jest-e2e.json` — e2e test Jest config; `test/app.e2e-spec.ts` contains e2e tests.
- `package.json` — npm scripts and Jest config.

If this project uses Prisma, also check:
- `prisma/schema.prisma` — Prisma schema (models, generators).
- `prisma/migrations/` — migration history (if present).
- `.env` or environment variables for `DATABASE_URL`.

## Scripts & common workflows
- Use the project's scripts in `package.json`. Important ones:
	- `npm run start:dev` — start dev server with Nest watch.
	- `npm run start:debug` — start with Node inspector attached.
	- `npm run build` / `npm run start:prod` — build and run from `dist/`.
	- `npm run test` — run unit tests (Jest). `npm run test:e2e` for e2e tests.
	- `npm run lint` / `npm run format` — code style checks and formatting.

If you see `pnpm-lock.yaml` in the repo root prefer `pnpm` for installs:

```bash
pnpm install
pnpm run start:dev
pnpm run test
```

Debugging tests and app
- Use `npm run start:debug` or `npm run test:debug` (the latter uses `ts-node` and `tsconfig-paths` to run jest under the debugger).

Prisma & database workflows (project-specific)
- If using Prisma (Postgres), common commands:

```bash
# install deps (pnpm preferred if lockfile present)
pnpm install

# generate Prisma client after changing schema
pnpm prisma generate

# apply migrations during development
pnpm prisma migrate dev --name your_change
```

Ensure `DATABASE_URL` is set in `.env` when running migrations or starting the app.

## Project conventions and patterns (what to follow)
- Framework: NestJS v11 patterns (Modules, Controllers, Providers). Follow the same module-granularity when adding features: create a module with controller(s) and provider(s), then add it to `AppModule` imports.
- Keep business logic inside services (providers) and let controllers be thin adapters for HTTP routes — the sample `AppController` delegates to `AppService.getHello()`.
- Tests: unit tests live alongside `src/*.spec.ts`. E2E tests live under `test/` and use `test/jest-e2e.json`.
- Formatting: repo uses Prettier and ESLint. Run `npm run format` and `npm run lint -- --fix` before submitting changes.

In this project specifically:
- Use Nest CLI to scaffold modules/services/controllers to keep consistent file layout and decorators:

```bash
nest g module <module-name>
nest g service <module-name>
nest g controller <module-name>
```

- Validation: prefer DTOs with `class-validator` for incoming payloads. Add pipes in controllers (`ValidationPipe`) when exposing endpoints.
- Documentation: Swagger is used for API docs—register `SwaggerModule` in bootstrap if not already present.

## Integration points & dependencies
- No external DB or APIs are configured in the template. When adding external integrations, add configuration through environment variables and register connections in a dedicated module (e.g., `DatabaseModule`).
- Add new runtime dependencies to `package.json` and prefer pinning versions consistent with existing devDependencies (TypeScript tooling, Jest, Nest packages).

## Examples (from this codebase)
- To add a new GET endpoint:
	- Create `src/your.module.ts`, `src/your.controller.ts`, `src/your.service.ts`.
	- Register the provider and controller in the module and add the module to `AppModule.imports`.
	- Use `AppController` and `AppService` as simple examples of structure and decorators.

Example: scaffold a `schedules` module and service using Nest CLI (keeps conventions):

```bash
nest g module schedules
nest g service schedules
nest g controller schedules
```

## PR checklist for agents
- Ensure TypeScript compiles (`npm run build`).
- Run unit tests (`npm run test`) and e2e where relevant (`npm run test:e2e`).
- Run lint/format scripts and include fixes.
- If you add dependencies, run `pnpm install` (or `npm install`) and update lockfile (`pnpm-lock.yaml` present).

## When you need clarification
- If you cannot find a configuration (database, env schema, CI) assume the project is intentionally minimal and open a draft PR describing the change and request guidance in the PR description.

---
If anything here is unclear or you'd like me to add project-specific rules (naming conventions, module layout examples, or CI steps), tell me what to include and I'll iterate.
