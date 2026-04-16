# Cobertura OpenAPI (Swagger) vs frontend

Documento de inventario y brechas: operaciones del contrato OpenAPI frente a `src/redux/api/index.js`, sagas, pantallas, validación y seguridad.

**Fuente del contrato:** `swagger/v1/swagger.json` del servidor (referencia en repo: `swagger-detail.json`). Validar paths reales con `VITE_URL_API` (prefijo `/api`, mayúsculas, etc.).

**Leyenda**

| Marca | Significado |
|-------|-------------|
| **SI** | Implementado en `redux/api` y usado en flujo (saga/página). |
| **PARCIAL** | Función en API o incompleto: sin saga, sin UI, o path distinto al Swagger. |
| **NO** | No hay función en `redux/api/index.js`. |

---

## Resumen ejecutivo — prioridades

| Prioridad | Enfoque | Estado (abr2026) |
|-----------|---------|---------------------|
| **P0** | Paths críticos + body login OpenAPI (`dni`, `contrasena`). | Hecho: `getBabysFree` → `/bebe/abrazar`; `postLogin` normaliza body; `getVolunteerById` sin `//`. |
| **P0** | **Backend:** roles, JWT refresh, autorización. | Sigue siendo **servidor**; el front solo Bearer. |
| **P1** | **Asistencia:** `salida`, `hoy`, `historicas`. | API + sagas; Tareas → Actividades: salida; `hoy` / histórico en **`AssistanceDataDialog`**: tabla (voluntaria, DNI, ingreso, salida). Histórico con `voluntaria: null`: nombre/DNI vía `volunteerFallback` (`localStorage`). Respuestas no tabulares: JSON en caja. |
| **P1** | **Bebé `PUT`:** `putBaby`. | API + saga + UI edición en perfil madre / acordeón bebé. |
| **P2** | **Insumos:** movimientos, proveedores, registrar movimiento. | Misma pestaña: formulario **`registrarMovimiento`**; listado resumen + JSON; FAB «+» en lista pasa a **Movimientos** y hace scroll al formulario (antes `Link` a `/insumos` no hacía nada). |
| **P2** | **Asignación:** `consultar/{id}`, `generarTarea`. | `TasksPage`: detalle por ícono en tarjeta; bloque «Asignación rápida» (`generarTarea`). |
| **P3** | **Horario**, **Usuario POST**, **Voluntaria delete**. | Sin integrar en front. |
| **P3** | **Bebe** `listarSalas`, `GET id/{Dni}`. | Perfil madre: salas en formulario bebé; búsqueda por DNI. |
| **P3** | **`getDurationHug` + UI.** | Saga + entrada en **Estadísticas** (vista JSON de la respuesta). |

---

## Rutas UI actuales (`RouterApp.jsx`)

| Ruta | Página | APIs principales |
|------|--------|-------------------|
| `/`, `home`, `overview` | `HomePage` | `getVolunteersFree`, asistencia |
| `/login` | `LoginPage` | `postLogin` |
| `/madres` | `ListMotherPage` | `getMother` |
| `/madre` | `MotherPage` | `postMother`, `postBaby`, `getLocalities` |
| `/madre/perfil/:id` | `ProfileMotherPage` | `getMotherId`, `putMother` |
| `/voluntaria` | `VolunteerPage` | `postVolunteer` |
| `/voluntaria/perfil/:id` | `ProfileVolunteerPage` | `getVolunteerById`, `putVolunteer` |
| `/voluntarias` | `ListVolunteerPage` | `getVolunteers` |
| `/bebes` | `ListBabysPage` | `getBabys`; tarjetas con **DNI** (`CardBaby`) |
| `/tareas` | `TasksPage` | asignaciones, abrazos, detalle insumos |
| `/estadisticas` | `StatisticsPage` | estadísticas madre, asignación, insumo |
| `/insumos` | `SupplyPage` | `getSupplies`, estadística cantidad |

**Vistas que faltan** (si se cubren todos los endpoints): horarios voluntaria; alta usuario; baja voluntaria; otras pantallas no listadas en `RouterApp`.

---

## Matriz Asignacion

