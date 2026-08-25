---
paths:
  - "src/redux/api/**"
  - "src/redux/sagas/**"
  - "resimamis/Controllers/**"
---

# 30 — Contrato de API

**La fuente de verdad es el código del backend**, en `resimamis/Controllers/*.cs` y
`resimamis/Entidades/`. No asumir a partir de lo que ya está en `src/redux/api/index.js`:
buena parte del front se escribió contra un contrato viejo.

Ya no se versiona un export de Swagger. Para explorar el contrato en vivo está
`https://resimamis.onrender.com/` (Swagger UI en la raíz, cold start de ~2 min).
La skill **`sync-api-contract`** automatiza el diff backend↔frontend.

## Convenciones

- Backend: `[Route("api/[controller]")]` → rutas `api/Asignacion/...`, `api/Bebe/...`.
  Frontend: rutas **relativas sin `/api/`** y en minúsculas (`/asignacion/...`), porque el
  prefijo ya viene en `VITE_URL_API`.
- Auth: `Authorization: Bearer <token>`.
- Respuesta: **no hay campo `success`**. Éxito → `{ data }` (200). Error →
  `{ message, errors }` con status semántico. **Login responde plano, sin envelope.**
- JSON en **camelCase** aunque el C# esté en PascalCase → usar `p.activa ?? p.Activa`.
- Por `[ApiController]`, un `int` fuera del template de ruta se bindea del **query string**:
  las bajas son `POST /x/delete?idX=N` con **body vacío**.

## Endpoints consumidos por el frontend

`src/redux/api/index.js` concentra las 86 funciones HTTP. Mapeo función → saga:

| Dominio | Funciones | Saga |
|---------|-----------|------|
| Usuario | `postLogin`, `postUsuario`, `getUsuarios`, `getUsuarioById`, `putUsuarioById`, `postUsuarioDelete`, `putUsuarioContrasena`, `getVoluntariasSinUsuario` | `userSaga` |
| Genéricos | `getLocalities`, `getEstadosCiviles` | `genericsSaga` |
| Madre | `postMother`, `getMother`, `getMotherId`, `putMother`, `getStatisticsLocalities`, `getStatisticsAgeMother`, `postMotherDelete` | `motherSaga` |
| Voluntaria + Asistencia | `postVolunteer`, `putVolunteer`, `getVolunteers`, `getVolunteersFree`, `getVolunteersStates`, `getVolunteerById`, `postVolunteerDelete`, `postAssistance`, `postAssistanceSalida`, `getAssistance`, `getAssistanceToday`, `getAssistanceHistoricas`, `getAssistanceReporte`, `getAsistenciasAll`, `postAssistanceDelete` | `volunteerSaga` |
| Bebé | `postBaby`, `putBaby`, `getBabys`, `getBabysFree`, `getBabysDisponiblesAbrazo`, `getBabySalas`, `getBabyByDni`, `postBabyDelete` | `babySaga` |
| Asignación | `postAssignmentGenerateLegacy`, `postAssignmentGenerateTareas`, `postAssignmentGenerateTarea`, `getAssignmentById`, `postDetailAssignment`, `postStartHug`, `postEndHug`, `getDurationHug`, `getAssignmentToday`, `getAssignmentTodayById`, `getStatisticsAssignmentMonth`, `putAssignmentById`, `deleteAssignmentById`, `postResetAbrazosColgados` | `assignmentSaga` |
| Insumos | `getSupplies`, `postSupplyCreate`, `getStatisticsSupplies`, `postSupplyConsultMovements`, `getSupplyProviders`, `postSupplyRegisterMovement`, `getSupplyById`, `putSupplyById`, `postSupplyDelete` | `supplySaga` |
| Horario | `getHorarioDias`, `postHorario`, `putHorario` | `horarioSaga` |
| Tarea | `getTareas`, `getTareasDisponibles`, `getTareaById`, `postTarea`, `putTareaById`, `postTareaDelete` | `tareaSaga` ⚠️ ninguna se consume desde la UI |
| Visita | `getVisitas`, `getVisitasByBebe`, `getVisitaById`, `postVisita`, `putVisitaById`, `postVisitaDelete` | `visitaSaga` |
| Proveedor | `getProveedoresAll`, `postProveedor`, `putProveedor`, `postProveedorDelete` | `proveedorSaga` |
| Sala | `getSalasAll`, `postSala`, `putSala`, `postSalaDelete` | `salaSaga` |

