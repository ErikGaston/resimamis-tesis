# 06 — Endpoints API — Resimamis

**Base URL:** `import.meta.env.VITE_URL_API`. El backend expone todo bajo `/api/[Controller]` pero el front usa paths relativos sin el prefijo `/api/` (el prefijo ya está incluido en `VITE_URL_API` o en la base del backend).

**Auth:** `Authorization: Bearer <localStorage['token']>` (JWT).

**Respuesta típica:** `{ success: true, data: <payload>, message: null }` (errores: HTTP 200 con `success: false`). Login es respuesta plana sin envelope.

**Swagger canónico:** `https://resimamis.onrender.com/` (cold start posible en Render). Export offline: `swagger-detail.json` en la raíz del repo. Consultar siempre antes de implementar/modificar integración HTTP.

---

## Usuario

| Método | Path | Auth | Función API | Notas |
|--------|------|------|-------------|-------|
| POST | `usuario/login/` | — | `postLogin` | Body: `{ dni, contrasena }`. Respuesta plana con `token` + datos voluntaria. |
| GET | `/usuario` | Sí | `getUsuarios` | Solo coordinadora. Lista usuarios activos. |
| POST | `/usuario` | Sí | `postUsuario` | Solo coordinadora. Crear usuario (asociado a voluntaria). |
| GET | `/usuario/id/{id}` | Sí | `getUsuarioById` | — |
| PUT | `/usuario/id/{id}/` | Sí | `putUsuarioById` | Solo coordinadora. |
| POST | `/usuario/delete` | Sí | `postUsuarioDelete` | Query `idUsuario`. Baja lógica. |
| GET | `/usuario/voluntarias-sin-usuario` | Sí | — | Voluntarias sin usuario asignado. |

---

## Genéricos

| Método | Path | Función API |
|--------|------|-------------|
| GET | `/genericos/localidades` | `getLocalities` |

---

## Voluntaria

| Método | Path | Función API | Notas |
|--------|------|-------------|-------|
| POST | `/voluntaria/` | `postVolunteer` | Alta |
| GET | `/voluntaria/` | `getVolunteers` | Listado |
| GET | `/voluntaria/libres/` | `getVolunteersFree` | Voluntarias presentes hoy y disponibles (home) |
| GET | `/voluntaria/estados/` | `getVolunteersStates` | Catálogo de estados |
| GET | `/voluntaria/id/{id}` | `getVolunteerById` | URL: `/voluntaria/id/:id` (sin doble slash) |
| PUT | `/voluntaria/id/{id}/` | `putVolunteer` | Body incluye `idVoluntaria` |
| POST | `/voluntaria/delete` | `postVolunteerDelete` | Query `idVoluntaria`. Coordinadora. |

### Asistencia (bajo `volunteerSaga`)

| Método | Path | Función API | Notas |
|--------|------|-------------|-------|
| POST | `/asistencia/entrada/{id}` | `postAssistance` | Registrar entrada |
| POST | `/asistencia/salida/{id}` | `postAssistanceSalida` | Registrar salida |
| GET | `/asistencia/id/{id}` | `getAssistance` | Asistencias de una voluntaria |
| GET | `/asistencia/hoy` | `getAssistanceToday` | Todas las asistencias del día |
| GET | `/asistencia/historicas/{id}` | `getAssistanceHistoricas` | Historial de una voluntaria |
| GET | `/asistencia/reporte` | `getAssistanceReporte` | Query `fechaInicio`, `fechaFin`. Coordinadora. |
| POST | `/asistencia/delete` | `postAssistanceDelete` | Query `idAsistencia`. Coordinadora. |

---

## Madre

| Método | Path | Función API | Notas |
|--------|------|-------------|-------|
| POST | `/madre/` | `postMother` | Body: MADRE |
| GET | `/madre/` | `getMother` | Listado |
| GET | `/madre/id/{id}` | `getMotherId` | — |
| PUT | `/madre/id/{idMadre}/` | `putMother` | — |
| GET | `/madre/estadisticaLocalidades` | `getStatisticsLocalities` | Distribución por localidad |
| GET | `/madre/estadisticaEdadesMadre` | `getStatisticsAgeMother` | Estadística de edades |
| POST | `/madre/delete` | `postMotherDelete` | Query `idMadre`. Coordinadora. |

**Body POST/PUT (MADRE):** `{ nombre, apellido, dni, fechaNacimiento, localidad (int), motivoAbrazo, celular, cantidadHijos, estadoCivil (1-6) }`. Campo auxiliar `nombre_localidad` se elimina en `utils/babyPayload.js` antes de enviar.

---

## Bebé

| Método | Path | Función API | Notas |
|--------|------|-------------|-------|
| POST | `/bebe/` | `postBaby` | — |
| PUT | `/bebe/` | `putBaby` | Body: BEBE |
| GET | `/bebe/` | `getBabys` | Listado |
| GET | `/bebe/disponibles-abrazo` | `getBabysDisponiblesAbrazo` | Bebés disponibles hoy (preferido) |
| GET | `/bebe/abrazar` | `getBabysFree` | Fallback si `/disponibles-abrazo` falla |
| GET | `/bebe/listarSalas` | `getBabySalas` | Catálogo de salas NEO |
| GET | `/bebe/id/{dni}` | `getBabyByDni` | Consulta por DNI. Coordinadora. |
| POST | `/bebe/delete` | `postBabyDelete` | Query `idBebe`. Coordinadora. |