| Metodo | Path OpenAPI | Front | Vista / saga |
|--------|--------------|-------|--------------|
| GET | `/api/Asignacion/listarAsignacionesHoy` | **SI** `getAssignmentToday` | `TasksPage`, `assignmentSaga` |
| GET | `/api/Asignacion/consultar/{idAsignacion}` | **SI** `getAssignmentById` | `TasksPage` → ícono en tarjeta; mismo diálogo (**JSON** si no matchea forma de asistencia) |
| GET | `/api/Asignacion/listarCantidadAsignacionesPorDia` | **SI** `getStatisticsAssignmentMonth` | `StatisticsPage` |
| GET | `/api/Asignacion/duracionAbrazos` | **SI** `getDurationHug` | `assignmentSaga` + **Estadísticas** (respuesta JSON) |
| GET | `/api/Asignacion/listarAsignacionesHoyVoluntaria/{idVoluntaria}` | **SI** `getAssignmentTodayById` | `TasksPage` |
| POST | `/api/Asignacion/registrarDetalleAsignacion` | **SI** `postDetailAssignment` | `TasksPage` |
| POST | `/api/Asignacion/generar` | **SI** `postAssignmentGenerateLegacy` | Legacy (`redux/api`); no usado desde flujo de tareas |
| POST | `/api/Asignacion/generarTarea` | **SI** `postAssignmentGenerateTarea` | `TasksPage` → «Asignación rápida»; lote sigue con `generarTareas` |
| POST | `/api/Asignacion/generarTareas` | **SI** `postAssignmentGenerateTareas` | `TasksPage` |
| POST | `/api/Asignacion/iniciarAbrazo/{idAsignacion}` | **SI** `postStartHug` | `TasksPage` |
| POST | `/api/Asignacion/finalizarAbrazo` | **SI** `postEndHug` | `TasksPage` |

---

## Matriz Asistencia

| Metodo | Path OpenAPI | Front | Vista / saga |
|--------|--------------|-------|--------------|
| GET | `/api/Asistencia/id/{IdVoluntaria}` | **SI** `getAssistance` | Home |
| GET | `/api/Asistencia/hoy` | **SI** `getAssistanceToday` | `TasksPage` → enlace + **`AssistanceDataDialog`** (tabla o JSON fallback) |
| GET | `/api/Asistencia/historicas/{IdVoluntaria}` | **SI** `getAssistanceHistoricas` | Idem; normalización camel/Pascal y `volunteerFallback` si `voluntaria` viene null |
| POST | `/api/Asistencia/entrada/{IdVoluntaria}` | **SI** `postAssistance` | Home |
| POST | `/api/Asistencia/salida/{IdVoluntaria}` | **SI** `postAssistanceSalida` | Tareas → Actividades |

---

## Matriz Bebe

| Metodo | Path OpenAPI | Front | Vista / saga |
|--------|--------------|-------|--------------|
| GET | `/api/Bebe` | **SI** `getBabys` | `ListBabysPage` |
| POST | `/api/Bebe` | **SI** `postBaby` | `MotherPage` |
| PUT | `/api/Bebe` | **SI** `putBaby` | `ProfileMotherPage` (edición bebé) |
| GET | `/api/Bebe/listarSalas` | **SI** `getBabySalas` | `ProfileMotherPage` |
| GET | `/api/Bebe/id/{Dni}` | **SI** `getBabyByDni` | `ProfileMotherPage` |
| GET | `/api/Bebe/abrazar` | **SI** `getBabysFree` | Path `/bebe/abrazar` |

---

## Matriz Genericos

| Metodo | Path OpenAPI | Front | Notas |
|--------|--------------|-------|--------|
| GET | `/api/Genericos/localidades` | **SI** `getLocalities` | Swagger: query opcional `Dni`; front no la envía |

---

## Matriz Horario

| Metodo | Path OpenAPI | Front | Vista |
|--------|--------------|-------|--------|
| GET | `/api/Horario/dias` | **NO** | — |
| POST | `/api/Horario` | **NO** | Body: arreglo `HorarioVoluntaria` |

---

## Matriz Insumo

| Metodo | Path OpenAPI | Front | Vista |
|--------|--------------|-------|--------|
| GET | `/api/Insumo` | **SI** `getSupplies` | `SupplyPage`, `TasksPage` |
| POST | `/api/Insumo/consultaMovimientos` | **SI** `postSupplyConsultMovements` | Insumos → Movimientos (últimos 30 días) |
| GET | `/api/Insumo/proveedores` | **SI** `getSupplyProviders` | Carga con pestaña Movimientos |
| GET | `/api/Insumo/estadisticaInsumoCantidad` | **SI** `getStatisticsSupplies` | `StatisticsPage` |
| POST | `/api/Insumo/registrarMovimiento` | **SI** `postSupplyRegisterMovement` | Formulario en `SupplyTemplate` (pestaña Movimientos) |

---

## Matriz Madre

| Metodo | Path OpenAPI | Front | Vista |
|--------|--------------|-------|--------|
| GET | `/api/Madre` | **SI** `getMother` | Listados / formularios |
| POST | `/api/Madre` | **SI** `postMother` | `MotherPage` |
| GET | `/api/Madre/estadisticaLocalidades` | **SI** `getStatisticsLocalities` | `StatisticsPage` |
| GET | `/api/Madre/id/{Id}` | **SI** `getMotherId` | `ProfileMotherPage` |
| PUT | `/api/Madre/id/{Id}` | **SI** `putMother` | `ProfileMotherPage` |
| GET | `/api/Madre/estadisticaEdadesMadre` | **SI** `getStatisticsAgeMother` | `StatisticsPage` |

---

## Matriz Usuario

