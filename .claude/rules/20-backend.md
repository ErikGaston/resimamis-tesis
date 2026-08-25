---
paths:
  - "resimamis/**"
---

# 20 — Backend (ASP.NET Core .NET 8)

`resimamis/` es un **repositorio Git independiente** (`github.com/maurogab2018/resimamis`),
ignorado por el repo del frontend. Actualizar con `cd resimamis && git pull`.

| Área | Tecnología |
|------|------------|
| Framework | ASP.NET Core Web API (.NET 8) |
| ORM | EF Core 8 + Npgsql 8 |
| BD | PostgreSQL (Render en producción) |
| Auth | JWT Bearer |
| Passwords | BCrypt.Net-Next |
| Docs | Swagger — expuesto en **`/`** (`RoutePrefix = ""`) |
| Deploy | Docker + Render (`RENDER_DEPLOY.md`) |

## Capas

```
Controller → INeg* (Negocio) → I*Repositorio (Datos) → EF Core → PostgreSQL
```

**La inyección de dependencias está completa** (refactor de jun 2026). No quedan
`new ApplicationDbContext()` ni `new Neg*()` en repositorios ni servicios:

- `Datos/Interfaces/` — 15 interfaces `I*Repositorio`
- `Negocio/Interfaces/` — 17 interfaces `INeg*`
- `DependencyInjection/ServiceCollectionExtensions.cs` — todo `AddScoped`, más un
  `HttpClient` nombrado `"OpenAI"`. Se invoca con `builder.Services.AddResimamisServices()`.
- Los 15 controllers usan primary-constructor DI contra la interfaz.

`ApplicationDbContext` se registra con `AddDbContext` scoped y `CommandTimeout(120)`.
El constructor sin parámetros que queda en `ApplicationDbContext.cs` es legacy sin uso;
`ApplicationDbContextFactory` existe solo para `dotnet ef` en design-time.

> Deuda: `NegAsignacion` y `NegUsuarios` reciben además el `ApplicationDbContext` directo y
> hacen consultas ad-hoc, salteando el repositorio. `NegAsistente` hace
> `new OpenAiChatCompletions(...)` a mano en vez de resolverlo por DI.

## Convención de respuesta — NO hay campo `success`

`Entidades/ApiResponse.cs` es `{ data, message, errors }`. **El campo `success` no existe en
ningún lugar del backend.** El status HTTP es semántico; el front decide `try`/`catch` por el
status, no por un flag del body.

| Caso | Status | Body |
|------|--------|------|
| Éxito | 200 | `{ "data": <payload> }` |
| Creado (`Created`, sin uso) | 201 | `{ "data": ... }` |
| `ApplicationException` / validación | 400 | `{ "message": "...", "errors": [...] }` |
| No autenticado (`OnChallenge`) | 401 | `{ "message": "No autenticado." }` |
| `ForbiddenException` | 403 | `{ "message": "No autorizado." }` |
| `NotFoundException` | 404 | `{ "message": "..." }` |
| `ConflictException` | 409 | `{ "message": "..." }` |
| `Exception` genérica | 500 | `{ "message": "Error interno del servidor." }` — la excepción se descarta sin loguear |
| ModelState inválido | 400 | `{ "message": "Error de validación", "errors": [...] }` |

**Login es la excepción:** responde plano (`{ Token, Resultado, Voluntaria }`), sin envelope.

Helpers en `Controllers/ApiResults.cs`. Orden de `catch` en controllers:
Forbidden/Unauthorized → NotFound → Conflict → ApplicationException → Exception.

> `ConflictException` y `NotFoundException` **no** derivan de `ApplicationException`, así que
> un controller que solo capture `ApplicationException` + `Exception` convierte un 409/404 en
> 500 o 400. La cobertura hoy es despareja (ej. `AsistenciaController.GetAll()`).

JSON: `PropertyNamingPolicy = CamelCase`, `ReferenceHandler = IgnoreCycles`. Por eso el front
lee `p.activa ?? p.Activa`.

## Autorización — leer antes de asumir

`RolesVoluntaria.EsCoordinadora(idRol, nombreRol)` acepta `idRol == 3` **o** nombre en
`{Coordinadora, Administrativa, Administrador, Admin}` (case-insensitive).
`NegUsuarios.EsCoordinadoraPorDni` → `RequiereCoordinadora` → `ForbiddenException` → 403.

No se usa `[Authorize(Roles=...)]`. `[Authorize]` está a nivel clase en los 15 controllers
salvo `UsuarioController` (que lo pone por método para dejar `login` anónimo).
`[AllowAnonymous]` no se usa nunca.

**Solo 8 operaciones verifican el rol en el servidor:**

