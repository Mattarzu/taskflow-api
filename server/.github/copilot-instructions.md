# Copilot instructions para contributors (resumen rápido)

API REST de tareas en Node.js (ESM) + Express + Prisma (Postgres) con JWT y tests Jest/Supertest.

## Idioma y estilo
- Responde siempre en español; código y nombres en inglés; comentarios en español.

## Entradas y estructura
- Entradas: [index.js](../index.js), [src/server.js](../src/server.js) y [src/app.js](../src/app.js) (bootstrap y rutas).
- Rutas en [src/routes](../src/routes), controladores en [src/controllers](../src/controllers), middlewares en [src/middlewares](../src/middlewares).
- Prisma single-source en [prisma/client.js](../prisma/client.js); reexportado por [src/config/db.js](../src/config/db.js) y [src/config/prisma.js](../src/config/prisma.js).
- Esquema en [prisma/schema.prisma](../prisma/schema.prisma); migraciones en [prisma/migrations](../prisma/migrations).

## Seguridad y runtime
- Env obligatorias: `DATABASE_URL`, `JWT_SECRET` (el arranque falla si faltan); `PORT` opcional.
- Middlewares globales: `helmet`, `cors` (origin configurable via `CORS_ORIGIN`), `express.json({ limit: "1mb" })`, `morgan` (silenciado en test).
- Healthcheck: `GET /health`; Dockerfile define HEALTHCHECK contra esa ruta. Contenedor corre como usuario no-root `app`.
- Errores: handler global en [src/middlewares/error.middleware.js](../src/middlewares/error.middleware.js).
- Auth: JWT helpers en [src/utils/jwt.js](../src/utils/jwt.js); rutas `/auth` usan rate limit ([src/middlewares/rate-limit.middleware.js](../src/middlewares/rate-limit.middleware.js)) y validación de payload ([src/middlewares/validate-auth.middleware.js](../src/middlewares/validate-auth.middleware.js)).
- Roles: enum `Role` en Prisma; `role.middleware.js` está vacío si se quiere implementar RBAC.

## Tests y comandos
- Tests en [tests](../tests) (Jest + Supertest) usan la app de [src/app.js](../src/app.js) y el Prisma de [prisma/client.js](../prisma/client.js); requieren `.env.test` con `DATABASE_URL` y `JWT_SECRET`.
- `npm run dev` / `npm start` — arranca `index.js` y falla si faltan envs.
- `npm test` — corre Jest con `dotenv-cli` cargando `.env.test`.
- CI: [.github/workflows/ci.yml](../../.github/workflows/ci.yml) levanta Postgres 16, crea `.env.test`, ejecuta `npm ci`, `prisma migrate deploy` y `npm test` en `server/`.
- Prisma (manual): `npx prisma migrate dev --schema=server/prisma/schema.prisma` o `npx prisma generate` según necesidad.

## Consideraciones para cambios
- Cambios en auth: tocar helpers JWT, middlewares y tests en conjunto.
- Cambios en modelos: actualizar `prisma/schema.prisma`, generar migración y ejecutar `prisma generate` si aplica.
- No editar `generated/prisma/` salvo que regeneres con Prisma.
- Mantén mensajes de log prefijados y usa el handler global para respuestas de error.

## Ejemplos rápidos
- Crear usuario: [src/controllers/auth.controller.js](../src/controllers/auth.controller.js) usa `prisma.user.create` y `bcrypt.hash`.
- Tareas: [src/routes/task.routes.js](../src/routes/task.routes.js) aplica `authMiddleware` y delega a [src/controllers/task.controller.js](../src/controllers/task.controller.js).
- Flujo de test: [tests/tasks.test.js](../tests/tasks.test.js) registra, loguea y usa token en `/tasks`.

Si necesitas otro nivel de detalle o reglas más estrictas, pídelo y se ajusta.