| Metodo | Path OpenAPI | Front | Vista |
|--------|--------------|-------|--------|
| POST | `/api/Usuario` | **NO** | Alta `USUARIO` (segun backend) |
| POST | `/api/Usuario/login` | **SI** `postLogin` | `LoginPage` |

---

## Matriz Voluntaria

| Metodo | Path OpenAPI | Front | Notas |
|--------|--------------|-------|--------|
| GET | `/api/Voluntaria` | **SI** `getVolunteers` | `ListVolunteerPage` |
| POST | `/api/Voluntaria` | **SI** `postVolunteer` | `VolunteerPage` |
| GET | `/api/Voluntaria/libres` | **SI** `getVolunteersFree` | `HomePage` |
| GET | `/api/Voluntaria/estados` | **SI** `getVolunteersStates` | Filtros / listados |
| GET | `/api/Voluntaria/id/{Id}` | **SI** `getVolunteerById` | Path `/voluntaria/id/{id}` |
| PUT | `/api/Voluntaria/id/{Id}` | **SI** `putVolunteer` | `ProfileVolunteerPage` |
| POST | `/api/Voluntaria/delete` | **NO** | Query `idVoluntaria`; suele ser admin |

---

## Validacion en frontend

| Area | Estado | Referencia |
|------|--------|------------|
| Madre alta / edicion | Centralizada al guardar | `motherFormValidation.js`, `MotherForm` |
| Voluntaria | Perfil: duplicado DNI excluye id correcto; nacimiento opcional en perfil si API no lo manda; fechas inicio sin ventana «alta»; `normalizeVolunteerPayload` unifica `id`→`idVoluntaria` | `volunteerFormValidation.js`, `ProfileVolunteerPage`, `ProfileForm` |
| Bebe | Revisar vs `BEBE` | Formulario alta en flujo madre |
| Login | Basica en UI | `LoginTemplate` |
| Tareas / asignacion | Reglas en componentes | `TasksPage`, organismos de tarea |
| Errores API post-envio | Toasts en sagas | `docs/tareas-validacion-madre.md` |

Objetivo: cada POST/PUT alineado con schemas OpenAPI y respuestas 400/422 del servidor.

---

## Seguridad

| Tema | Actual | Accion recomendada |
|------|--------|-------------------|
| Token | JWT en `localStorage`; Bearer en interceptor | Valorar httpOnly cookies; mitigar XSS |
| Rutas | `PrivateRoute` solo comprueba token | RBAC en backend; front no expone roles |
| 401 | Limpia storage y va a `/login` | Evaluar refresh token si el API lo ofrece |
| Operaciones sensibles | delete voluntaria, movimientos | Solo usuarios autorizados en **servidor** |
| Transporte | — | HTTPS en produccion para `VITE_URL_API` |

Implementar todos los endpoints en el cliente **no** reemplaza validacion ni autorizacion en el backend.

---

## Conteo

- **Operaciones HTTP en Swagger (paths de este JSON):** del orden de 40 (incluye varios verbos por recurso).
- **Exports en `redux/api/index.js`:** ~40 funciones (tras cierre de brechas P1–P3 listadas arriba).
- **Brechas frecuentes:** horario (2), usuario POST (1), voluntaria delete (1); **confirmar con backend** valores de `esEntrada` en `registrarMovimiento` (`S`/`N` vs otro contrato).

---

## Registro de avances (abr-2026)

| Área | Qué se hizo |
|------|-------------|
| Tareas / asistencia | Tabla en `AssistanceDataDialog`; extracción flexible de arrays; histórico sin objeto anidado cubierto con sesión. |
| Tareas / asignación | Detalle consultar + asignación rápida `generarTarea` (sesiones previas en repo). |
| Bebés | DNI visible en listado (`CardBaby`); búsqueda considera `Dni`/`dni`. |
| Voluntaria perfil | Edición sin falso duplicado de DNI; PUT con `idVoluntaria`; validación perfil vs alta. |
| Insumos | FAB «+» navega a registro de movimiento (scroll). |

| Pendiente / siguiente iteración | Notas |
|----------------------------------|--------|
| UI detalle asignación | Hoy cae en JSON del diálogo; opcional: tarjeta/tabla según schema real de `consultar`. |
| `esEntrada` movimientos | Probar contra API; ajustar formulario si el servidor espera boolean u otro string. |
| Horario / Usuario POST / Delete voluntaria | Sigue **NO** en matriz; definir prioridad con negocio. |
| Swagger | Re-exportar `swagger/v1/swagger.json` y diff vs `swagger-detail.json`. |

---

## Mantenimiento

1. Integrar endpoint en `redux/api/index.js` (validar Swagger desplegado).
2. Saga, actions, reducer si aplica.
3. Ruta en `RouterApp.jsx` si hay UX nueva.
4. Actualizar `.cursor/rules/04-endpoints-backend.mdc` y `03-contratos-frontend-y-lineamientos.mdc`.
5. Actualizar este archivo y `docs/pendientes.md`.

---

*Inventario estatico: contrastar siempre con `swagger/v1/swagger.json` del entorno activo.*
