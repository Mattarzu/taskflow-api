# TaskFlow API

API REST de gestión de tareas construida con Node.js, Express, Prisma y PostgreSQL. Incluye autenticación JWT, validación robusta de inputs, rate limiting y seguridad en capas.

Perfecta como ejemplo de backend **production-ready** con buenas prácticas de seguridad, testing y deployment.

## 🏗️ Tech Stack

- **Runtime:** Node.js 22 (ESM)
- **Framework:** Express 4.19
- **ORM:** Prisma 6.19 (PostgreSQL)
- **Auth:** JWT (jsonwebtoken)
- **Seguridad:** helmet, cors, express-rate-limit
- **Testing:** Jest + Supertest
- **CI/CD:** GitHub Actions
- **Containerización:** Docker + Docker Compose

## ✨ Características

- ✅ **Autenticación JWT** con refresh token-ready
- ✅ **Rate limiting** en endpoints de auth (20 intentos/15min)
- ✅ **Validación de inputs** (email format, password strength)
- ✅ **Error handling centralizado** con respuestas consistentes
- ✅ **Healthcheck** (`GET /health`) para orquestadores
- ✅ **CORS, helmet** y `express.json` limit para hardening
- ✅ **Prisma single-source** de conexión a DB
- ✅ **Tests end-to-end** (auth + tasks)
- ✅ **Docker + non-root user** para producción
- ✅ **CI/CD automatizado** en GitHub Actions

## 🚀 Comenzar rápido

### Opción 1: Docker Compose (recomendado)

```bash
git clone <tu-repo>
cd taskflow
docker compose up
```

Levanta:
- Postgres 16 en `localhost:5432`
- API en `http://localhost:3000`
- Healthcheck automático

### Opción 2: Desarrollo local

**Prerrequisitos:** Node 22+, PostgreSQL 16+

```bash
# Clonar y entrar
git clone <tu-repo>
cd taskflow/server

# Variables de entorno
cat <<'EOF' > .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskflow?schema=public
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
EOF

# Dependencias
npm install

# Migrar DB
npx prisma migrate deploy

# Arrancar servidor (dev)
npm run dev
```

## 📋 API Endpoints

### Auth

**POST /auth/register**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```
Response: `{ "id": 1, "email": "user@example.com" }`

**POST /auth/login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```
Response: `{ "message": "Login exitoso", "token": "eyJhb...", "user": { "id": 1, "email": "...", "role": "USER" } }`

### Tasks (requiere `Authorization: Bearer <token>`)

**GET /tasks** — Listar tareas del usuario
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer eyJhb..."
```

**POST /tasks** — Crear tarea
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer eyJhb..." \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi nueva tarea"}'
```

**PATCH /tasks/:id** — Actualizar tarea
```bash
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Authorization: Bearer eyJhb..." \
  -H "Content-Type: application/json" \
  -d '{"completed":true,"title":"Tarea actualizada"}'
```

**DELETE /tasks/:id** — Eliminar tarea
```bash
curl -X DELETE http://localhost:3000/tasks/1 \
  -H "Authorization: Bearer eyJhb..."
```

### Health

**GET /health** — Verificar estado de la API
```bash
curl http://localhost:3000/health
# Response: { "status": "ok" }
```

## 🧪 Tests

```bash
cd server

# Crear .env.test
cat <<'EOF' > .env.test
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskflow_test?schema=public
JWT_SECRET=testsecret
EOF

# Instalar dependencias
npm install

# Correr tests (se crea BD efímera)
npm test
```

Tests incluyen:
- Registro e login
- Creación, lectura, actualización y eliminación de tareas
- Autenticación (JWT, token inválido, sin token)
- Validación de inputs
- Rate limiting

Salida esperada:
```
 PASS  tests/auth.test.js
 PASS  tests/tasks.test.js

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
```

## 🔒 Seguridad implementada

| Feature | Detalles |
|---------|----------|
| **JWT Auth** | Token con expiración 1 día; se valida en `Authorization: Bearer <token>` |
| **Hashing** | Contraseñas hasheadas con bcrypt (salt rounds: 10) |
| **Rate Limit** | 20 intentos / 15 min en `/auth/register` y `/auth/login` |
| **Validación** | Email formato básico, password 6-100 caracteres |
| **Helmet** | Headers de seguridad HTTP (CSP, X-Frame-Options, etc.) |
| **CORS** | Configurable via `CORS_ORIGIN` env; default `*` (cambiar en prod) |
| **Body Limit** | `express.json({ limit: "1mb" })` contra payloads gigantes |
| **Error Handling** | Handler global que no filtra stack traces en producción |
| **Env Validation** | Falla al arrancar si faltan `DATABASE_URL` o `JWT_SECRET` |
| **Graceful Shutdown** | Cierra servidor y Prisma cleanly en SIGTERM/SIGINT |

## � CI/CD (GitHub Actions)

En cada push a `main`/`master`:
1. Setup: Node 22, PostgreSQL 16 (servicio)
2. Dependencias: `npm ci` en `server/`
3. DB: Crea `.env.test`, corre migraciones
4. Tests: `npm test` (7 tests, ~2s)

Ver [.github/workflows/ci.yml](.github/workflows/ci.yml).

## 🌐 Deployment recomendado

**Render.com** o **Railway.app**: Conectar repo, setear Node + PostgreSQL, env vars (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`), deploy automático en cada push a `main`.

## 📚 Guía para AI

Ver [server/.github/copilot-instructions.md](server/.github/copilot-instructions.md) con patrones, estructura, comandos y buenas prácticas.

## 📝 Licencia

MIT

---

Hecho con ❤️ para portafolio backend.
