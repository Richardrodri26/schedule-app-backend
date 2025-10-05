## schedule-app — Desarrollo (NestJS + Prisma + Postgres)

Este repositorio contiene una aplicación backend construida con NestJS y Prisma (PostgreSQL).
Este README explica cómo configurar el entorno de desarrollo, levantar la base de datos con Docker Compose, generar el cliente de Prisma y ejecutar la aplicación en modo desarrollo.

## Requisitos

- Node.js 18+ (recomendado)
- pnpm (preferido si existe `pnpm-lock.yaml`) o npm
- Docker & Docker Compose (para la base de datos en desarrollo)

## Archivos importantes

- `package.json` — scripts y dependencias.
- `prisma/schema.prisma` — esquema Prisma (usa `DATABASE_URL`).
- `.env` — variables de entorno (ej.: `DATABASE_URL`, `POSTGRES_*`).
- `docker-compose.yml` — servicio `postgres-db` para desarrollo.
- `src/main.ts` — punto de entrada (usa `envs.port` o 3000 por defecto).

## Pasos rápidos — montar en desarrollo

1) Instalar dependencias

Si tienes `pnpm` (se detectó `pnpm-lock.yaml`) usa pnpm, si no usa npm:

```bash
# con pnpm (preferido)
pnpm install

# con npm
npm install
```

2) Variables de entorno

Hay un `.env` en la raíz con un ejemplo:

```properties
DATABASE_URL="postgresql://postgres:123456@localhost:5432/scheduleDb"
POSTGRES_USER="postgres"
POSTGRES_DB="scheduleDb"
POSTGRES_PASSWORD="123456"
```

Ajusta las credenciales a tu entorno. `DATABASE_URL` es la variable que Prisma usa (ya está configurada en `prisma/schema.prisma`).

3) Levantar PostgreSQL con Docker Compose (opcional pero recomendado para desarrollo)

```bash
docker compose up -d
```

Esto crea un contenedor `postgres:15.3` enlazado al puerto 5432 y monta la carpeta `./postgres` para persistencia local. Si ya tienes Postgres local, asegúrate de que `DATABASE_URL` apunte a él.

4) Generar Prisma Client

Después de configurar `DATABASE_URL`, genera el cliente Prisma:

```bash
pnpm prisma generate
# o con npx/npm
npx prisma generate
```

Nota: el proyecto incluye la carpeta `prisma/migrations`; si necesitas aplicar migraciones en la base de datos de desarrollo, usa:

```bash
pnpm prisma migrate deploy
# o en desarrollo (crea/aplica migraciones y ejecuta seed si existe):
pnpm prisma migrate dev --name init
```

5) Ejecutar la aplicación en modo desarrollo

```bash
pnpm run start:dev
# o con npm
npm run start:dev
```

Por defecto la app escucha en el puerto definido en `src/config/envs.ts`. Si no está definido, `src/main.ts` usa 3000.

6) Scripts útiles

- `pnpm run start` — iniciar app.
- `pnpm run start:dev` — iniciar con watch (recomendado durante desarrollo).
- `pnpm run lint` — ejecutar ESLint y corregir errores (usa `--fix`).
- `pnpm run format` — formatear con Prettier.
- `pnpm run test` — ejecutar tests (Jest).
- `pnpm run test:e2e` — tests end-to-end.

7) Swagger / Docs (si aplicable)

Si agregas Swagger en bootstrap, lo documentaré aquí. Actualmente el bootstrap sólo crea la app y la hace escuchar en `envs.port`.

## Tips y solución de problemas

- Error de conexión a Postgres: verifica que Docker esté corriendo y que el contenedor `postgres-db` esté arriba (`docker compose ps`). Revisa `DATABASE_URL`.
- Windows + Docker: si el puerto 5432 está ocupado en Windows, cambia el mapeo en `docker-compose.yml` o detén el servicio que usa ese puerto.
- Prisma client no encontrado: corre `npx prisma generate` después de cambiar `prisma/schema.prisma`.
- Migraciones: si las migraciones locales y la BD divergen, puedes usar `prisma migrate reset` (no usar en producción). Ejemplo:

```bash
npx prisma migrate reset --force
```

## Desarrollo adicional y contribución

- Sigue las convenciones de NestJS: crear módulos, controllers y providers. Mantén la lógica en servicios y usa DTOs con `class-validator`.
- Agrega nuevas variables de entorno al archivo `.env` y documentalas aquí.

## Verificaciones rápidas (quality gates)

Antes de abrir un PR o compartir cambios:

```bash
pnpm run build   # compilar TypeScript
pnpm run lint    # lint y correcciones
pnpm run test    # tests unitarios
```

Si algo falla, copia el mensaje de error y revisa la traza — puedo ayudarte a interpretar y fijarlo.