| Operación |
|-----------|
| `POST /Usuario`, `GET /Usuario`, `GET /Usuario/voluntarias-sin-usuario` |
| `PUT /Usuario/id/{id}`, `POST /Usuario/delete` |
| `GET /Usuario/id/{id}` (coordinadora **o** el propio usuario) |
| `GET /Asignacion/listarAsignacionesHoy` |
| `POST /Asistente/preguntar` |

**Todo lo demás solo pide un JWT válido.** No tienen chequeo de rol: las bajas lógicas de
madre/bebé/voluntaria/asistencia, `PUT`/`DELETE` de asignación, `resetearAbrazosColgados`,
los 16 endpoints de `Dashboard`, `POST /Insumo/avisoStockMinimo` y los ABM de
proveedores/salas/tareas. La restricción a coordinadora para esas acciones vive **solo en el
frontend**: cualquier voluntaria autenticada puede ejecutarlas llamando la API directamente.

> Al documentar un endpoint, distinguir "solo coordinadora" (lo aplica el servidor) de
> "la UI lo esconde" (no lo aplica nadie).

CORS: `AllowAnyOrigin + AllowAnyHeader + AllowAnyMethod`.

## Tabla ESTADO + AMBITO

Una sola tabla `ESTADO` con `idAmbito` da estados por entidad.
`EstadoRepositorio.ObtenerIdEstadoPorNombreYAmbito(nombre, ambito)` los resuelve en runtime y
**lanza `ApplicationException` si la fila no existe**.

Ámbitos: `Bebes`, `Voluntarias`, `Madres`, `Insumos`, `Asistencias`, `Asignaciones`, `Usuarios`
(catálogo de valores en `01-negocio.md`).

### Estados de asignación

| Punto | Transición |
|-------|-----------|
| `iniciarAbrazo` | → **Iniciado** + `fechaHoraInicio`; voluntaria → *Abrazando*; bebé → *Abrazado*. 409 si ya inició |
| `finalizarAbrazo` | → **Finalizado** + `fechaHoraFin`; voluntaria → *Activa*; bebé → *Sin abrazar*. 400 si nunca inició, 409 si ya finalizó |
| `resetearAbrazosColgados` | → **Finalizado**, en transacción explícita |
| `PUT /Asignacion/id/{id}` | estado **derivado de las fechas** |

`PUT /Asignacion/id/{id}` recibe `RespuestaAsignaciones` (el DTO de respuesta) como request,
**ignora el `estadoAsignacion` del body** y es un **reemplazo completo, no un merge**: omitir
un campo nullable lo deja en null.

`resetearAbrazosColgados` solo cierra asignaciones **con bebé**, iniciadas antes del inicio del
día argentino y sin fin. Prependea un comentario automático de forma idempotente. Las tareas de
catálogo colgadas no se resetean.

> **Bug abierto y bloqueante:** ninguna migración siembra `Iniciado` ni `Finalizado` en ESTADO
> para el ámbito `Asignaciones` — `SeedEstadosAsignaciones` solo inserta `Creada` y `Eliminado`,
> y el commit que introdujo los estados nuevos no trajo migración. En una base migrada desde
> cero, `iniciarAbrazo`, `finalizarAbrazo`, `resetearAbrazosColgados`, el `PUT` de asignación y
> `GET /Bebe/disponibles-abrazo` devuelven 400. Ver `docs/deuda-tecnica.md`.

## Baja lógica universal

Nada se borra físicamente. `POST /api/X/delete?idX=N` setea `idEstado` al "Eliminado" del
ámbito. Proveedores, salas y visitas usan un flag `Activa`. Bebés: cargar `FechaSalida` dispara
la baja lógica automáticamente.

Los únicos `DELETE` reales son `DELETE /Asignacion/id/{id}` y
`DELETE /Horario/voluntaria/{id}`.

## Migraciones (14)

```bash
cd resimamis
dotnet ef migrations add NombreMigracion
dotnet ef database update
```

Últimas: `SeedEstadosAsignaciones` (jun), `InsumoDescripcionOpcional`, `BebeIdLocalidad`,
`VoluntariaHorarioActiva`, `ProveedorActiva`, `SalaActiva` (jun), **`BebeFechaSalida`** (jul).

Todas las posteriores a `Visita` están escritas como **SQL crudo idempotente**
(`IF NOT EXISTS` / bloques `DO $$`), seguras de re-ejecutar.

## Asistente IA

`AsistenteController` → `NegAsistente` → `OpenAiChatCompletions`.

- Proveedor **OpenAI Chat Completions**, modelo `Asistente:Model` (default `gpt-4o-mini`),
  `MaxTokens 1500`, `Temperature 0.2`, `HttpClient` nombrado `"OpenAI"` (timeout 90 s).
