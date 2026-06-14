# 04 — Flujo Operativo — Resimamis

Cubre el flujo central del día: asistencia, asignaciones, abrazos, insumos y CoordinacionPage.

## 1. Asistencia (entrada/salida)

- **Registrar entrada:** `POST /asistencia/entrada/{IdVoluntaria}` → saga `postAssistance`.
- **Registrar salida:** `POST /asistencia/salida/{IdVoluntaria}` → saga `postAssistanceSalida`.
- **Consulta individual:** `GET /asistencia/id/{id}` → `getAssistance`.
- **Asistencias de hoy (global):** `GET /asistencia/hoy` → `getAssistanceToday`.
- **Históricas de una voluntaria:** `GET /asistencia/historicas/{id}` → `getAssistanceHistoricas`.
- **Reporte por período (coordinadora):** `GET /asistencia/reporte?fechaInicio=&fechaFin=` → `getAssistanceReporte`.
- **Baja lógica (coordinadora):** `POST /asistencia/delete` (query `idAsistencia`).

Estado en `volunteerReducer`: `asistencia`, `asistenciaToday`, `asistenciaHistoricas`, `asistenciaReporte`.

## 2. Asignaciones

### Generar (coordinadora)

**Masivo** (`assignmentTask` organism): seleccionar N voluntarias libres + N bebés disponibles:
```js
// src/redux/api/index.js → postAssignmentGenerateTareas
POST /asignacion/generarTareas/
Body: { idVoluntarias: int[], idTareas: int[] }
// idTareas usa idTarea del bebé si existe; sino idBebe/id (ver assignmentSelection.js)
```

**Rápido** (1+1):
```js
POST /asignacion/generarTarea
Body: { idVoluntaria: int, idTarea: int }
```

**Legacy (sin body):**
```js
POST /asignacion/generar/   // postAssignmentGenerateLegacy — sin body
```

### Consultar y listar

| Función | Path | Notas |
|---------|------|-------|
| `getAssignmentToday` | `GET /asignacion/listarAsignacionesHoy/` | Todas las asignaciones del día |
| `getAssignmentTodayById` | `GET /asignacion/listarAsignacionesHoyVoluntaria/{id}` | Por voluntaria |
| `getAssignmentById` | `GET /asignacion/consultar/{idAsignacion}` | Consulta individual |
| `getStatisticsAssignmentMonth` | `GET /asignacion/listarCantidadAsignacionesPorDia/` | Estadística mensual |
| `getDurationHug` | `GET /asignacion/duracionAbrazos/` | Estadística duración |

### Editar/eliminar (coordinadora)

```js
PUT  /asignacion/id/{idAsignacion}/   // putAssignmentById — CoordinacionPage
DELETE /asignacion/id/{idAsignacion}/ // deleteAssignmentById — CoordinacionPage
```

## 3. Abrazo (iniciar / finalizar)

### Iniciar

```js
POST /asignacion/iniciarAbrazo/{idAsignacion}
// Sin body. El backend marca fechaHoraInicio.
// Función: postStartHug — assignmentSaga
```

### Finalizar

El Swagger define el contrato exacto:
```js
POST /asignacion/finalizarAbrazo/
Body: { idAsignacion: number, comentario: string | null }
// Función: postEndHug — assignmentSaga
// TasksPage despacha: postEndHug({ idAsignacion, comentario })
```
El comentario va **solo en el body**, no en la URL. Formas como `.../finalizarAbrazo/141/comentario` son incorrectas.

### Resetear abrazos colgados (coordinadora)

```js
POST /asignacion/resetearAbrazosColgados   // Sin body
// Cierra asignaciones iniciadas en días anteriores sin finalizar
// Función: postResetAbrazosColgados — assignmentSaga
```

## 4. Detalle de asignación (insumos usados)

El Swagger define:
```js
POST /asignacion/registrarDetalleAsignacion/
Body: [{ idAsignacion: int, idInsumo: int, cantidadInsumo: int }]  // array
// Función: postDetailAssignment — assignmentSaga
// Acepta un objeto solo o un array; se normaliza a array antes de enviar
```
Los segmentos de URL tipo `.../registrarDetalleAsignacion/142/1/2` son incorrectos según el contrato OpenAPI.

## 5. Normalización de bebés (`utils/assignmentSelection.js`)

La respuesta de `GET /bebe/disponibles-abrazo` (o fallback `/bebe/abrazar`) puede tener varias formas:

```js
listBabysFromAbrazarResponse(response)
// Normaliza: listadoBebes / listadoBebesAbrazar / bebesParaAbrazar / bebes / resultado / array directo
```

`resolveIdTareaForGenerarTareas(bebe)`: extrae `idTarea` del bebé para el body de `generarTareas`.

La saga `babySaga` intenta primero `getBabysDisponiblesAbrazo` (`/bebe/disponibles-abrazo`) y hace fallback a `getBabysFree` (`/bebe/abrazar`) si falla.

## 6. Algoritmo de asignación automática (backend)

`NegAsignacion.generarAsiganaciones()` en el backend:
1. Carga bebés con estado "Sin abrazar" que no fueron abrazados hoy.
2. Carga voluntarias con entrada registrada hoy, no en estado "Inactiva"/"Licencia"/"Carpeta médica".
3. Tres casos según cardinalidad bebes vs voluntarias: igual / bebes > voluntarias / bebes < voluntarias.
4. Criterio de desempate: menor cantidad de asignaciones hoy → menor cantidad en el mes → aleatoriedad.
5. Todo dentro de una transacción EF Core.

## 7. CoordinacionPage (`/coordinacion`)

Solo accesible a coordinadoras (`isCoordinadoraSession()`). Pestañas:

| Pestaña | Funcionalidades |
|---------|----------------|
| Asignación | PUT/DELETE asignación por id, resetear abrazos colgados |
| Asistencia | Reporte por fechas (`getAssistanceReporte`), baja por id |
| Usuarios | Listar (`GET /usuario`), crear (`POST /usuario`), GET/PUT/DELETE por id |
| Bajas | Baja por id: madre (`postMotherDelete`), voluntaria (`postVolunteerDelete`), bebé (`postBabyDelete`) |
| Insumos | GET/PUT/DELETE insumo por id desde panel técnico |

## 8. Insumos — pantalla `/insumos`

| Función | Path |
|---------|------|
| `getSupplies` | `GET /insumo` |
| `postSupplyCreate` | `POST /insumo` (body schema INSUMO) |
| `getStatisticsSupplies` | `GET /insumo/estadisticaInsumoCantidad` |
| `postSupplyConsultMovements` | `POST /insumo/consultaMovimientos` body `{ fechaDesde?, fechaHasta? }` |
| `getSupplyProviders` | `GET /insumo/proveedores` |
| `postSupplyRegisterMovement` | `POST /insumo/registrarMovimiento` body MOVIMIENTOSTOCK |
| `getSupplyById` | `GET /insumo/id/{id}` |
| `putSupplyById` | `PUT /insumo/id/{id}/` |
| `postSupplyDelete` | `POST /insumo/delete` |

`normalizeEsEntradaForApi()` en `utils/supplyMovementPayload.js` convierte el string del formulario (`"entrada"`/`"salida"`) a boolean antes de enviar.
