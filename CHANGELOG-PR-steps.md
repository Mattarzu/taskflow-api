# Registro de cambios incrementales

## Paso 1: Hardening de runtime (completado)
- Middlewares de seguridad/observabilidad: `helmet`, `cors` (origen configurable), `express.json` con límite de 1mb, `morgan` (silenciado en test).
- Endpoint `/health` y healthcheck de contenedor en Dockerfile.
- Manejo global de errores en `server/src/middlewares/error.middleware.js`.
- Validación de variables requeridas (`DATABASE_URL`, `JWT_SECRET`) al arranque; shutdown ordenado cerrando servidor y Prisma.
- Nuevas dependencias: `helmet`, `cors`, `morgan` en `server/package.json`.
- Instrucciones de AI actualizadas en `server/.github/copilot-instructions.md` para reflejar lo anterior.

## Paso 2: Seguridad de autenticación (completado)
- Rate limiting en endpoints `/auth` con `authRateLimiter` (20 intentos / 15m) para frenar fuerza bruta.
- Validación de payload de auth (email formato básico, password 6-100 chars) en middleware dedicado.
- Rutas `/auth/register` y `/auth/login` aplican ambos middlewares antes de los controladores.

## Paso 3: Prisma single-source (completado)
- `server/prisma/client.js` queda como única instancia de Prisma.
- `src/config/db.js` y `src/config/prisma.js` ahora reexportan ese cliente único (evita conexiones duplicadas).
- `src/controllers/auth.controller.js` usa la instancia compartida.

## Paso 4: Docker hardening (completado)
- `server/Dockerfile` usa usuario no-root `app` y copia artefactos con ownership adecuado.
- `docker-compose.yml` define envs explícitas (DATABASE_URL apuntando a `db`, JWT_SECRET placeholder, PORT) además de `env_file`.

## Paso 5: CI de tests (completado)
- Workflow GitHub Actions en `.github/workflows/ci.yml`: levanta Postgres 16, crea `.env.test`, ejecuta `npm ci`, `prisma migrate deploy` y `npm test` en `server/`.

## Próximos pasos futuros (sugeridos)
- Unificar cliente Prisma en un solo módulo.
- Hardening Docker adicional (usuario no-root), ajustes de compose.
- Scripts CI/lint/tests y DB de prueba efímera.