- API key, en orden: `Asistente:ApiKey` → `apiKey` (config) → env `apiKey` → env `OPENAI_API_KEY`.
- `POST /Asistente/preguntar` exige coordinadora; **`GET /Asistente/estado` no valida rol**.
- Límites: pregunta ≤ 2000 chars, historial ≤ 20 mensajes, ≤ 8 vueltas de tool-calling; a la
  novena hace una llamada sin tools para forzar texto.
- **19 herramientas, todas de solo lectura.** Defaults: reportes de período 30 días, rankings
  365 días (y reintento ampliando a 365 si el ranking vuelve vacío).
- El prompt separa explícitamente *asistencia/fichaje* de *abrazo*, y cada resultado lleva
  `criterio` + `aclaracion` para que el modelo no mezcle rankings.

## Dashboard

`NegDashboard` es un passthrough delgado; la lógica vive en `DashboardRepositorio` (~690
líneas). DTOs en `Entidades/DashboardEstadisticas.cs` (24 clases).

Filtros base: asignaciones activas = `idEstado != Eliminado`; bebés activos =
`FechaSalida == null` **y** estado ≠ Eliminado.

Fechas: acepta `fechaDesde`/`fechaHasta` **o** `fechaInicio`/`fechaFin`, en `yyyy-MM-dd` o
`dd/MM/yyyy`. Rango máximo 731 días.

`evolucion-peso` mapea `PesoEgreso` desde **`PesoAlta`**; solo cuenta bebés con ambos pesos.

## Envío de mail

`NegEnvioMail` usa `System.Net.Mail.SmtpClient` (SMTP genérico, cuerpo HTML).
`EstaConfigurado()` exige `Email:Enabled` + `Smtp:Host` + `Email:From` + user + password.

Dos disparadores: automático tras `registrarMovimientoInsumos` (dentro de un `try/catch`
**vacío** — si el mail falla, el movimiento no se afecta pero el error se pierde) y manual vía
`POST /Insumo/avisoStockMinimo`.

Criterio: `stockActual <= stockMinimo`. Destinatarios: `Email:AvisoStockMinimo:Destinatarios`;
si está vacío, cae a los mails de las coordinadoras. **Siempre responde 200**: los modos de
falla se codifican en `mensaje` + `correoEnviado`.

## Arranque y configuración

`Program.cs`: `EnableLegacyTimestampBehavior` → timeouts (120 s request/DB/Kestrel) → `PORT`
→ `AddDbContext` → `AddResimamisServices()` → Swagger → JSON camelCase →
`InvalidModelStateResponseFactory` → `Starup.ConfigureServicies` (CORS + JWT) → migraciones al
arranque salvo `RUN_MIGRATIONS_ON_STARTUP == "false"` → `UseExceptionHandler` → Swagger en `/`.

`Starup.cs` (sic, sin la `t`): CORS abierto; JWT con `ValidateIssuer/Audience = false`,
**`ValidateLifetime` comentado** y **clave simétrica hardcodeada**, duplicada en
`NegUsuarios.GenerateJwtToken`.

### Variables de entorno

| Variable | Uso |
|----------|-----|
| `PORT` | Puerto Kestrel (Render) |
| `DATABASE_URL` | Connection string `postgres://` → se normaliza a formato Npgsql |
| `DefaultConnection` | Alternativa en formato Npgsql |
| `ASPNETCORE_ENVIRONMENT` | Selección de `appsettings.{env}.json` |
| `RUN_MIGRATIONS_ON_STARTUP` | `"false"` omite `Migrate()` al arrancar |
| `apiKey` / `OPENAI_API_KEY` | Clave del asistente IA |
| `EMAIL_SMTP_USER` / `EMAIL_SMTP_PASSWORD` | Credenciales SMTP |

En Render las claves jerárquicas van con doble guión bajo: `Email__Enabled`,
`Email__Smtp__Host`, `Asistente__Enabled`, `Asistente__Model`,
`Email__AvisoStockMinimo__Destinatarios__0`.

Claves de `appsettings.json`: `ConnectionStrings`, `Logging`, `Database:CommandTimeoutSeconds`,
`RequestTimeouts:DefaultSeconds`, `Kestrel:Limits:*`, `Email:*`, `Asistente:Enabled|Model`.
`Asistente:Enabled` viene en `true`; `Email:Enabled` en `false`.

> No agregar credenciales en claro: `appsettings.json` ya tiene las de PostgreSQL commiteadas
> (en producción las pisa `DATABASE_URL`). El hook `repo-guard` bloquea escrituras en
> `appsettings*.json`.
