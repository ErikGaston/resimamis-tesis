# Deuda técnica — Resimamis

Inventario consolidado de frontend y backend, priorizado por impacto.
**Última revisión:** 2026-08-24 (frontend en `fa61730`, backend en `4684eea`).

Al saldar un ítem, borrar la fila o moverla a "Resuelto" con fecha.

---

## P0 — Bloqueante

### 1. Los estados `Iniciado` / `Finalizado` nunca se siembran en la tabla ESTADO

Ninguna migración ni script inserta esas dos filas para el ámbito `Asignaciones`.
`SeedEstadosAsignaciones` (14/06/2026) solo inserta `Creada` y `Eliminado`, y el commit que
introdujo los estados nuevos (`d7f9524`) no trajo migración.

`EstadoRepositorio.ObtenerIdEstadoPorNombreYAmbito` lanza `ApplicationException` si la fila no
existe, así que **en cualquier base migrada desde cero** devuelven 400:

- `POST /asignacion/iniciarAbrazo/{id}`
- `POST /asignacion/finalizarAbrazo/`
- `POST /asignacion/resetearAbrazosColgados`
- `PUT /asignacion/id/{id}/`
- `GET /bebe/disponibles-abrazo`

Es decir, **el flujo operativo completo del abrazo**. Que hoy funcione en producción implica
que alguien insertó las filas a mano; un deploy limpio o un entorno nuevo se rompe.

**Arreglo:** migración de seed idempotente, con el mismo patrón de
`SeedEstadosAsignaciones`, insertando `Iniciado` y `Finalizado` en el ámbito `Asignaciones`.

---

## P1 — Seguridad

### 2. `.env` está commiteado en el historial de git

`.env` figura en `git ls-files`. Ya se agregó a `.gitignore`, pero **eso no lo saca del
historial**: el valor sigue siendo recuperable en cualquier clon.

**Arreglo:** `git rm --cached .env`, commit, y **rotar cualquier credencial que contenga**.
Si se quiere borrar del historial, `git filter-repo` + force-push coordinado con el equipo.

### 3. Autorización por rol ausente en la mayoría de las operaciones sensibles

Solo 8 operaciones validan rol en el servidor (las de `api/Usuario`,
`GET /Asignacion/listarAsignacionesHoy`, `POST /Asistente/preguntar`).

**No están protegidas por rol**, pese a que la UI las esconde: bajas lógicas de
madre/bebé/voluntaria/asistencia, `PUT` y `DELETE` de asignación, `resetearAbrazosColgados`,
los 16 endpoints de `Dashboard`, `POST /Insumo/avisoStockMinimo`, y los ABM de
proveedores/salas/tareas. Cualquier voluntaria autenticada puede ejecutarlas llamando la API.

### 4. Clave de firma JWT hardcodeada y duplicada

Está en el código fuente, repetida en `Starup.cs` y en `NegUsuarios.GenerateJwtToken`.
Debe salir a variable de entorno y quedar en un solo lugar.

### 5. `ValidateLifetime` comentado

Los tokens declaran 30 días de expiración pero **no expiran nunca** en la práctica.

### 6. Credenciales de PostgreSQL commiteadas

En `appsettings.json` y `appsettings.Development.json`. En producción las pisa `DATABASE_URL`,
pero siguen siendo válidas y están en el repo.

### 7. CORS `AllowAnyOrigin`

Sobre una API con JWT en header. Restringir a los orígenes del frontend.

---

## P2 — Correctitud y calidad

### Backend