## Contratos con forma no obvia

| Endpoint | Detalle |
|----------|---------|
| `POST usuario/login/` | Body `{ dni: Number, contrasena }`. **Respuesta plana** `{ Token, Resultado, Voluntaria }` |
| `POST /asignacion/finalizarAbrazo/` | Body `{ idAsignacion, comentario }`; `comentario` acepta `null`. Nunca en la URL |
| `POST /asignacion/registrarDetalleAsignacion/` | Body **array** `[{ idAsignacion, idInsumo, cantidadInsumo }]`. Los tres campos deben ser `> 0`: filtrar antes de enviar |
| `POST /asignacion/generarTarea` / `generarTareas` | `idTarea`/`idTareas` son **IDs de BEBE**, no de TAREA |
| `POST /asignacion/generarTareaCatalogo` / `generarTareasCatalogo` | Ahí sí son **IDs de TAREA** |
| `PUT /asignacion/id/{id}/` | Recibe el DTO de respuesta; **ignora `estadoAsignacion`** (lo deriva de las fechas) y es **reemplazo completo, no merge** |
| `PUT /bebe/` | El id va **en el body**, no en la ruta |
| `GET /bebe/id/{dni}` | El parámetro se llama `Dni` pero se usa como **ID** |
| `GET /bebe/disponibles-abrazo` | Alias de `/bebe/abrazar`. La respuesta tiene varias formas: normalizar con `listBabysFromAbrazarResponse` |
| `POST /insumo/registrarMovimiento` | **`esEntrada` es string `"S"` / `"N"`, no boolean.** `normalizeEsEntradaForApi` ya lo resuelve |
| `POST /insumo/consultaMovimientos` | Lectura vía POST, body `{ fechaDesde?, fechaHasta? }` |
| `GET /asistencia/reporte` | Query `fechaInicio` + `fechaFin` |
| Bajas lógicas | `POST /x/delete?idX=N`, **body vacío** |

## Backend expuesto pero NO consumido por el frontend

El backend tiene ~100 endpoints y el front usa unos 50. Familias enteras sin integrar:

| Familia | Estado |
|---------|--------|
| `api/Dashboard/*` (16 endpoints) | Sin consumir. Resumen, coordinación del día, cobertura, bebés por estado/sala/edad/permanencia, evolución de peso, ranking de voluntarias, historial por bebé y por voluntaria |
| `api/Asistente/*` (2) | Sin consumir. Asistente IA para coordinadora |
| `GET /Bebe/estados`, `PUT /Bebe/id/{id}/estado` | Sin consumir |
| `GET /Asignacion/abrazosHistoricos/{idBebe}` | Sin consumir |
| `GET /Insumo/bajoStockMinimo`, `POST /Insumo/avisoStockMinimo`, `GET /Insumo/movimiento/id/{id}` | Sin consumir |
| `GET /Horario/voluntaria/{id}`, `DELETE /Horario/voluntaria/{id}` | Sin consumir |
| `GET /Proveedor/activos`, `GET /Sala/activas` | Sin consumir (el front usa los listados completos) |
| `api/Tarea/*` (6) | Cableado en Redux pero **ninguna página lo despacha** |

Detalle en `docs/cobertura-api.md`.

## Autorización: lo que la UI esconde ≠ lo que el servidor protege

Solo 8 operaciones validan rol en el backend (las de `api/Usuario`,
`GET /Asignacion/listarAsignacionesHoy` y `POST /Asistente/preguntar`). Todo lo demás —
bajas lógicas, `PUT`/`DELETE` de asignación, `resetearAbrazosColgados`, todo el dashboard,
ABM de proveedores/salas/tareas — **solo pide un JWT válido**.

Al documentar un endpoint, no marcarlo "solo coordinadora" salvo que el servidor lo verifique.
Ver `20-backend.md`.
