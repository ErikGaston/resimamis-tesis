# 05 — Backend — Resimamis

Backend en `resimamis/`. ASP.NET Core Web API + .NET 8 + EF Core + PostgreSQL.

## Stack

| Área | Tecnología |
|------|------------|
| Framework | ASP.NET Core Web API (.NET 8) |
| ORM | Entity Framework Core 8 (Npgsql 8) |
| Base de datos | PostgreSQL (Render en producción) |
| Auth | JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer` 6.0) |
| Passwords | BCrypt.Net-Next 4.0.3 |
| API Docs | Swagger (Swashbuckle 6.8) — accesible en `/` sin auth |
| Deploy | Docker + Render (ver `resimamis/RENDER_DEPLOY.md`) |

## Arquitectura: 3 capas

```
Controller → Negocio (servicios Neg*) → Repositorio (*Repositorio) → EF Core → PostgreSQL
```

- **`Controllers/`**: `ControllerBase`, `[ApiController]`, `[Route("api/[controller]")]`. Solo reciben HTTP y delegan a Negocio.
- **`Negocio/`**: Clases `Neg*`. Toda la lógica de negocio: validaciones, algoritmo de asignación, conversión de fechas. `NegConversorFecha`: timezone Argentina (UTC-3) para calcular rangos del día en UTC.
- **`Datos/`**: Clases `*Repositorio` + `ApplicationDbContext`. Cada repositorio instancia su propio `DbContext` con `new` (sin DI propia).

## Convención de respuesta HTTP

Envelope estándar siempre presente (éxito y error):

```js
{ "success": true,  "data": <payload>, "message": null,        "errors": [] }
{ "success": false, "data": null,      "message": "El DNI…",   "errors": ["El DNI…"] }
```

| Caso | HTTP status | `success` |
|------|-------------|-----------|
| Éxito (GET/PUT) | 200 | `true` |
| Creación | 201 | `true` |
| Error de negocio / validación cliente | 400 | `false` |
| No autenticado | 401 | `false` |
| No encontrado | 404 | `false` |
| Error interno del servidor | 500 | `false` |

Helpers en `Controllers/ApiResults.cs`:
- `ApiResults.Success(data)` → 200
- `ApiResults.Created(data)` → 201
- `ApiResults.BadRequest(message, errors?)` → 400
- `ApiResults.NotFound(message)` → 404
- `ApiResults.Unauthorized(message?)` → 401
- `ApiResults.InternalServerError(message?)` → 500
- `ApiResults.ValidationError(errors)` → 400 (mismo que BadRequest)

Patrón en controllers: `ApplicationException` → `BadRequest` (400). `Exception` genérica → `InternalServerError` (500). ModelState inválido → `InvalidModelStateResponseFactory` → 400.

El front lee el HTTP status para saber si la saga va al `try` o al `catch`, y luego `response.data.message` para el mensaje de error.

## Autenticación backend

- **Login:** `POST /api/Usuario/login` recibe `{ Dni: int, Contrasena: string }`.
- `NegUsuarios.Loguear`: busca usuario por DNI, verifica con `BCrypt.Verify`, genera JWT con claim `ClaimTypes.NameIdentifier = Dni` y `ClaimTypes.Name = Dni`.
- **Header requerido:** `Authorization: Bearer <token>`.
- **Expiración:** 30 días. `ValidateLifetime` está comentado — los tokens no expiran técnicamente (deuda técnica).
- **CORS:** `AllowAnyOrigin + AllowAnyHeader + AllowAnyMethod`.

**Autorización por rol:** no usa `[Authorize(Roles=...)]`. Las operaciones restringidas llaman a `NegUsuarios.EsAdministrativaPorDni(dni)` → `RequiereAdministrativa(dniSolicitante)` que lanza `ApplicationException` si no es Administrativa. El controller captura y retorna `BadRequest`.

## Tabla ESTADO + AMBITO (polimorfismo de estados)

Una sola tabla `ESTADO` con campo `idAmbito` permite estados por tipo de entidad.

| Ámbito | Estados conocidos |
|--------|-------------------|
| `Bebes` | Sin abrazar, Asignado, Abrazado, Eliminado |
| `Voluntarias` | Activa, Asignada, Abrazando, Ayudando, Inactiva, Licencia, Carpeta médica, Eliminado |
| `Madres` | Activa, Eliminado |
| `Insumos` | Activo, Eliminado |
| `Asistencias` | Activa, Eliminado |
| `Asignaciones` | Creada, Eliminado |
| `Usuarios` | Activo, Eliminado |

`EstadoRepositorio.ObtenerIdEstadoPorNombreYAmbito(nombre, ambito)` resuelve IDs en tiempo de ejecución.

## Baja lógica universal

Ninguna entidad se borra físicamente. El endpoint `POST /api/X/delete` setea `idEstado` al ID del estado "Eliminado" del ámbito correspondiente. Siempre respetar este patrón al trabajar en el backend.

## EF Core Migrations (PostgreSQL)

```bash
# Desde resimamis/
dotnet ef migrations add NombreMigracion
dotnet ef database update
```

Migraciones actuales:
| Migración | Contenido |
|-----------|-----------|
| `InitialPostgres` (2026-03-31) | Esquema completo inicial |
| `MadreIdEstadoEliminadoEstados` (2026-05-05) | `IdEstado` a MADRE |
| `InsumoIdEstado` (2026-05-05) | `idEstado` a INSUMO |
| `AsistenciaIdEstado` (2026-05-05) | `idEstado` a ASISTENCIA |
| `UsuarioIdEstado` (2026-05-05) | `idEstado` a USUARIO |
| `TareaEsUnica` (2026-06-13) | `esUnica` a TAREA |
| `Visita` (2026-06-13) | Tabla VISITA con FK a BEBE |

## Variables de entorno backend

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string PostgreSQL formato `postgres://...` (Render la inyecta; se convierte automáticamente a formato Npgsql) |
| `DefaultConnection` | Alternativa en formato Npgsql directo |
| `PORT` | Puerto Kestrel (Render lo define) |
| `RUN_MIGRATIONS_ON_STARTUP` | `"false"` para saltear `db.Database.Migrate()` al arrancar |

> **Deuda:** `appsettings.json` y `appsettings.Development.json` tienen las credenciales de la BD de Render hardcodeadas. En producción se sobreescriben por `DATABASE_URL`. No agregar nuevas credenciales en claro.

## Deudas técnicas del backend

- **JWT hardcodeado:** clave secreta duplicada en `Starup.cs` y `NegUsuarios.cs`. Mover a variable de entorno.
- **Sin DI propia:** cada repositorio instancia su propio `ApplicationDbContext` con `new`. Múltiples conexiones por request.
- **`ValidateLifetime` comentado:** tokens no expiran técnicamente.
- **`SaveChangesAsync()` sin `await`** en varios repositorios: potencial error silencioso.
- **Typo en `Starup.cs`** (le falta la `t`): no es un error, es el nombre del archivo heredado.

## Deploy (Render + Docker)

Ver `resimamis/RENDER_DEPLOY.md`. La imagen Docker se construye con `Dockerfile` en `resimamis/`. `Program.cs` lee la variable `PORT` de Render y llama a `UseUrls`. El Swagger está expuesto en `/` (raíz, sin auth) para facilitar la exploración de la API.