---

## Asignación y abrazos

| Método | Path | Función API | Notas |
|--------|------|-------------|-------|
| POST | `/asignacion/generar/` | `postAssignmentGenerateLegacy` | Sin body (legacy) |
| POST | `/asignacion/generarTareas/` | `postAssignmentGenerateTareas` | Body: `{ idVoluntarias: int[], idTareas: int[] }` |
| POST | `/asignacion/generarTarea` | `postAssignmentGenerateTarea` | Body: `{ idVoluntaria, idTarea }` |
| GET | `/asignacion/consultar/{id}` | `getAssignmentById` | Consulta individual |
| POST | `/asignacion/registrarDetalleAsignacion/` | `postDetailAssignment` | Body: `[{ idAsignacion, idInsumo, cantidadInsumo }]` (array) |
| POST | `/asignacion/iniciarAbrazo/{id}` | `postStartHug` | Sin body |
| POST | `/asignacion/finalizarAbrazo/` | `postEndHug` | Body: `{ idAsignacion, comentario }` |
| GET | `/asignacion/duracionAbrazos/` | `getDurationHug` | Estadística duración |
| GET | `/asignacion/listarAsignacionesHoy/` | `getAssignmentToday` | Todas las asignaciones del día |
| GET | `/asignacion/listarAsignacionesHoyVoluntaria/{id}` | `getAssignmentTodayById` | Por voluntaria |
| GET | `/asignacion/listarCantidadAsignacionesPorDia/` | `getStatisticsAssignmentMonth` | Estadística mensual |
| PUT | `/asignacion/id/{id}/` | `putAssignmentById` | Body: ASIGNACION. Coordinadora. |
| DELETE | `/asignacion/id/{id}/` | `deleteAssignmentById` | Coordinadora. |
| POST | `/asignacion/resetearAbrazosColgados` | `postResetAbrazosColgados` | Sin body. Coordinadora. |

---

## Insumos

| Método | Path | Función API | Notas |
|--------|------|-------------|-------|
| GET | `/insumo` | `getSupplies` | Listado activos |
| POST | `/insumo` | `postSupplyCreate` | Body: schema INSUMO |
| GET | `/insumo/estadisticaInsumoCantidad` | `getStatisticsSupplies` | — |
| POST | `/insumo/consultaMovimientos` | `postSupplyConsultMovements` | Body: `{ fechaDesde?, fechaHasta? }` |
| GET | `/insumo/proveedores` | `getSupplyProviders` | — |
| POST | `/insumo/registrarMovimiento` | `postSupplyRegisterMovement` | Body: MOVIMIENTOSTOCK |
| GET | `/insumo/id/{id}` | `getSupplyById` | — |
| PUT | `/insumo/id/{id}/` | `putSupplyById` | — |
| POST | `/insumo/delete` | `postSupplyDelete` | Query `idInsumo` |

---

## Horario y Tareas

| Método | Path | Función API |
|--------|------|-------------|
| GET | `/horario/dias` | `getHorarioDias` |
| POST | `/horario` | `postHorario` |
| GET | `/tarea/` | `getTareas` |
| GET | `/tarea/disponibles` | `getTareasDisponibles` |

---

## Visitas (nuevo desde jun 2026)

| Método | Path | Notas |
|--------|------|-------|
| GET | `/visita/` | Listado activas |
| GET | `/visita/bebe/{idBebe}` | Visitas de un bebé |
| GET | `/visita/id/{id}` | — |
| POST | `/visita/` | Registrar visita |
| PUT | `/visita/id/{id}/` | Modificar |
| POST | `/visita/delete` | Baja lógica |

---

## Mapeo función API → saga

| Función `src/redux/api/index.js` | Saga |
|---|---|
| `postLogin`, `postUsuario`, `getUsuarioById`, `putUsuarioById`, `postUsuarioDelete` | `userSaga` |
| `getLocalities` | `genericsSaga` |
| `postMother`, `getMother`, `getMotherId`, `putMother`, `getStatisticsLocalities`, `getStatisticsAgeMother`, `postMotherDelete` | `motherSaga` |
| `postVolunteer`, `putVolunteer`, `getVolunteers`, `getVolunteersFree`, `getVolunteersStates`, `getVolunteerById`, `postVolunteerDelete`, `postAssistance`, `postAssistanceSalida`, `getAssistance`, `getAssistanceToday`, `getAssistanceHistoricas`, `getAssistanceReporte`, `postAssistanceDelete` | `volunteerSaga` |
| `postBaby`, `putBaby`, `getBabys`, `getBabysFree`, `getBabysDisponiblesAbrazo`, `getBabySalas`, `getBabyByDni`, `postBabyDelete` | `babySaga` |
| `postAssignmentGenerateTareas`, `postAssignmentGenerateTarea`, `getAssignmentById`, `postDetailAssignment`, `postStartHug`, `postEndHug`, `getDurationHug`, `getAssignmentToday`, `getAssignmentTodayById`, `getStatisticsAssignmentMonth`, `putAssignmentById`, `deleteAssignmentById`, `postResetAbrazosColgados` | `assignmentSaga` |
| `getSupplies`, `postSupplyCreate`, `getStatisticsSupplies`, `postSupplyConsultMovements`, `getSupplyProviders`, `postSupplyRegisterMovement`, `getSupplyById`, `putSupplyById`, `postSupplyDelete` | `supplySaga` |
| `getHorarioDias`, `postHorario` | `horarioSaga` |
