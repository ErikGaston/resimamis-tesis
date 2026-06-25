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

### Finalizar — `InformationHug` (Dialog 100dvh)

`InformationHug` es un **Dialog full-screen** (no reemplaza la pantalla). Se monta siempre en `TasksTemplate` y se controla con `open={changeInformationHug}`. `ActivityTask` permanece renderizado debajo.

Props: `open`, `onClose`, `model`, `setModel`, `submitEndHug`, `hug`, `stateInsumo`, `setStateInsumo`, `changeStateInsumo`, `listSupplies`, `setListSupplies`, `submitChangeSupplies`.

El backend recibe:
```js
POST /asignacion/finalizarAbrazo/
Body: { idAsignacion: number, comentario: string | null }
// Función: postEndHug — assignmentSaga
```
El comentario va **solo en el body**, nunca en la URL.

### Resetear abrazos colgados (coordinadora)

```js
POST /asignacion/resetearAbrazosColgados   // Sin body
// Cierra asignaciones iniciadas en días anteriores sin finalizar
// Función: postResetAbrazosColgados — assignmentSaga
```

## 4. Detalle de asignación (insumos usados)

```js
POST /asignacion/registrarDetalleAsignacion/
Body: [{ idAsignacion: int, idInsumo: int, cantidadInsumo: int }]  // array
// Función: postDetailAssignment — assignmentSaga
```

**Patrón `submitChangeSupplies` (TasksPage)** — siempre filtrar antes de enviar:
```js
const submitChangeSupplies = (list, idAsignacion) => {
    if (!idAsignacion) { dispatch(showToast({...})); return; }
    const activeItems = (list ?? []).filter(item => Number(item?.cantidad) > 0);
    if (!activeItems.length) { dispatch(showToast({...})); return; }
    const payload = activeItems.map(item => ({
        idAsignacion: Number(idAsignacion),
        idInsumo: item.idInsumo,
        cantidadInsumo: Number(item.cantidad),
    }));
    dispatch(postDetailAssignment(payload));
}
```
Nunca enviar items con `cantidadInsumo = 0` — el backend los omite pero sí valida que `idAsignacion` exista para los ítems con cantidad > 0.

## 4b. CardBabyHug — diseño actual

`CardBabyHug` recibe solo `item` (objeto de `getAssignmentTodayById`) — **no acepta props `name` ni `hall`**. Lee directamente: `item.nombreBebe`, `item.nombreSala`, `item.estadoAsignacion`, `item.fechaHoraInicio`, `item.fechaHoraFin`, `item.comentario`.

Color del header por estado:
```js
const HEADER_CFG = {
    Creada:     { gradient: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)' },
    Iniciado:   { gradient: 'linear-gradient(90deg, #E65100 0%, #FF6D00 100%)' },
    Finalizado: { gradient: 'linear-gradient(90deg, #00875A 0%, #00A86B 100%)' },
};
```

Acciones inline por estado:
- `Creada` → botón "Iniciar abrazo" (gradiente violeta, `submitStartHug(item.idAsignacion)`)
- `Iniciado` → botón "Finalizar / Registrar insumos" (outlined naranja, `editHug(item)`)
- `Finalizado` → ícono CheckCircle verde, sin botón

`ActivityTask` muestra **todas** las asignaciones del día (no filtra por `fechaHoraFin === null`). Solo muestra la sección "Abrazos del día" si la voluntaria tiene entrada registrada (`check`).

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

Solo accesible a coordinadoras (`isCoordinadoraSession()`). 6 pestañas:

| Pestaña | Funcionalidades |
|---------|----------------|
| Asignación | PUT/DELETE asignación por id, resetear abrazos colgados, chips de estado (Creada/En curso/Finalizado) |
| Asistencia | Reporte por fechas (`getAssistanceReporte`), listado todas las asistencias (`getAsistenciasAll`), baja por id |
| Usuarios | Listar (`getUsuarios`), crear (`postUsuario`), GET/PUT/DELETE por id, `getVoluntariasSinUsuario` |
| Bajas | Baja por id: madre (`postMotherDelete`), voluntaria (`postVolunteerDelete`), bebé (`postBabyDelete`) |
| Proveedores | CRUD proveedores — `getProveedoresAll`, `postProveedor`, `putProveedor`, `postProveedorDelete` |
| Salas | CRUD salas NEO — `getSalasAll`, `postSala`, `putSala`, `postSalaDelete` |

**Notas de implementación CoordinacionPage:**
- `(p.activa ?? p.Activa)` — backend devuelve `"activa"` (lowercase ASP.NET serialización), no `"Activa"`. Usar fallback para compatibilidad.
- Todos los dialogs bottom-sheet: `PaperProps.sx` con `maxHeight: '90dvh', display: 'flex', flexDirection: 'column'`; DialogContent con `overflowY: 'auto'`.
- `DialogContent sx={{ pt: 2.5 }}` — no usar `pt: 1` (8px) porque MUI clip-path corta las floating labels de outlined TextFields.
- Dialogs de detalle (asignación, usuarios): full-screen 100dvh con `DIALOG_FULL_SX`.

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