| Ítem | Detalle |
|------|---------|
| Capas incompletas | `NegAsignacion` y `NegUsuarios` reciben `ApplicationDbContext` directo además de sus repositorios, y hacen consultas ad-hoc salteando la capa de datos |
| DI incompleta | `NegAsistente` hace `new OpenAiChatCompletions(...)` a mano en vez de resolverlo por DI |
| `catch` desparejo | `ConflictException` y `NotFoundException` no derivan de `ApplicationException`; un controller que solo capture `ApplicationException` + `Exception` convierte un 409/404 en 500. Ej: `AsistenciaController.GetAll()` |
| Errores silenciados | El disparo automático del aviso de stock está dentro de un `try { } catch { }` **vacío**: el mail falla sin dejar rastro |
| 500 sin log | El handler de `Exception` genérica descarta la excepción sin loguearla |
| `MapControllers` duplicado | Se registra en `Startup.Configure` y otra vez en `Program.cs` |
| Parámetros fantasma | `GET /Genericos/localidades` declara un `int Dni` que no usa; `GET /Bebe/id/{Dni}` recibe en realidad el ID, no el DNI |
| Código muerto | El parámetro de rango de `listarCantidadAsignacionesPorDia` está comentado |

### Frontend

| Ítem | Detalle |
|------|---------|
| `redux` no declarado | `store/index.js` y `reducers/index.js` importan `redux` directamente, pero **no está en `package.json`**: funciona por hoisting transitivo de `react-redux`/`redux-saga`. Se rompe ante cualquier cambio de resolución |
| `faker@5.5.3` | Instalado sin uso, y es la versión saboteada de 2022. Desinstalar |
| Slice `tarea` muerto | Actions, saga, reducer y 6 endpoints cableados en el store y el `rootSaga`, pero **ninguna página los despacha** |
| `react-query` fantasma | Instalado; los imports siguen vivos en `main.jsx` (entran al bundle) pero el `QueryClientProvider` está comentado |
| Color inválido | `palette.primary.main = '#transparent'` en `helpers/theme.js` |
| Código muerto | `src/services/config.js` es residuo de otro proyecto e importa `../helpers/const` y `../helpers/urls`, **que no existen** |
| Componentes muertos | ~15 sin consumidores: 4 atoms, 4 molecules, 11 en `common/` (incluido un `Loading` duplicado del de `atoms/`) |
| Hooks muertos | `useStep`, `useResponsive`, `useNotify` — el directorio `hooks/` no tiene un solo consumidor |
| Sin 404 | No hay ruta catch-all `*`: una URL inválida renderiza `null` dentro del layout |
| `Footer` duplicado | Se importa en 10 páginas en vez de vivir en `AppScreenLayout` |
| Archivos gigantes | `CoordinacionPage.jsx` 1561 líneas, `SupplyTemplate.jsx` 1358 líneas |
| Dos lockfiles | Conviven `package-lock.json` y `yarn.lock`. Elegir uno |
| `dist/` versionado | Build commiteado en el árbol de trabajo |
| Tema legacy | ~160 líneas de overrides MUI v4 comentadas en `theme.js` |

---

## P3 — Infraestructura ausente

**No existe nada de esto, en ninguno de los dos repos:**

| Falta | Impacto |
|-------|---------|
| ESLint / Prettier / EditorConfig | Nada detecta automáticamente ninguno de los ítems P2 |
| Tests (Vitest, Jest, Playwright) | Cero archivos `*.test.*`. Cada release se valida a mano |
| CI (`.github/workflows`) | No hay build ni verificación automática en PR |
| TypeScript | `@types/react*` instalados sin efecto |
| Alias de imports (`jsconfig.json`) | Todos los imports son relativos (`../../../`) |

Orden sugerido si se ataca: ESLint (detecta código muerto y variables sin usar) → CI que
corra `npm run build` + lint → tests sobre `utils/` (validaciones y normalizadores, que son
funciones puras y de alto valor) → tests de integración de sagas.

---

## Integración pendiente entre front y back

El backend expone ~100 endpoints; el frontend consume ~50. Familias enteras sin UI:
`api/Dashboard` (16), `api/Asistente` (2), estados de bebé, historial de abrazos, avisos de
stock mínimo, ABM de tareas. Detalle en [`cobertura-api.md`](cobertura-api.md).
