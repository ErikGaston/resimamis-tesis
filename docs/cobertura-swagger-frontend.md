# Cobertura OpenAPI (Swagger) vs frontend

Inventario de **operaciones definidas en** `swagger-detail.json` (export del backend, en repo) frente a **`src/redux/api/index.js`**, sagas, acciones y pantallas.

**Convención:** en el cliente, el `AxiosInstance` suele usar `baseURL` = `VITE_URL_API` (p. ej. `.../api`); los paths en código van en **minúsculas** (`/asignacion/...`, `/bebe/...`). Swagger lista **`/api/Asignacion/...`** — misma ruta lógica, distinto casing según servidor.

**Leyenda**

| Marca | Significado |
|-------|-------------|
| **SI** | Hay función en `redux/api` **y** se usa en flujo (saga / página / efecto). |
| **PARCIAL** | Hay función en API o uso parcial: no hay operación equivalente en OpenAPI, legacy sin UI, o path alternativo documentado. |
| **NO** | No hay función en `redux/api` (o no hay uso). |

---

## Snapshot (mayo 2026)

| Métrica | Valor |
|---------|--------|
| Operaciones HTTP en `swagger-detail.json` | **59** |
| Funciones exportadas en `src/redux/api/index.js` | **~60** |
| Operaciones del contrato **sin** función en `redux/api` | **0** (salvo discrepancia documental POST raíz `/api/Insumo`) |

*Los números no tienen por qué coincidir uno a uno: una función puede cubrir varios casos de uso; además el front expone `postSupplyCreate` (POST catálogo) que **no** está documentado en `/api/Insumo` de este JSON.*

---

## Resumen ejecutivo

| Prioridad | Tema | Estado |
|-----------|------|--------|
| **P0** | Login (`RequestLogin`: `dni`, `contrasena`) + Bearer | **SI** — `postLogin` |
| **P0** | Flujo tareas / abrazos / insumos del día | **SI** — asignación + asistencia + insumos |
| **P1** | **Asignación:** PUT/DELETE por id; **resetear abrazos colgados** | **SI** — `CoordinacionPage` (solo coordinadora) + API/sagas |
| **P1** | **Asistencia:** reporte por rango; **delete** | **SI** — `getAssistanceReporte`, `postAssistanceDelete` en panel Coordinación |
| **P1** | **Bebé:** `GET id/{Dni}`; **`disponibles-abrazo`**; **delete** | **SI** — `getBabyByDni` + baja en `ListBabysPage`; `getBabysFree` intenta primero `disponibles-abrazo` y hace fallback a `abrazar` |
| **P2** | **Insumo:** `GET/PUT id`, **delete**; alta catálogo | **SI** en API; UI coordinación (JSON) + `SupplyPage` para alta; **POST `/api/Insumo`** puede seguir ausente en Swagger |
| **P2** | **Madre / Voluntaria / Usuario:** bajas y CRUD usuario | **SI** — listados (ícono baja coordinadora) + **`/coordinacion`** (formularios usuario y bajas por id) |
| **P3** | **Horario** | **SI** — `getHorarioDias` / `postHorario`; UI **`VolunteerHorarioSection`** en perfil voluntaria |
| **P3** | UI rica **consultar asignación** | **PARCIAL** — JSON en diálogo / panel avanzado opcional |

---

## Rutas UI (`RouterApp.jsx`)

| Ruta | Página | APIs principales |
|------|--------|------------------|
| `/`, `overview` (vía `RootRedirect`) | `HomePage` | `getVolunteersFree`, asistencia entrada |
| `login` | `LoginPage` | `postLogin` |
| `madres` | `ListMotherPage` | `getMother` |
| `madre` | `MotherPage` | `postMother`, `postBaby`, `getLocalities` |
| `/madre/perfil/:id` | `ProfileMotherPage` | `getMotherId`, `putMother`, `getMother`, `getLocalities`, `getBabySalas`, `putBaby` |
| `voluntaria` | `VolunteerPage` | `postVolunteer` |
| `/voluntaria/perfil/:id` | `ProfileVolunteerPage` | `getVolunteerById`, `putVolunteer`, `getHorarioDias`, `postHorario` |
| `voluntarias` | `ListVolunteerPage` | `getVolunteers`, `getVolunteersStates` |
| `bebes` | `ListBabysPage` | `getBabys`, `getBabyByDni`, `postBabyDelete` (coordinadora) |
| `tareas` | `TasksPage` | asignaciones, abrazos, detalle insumos, asistencia hoy/histórico, `getBabysFree` |
| `estadisticas` | `StatisticsPage` | madre, asignación, insumo |
| `insumos` | `SupplyPage` | catálogo, movimientos, proveedores, `postSupplyCreate` |
| `coordinacion` | `CoordinacionPage` | Panel coordinadora: asignación avanzada, asistencia reporte/baja, usuarios, bajas por id, insumo por id |

**Coordinadora:** acceso a **Tareas → Coordinación**, carrusel **Panel de trabajo → Coordinación**, y acciones destructivas en listados (madres, voluntarias, bebés). **Horarios** en **perfil voluntaria** (todas las que editen perfil).

---

## Matriz Asignacion

| Método | Path OpenAPI | Front (`redux/api`) | Vista / notas |
|--------|--------------|---------------------|----------------|
| GET | `/api/Asignacion/listarAsignacionesHoy` | **SI** `getAssignmentToday` | `TasksPage`, `assignmentSaga` |
| GET | `/api/Asignacion/consultar/{idAsignacion}` | **SI** `getAssignmentById` | `TasksPage` — diálogo (JSON si no matchea forma tabular) |
| GET | `/api/Asignacion/listarCantidadAsignacionesPorDia` | **SI** `getStatisticsAssignmentMonth` | `StatisticsPage` |
| GET | `/api/Asignacion/duracionAbrazos` | **SI** `getDurationHug` | `StatisticsPage` / saga |
| GET | `/api/Asignacion/listarAsignacionesHoyVoluntaria/{idVoluntaria}` | **SI** `getAssignmentTodayById` | `TasksPage` |
| POST | `/api/Asignacion/registrarDetalleAsignacion` | **SI** `postDetailAssignment` | `TasksPage` |
| POST | `/api/Asignacion/generar` | **SI** `postAssignmentGenerateLegacy` | API; flujo principal usa `generarTareas` |
| POST | `/api/Asignacion/generarTarea` | **SI** `postAssignmentGenerateTarea` | `TasksPage` — asignación rápida |
| POST | `/api/Asignacion/generarTareas` | **SI** `postAssignmentGenerateTareas` | `TasksPage` |
| POST | `/api/Asignacion/iniciarAbrazo/{idAsignacion}` | **SI** `postStartHug` | `TasksPage` |
| POST | `/api/Asignacion/finalizarAbrazo` | **SI** `postEndHug` | `TasksPage` |
| PUT | `/api/Asignacion/id/{idAsignacion}` | **SI** `putAssignmentById` | `CoordinacionPage` |
| DELETE | `/api/Asignacion/id/{idAsignacion}` | **SI** `deleteAssignmentById` | `CoordinacionPage` |
| POST | `/api/Asignacion/resetearAbrazosColgados` | **SI** `postResetAbrazosColgados` | `CoordinacionPage` |

---

## Matriz Asistencia

| Método | Path OpenAPI | Front | Vista / notas |
|--------|--------------|-------|----------------|
| GET | `/api/Asistencia/id/{IdVoluntaria}` | **SI** `getAssistance` | `HomePage` |
| GET | `/api/Asistencia/reporte` | **SI** `getAssistanceReporte` | `CoordinacionPage` |
| GET | `/api/Asistencia/hoy` | **SI** `getAssistanceToday` | `TasksPage` + `AssistanceDataDialog` |
| GET | `/api/Asistencia/historicas/{IdVoluntaria}` | **SI** `getAssistanceHistoricas` | Idem |
| POST | `/api/Asistencia/entrada/{IdVoluntaria}` | **SI** `postAssistance` | `HomePage` |
| POST | `/api/Asistencia/salida/{IdVoluntaria}` | **SI** `postAssistanceSalida` | `TasksPage` |
| POST | `/api/Asistencia/delete` | **SI** `postAssistanceDelete` | `CoordinacionPage` |

---

## Matriz Bebe

| Método | Path OpenAPI | Front | Vista / notas |
|--------|--------------|-------|----------------|
| GET | `/api/Bebe` | **SI** `getBabys` | `ListBabysPage` |
| POST | `/api/Bebe` | **SI** `postBaby` | `MotherPage` |
| PUT | `/api/Bebe` | **SI** `putBaby` | `ProfileMotherPage` |
| GET | `/api/Bebe/listarSalas` | **SI** `getBabySalas` | `ProfileMotherPage` |
| GET | `/api/Bebe/id/{Dni}` | **SI** `getBabyByDni` | `ListBabysPage` (coordinadora) |
| GET | `/api/Bebe/disponibles-abrazo` | **SI** `getBabysDisponiblesAbrazo` | `babySaga`: intenta este path y hace fallback a `abrazar` |
| GET | `/api/Bebe/abrazar` | **SI** `getBabysFree` | `TasksPage` |
| POST | `/api/Bebe/delete` | **SI** `postBabyDelete` | `ListBabysPage` + `CoordinacionPage` |

---

## Matriz Genericos

| Método | Path OpenAPI | Front | Notas |
|--------|--------------|-------|--------|
| GET | `/api/Genericos/localidades` | **SI** `getLocalities` | Query opcional `Dni` en Swagger — el front no la envía |

---

## Matriz Horario

| Método | Path OpenAPI | Front | Notas |
|--------|--------------|-------|--------|
| GET | `/api/Horario/dias` | **SI** `getHorarioDias` | `VolunteerHorarioSection` (perfil voluntaria) |
| POST | `/api/Horario` | **SI** `postHorario` | Idem |

---

## Matriz Insumo

| Método | Path OpenAPI | Front | Notas |
|--------|--------------|-------|--------|
| GET | `/api/Insumo` | **SI** `getSupplies` | `SupplyPage`, `TasksPage` |
| GET | `/api/Insumo/id/{idInsumo}` | **SI** `getSupplyById` | `CoordinacionPage` |
| PUT | `/api/Insumo/id/{idInsumo}` | **SI** `putSupplyById` | `CoordinacionPage` |
| POST | `/api/Insumo/delete` | **SI** `postSupplyDelete` | `CoordinacionPage` |
| POST | `/api/Insumo/consultaMovimientos` | **SI** `postSupplyConsultMovements` | `SupplyTemplate` |
| GET | `/api/Insumo/proveedores` | **SI** `getSupplyProviders` | Insumos |
| GET | `/api/Insumo/estadisticaInsumoCantidad` | **SI** `getStatisticsSupplies` | `StatisticsPage` |
| POST | `/api/Insumo/registrarMovimiento` | **SI** `postSupplyRegisterMovement` | `SupplyTemplate` |
| POST | `/api/Insumo` (raíz) | **PARCIAL** `postSupplyCreate` | **No** aparece `post` en `/api/Insumo` en este JSON; el front hace `POST` a `/insumo` — validar en despliegue (405 si el servidor no expone) |

---

## Matriz Madre

| Método | Path OpenAPI | Front | Vista |
|--------|--------------|-------|--------|
| GET | `/api/Madre` | **SI** `getMother` | Listados / validación duplicados |
| POST | `/api/Madre` | **SI** `postMother` | `MotherPage` |
| GET | `/api/Madre/estadisticaLocalidades` | **SI** `getStatisticsLocalities` | `StatisticsPage` |
| GET | `/api/Madre/id/{Id}` | **SI** `getMotherId` | `ProfileMotherPage` |
| PUT | `/api/Madre/id/{Id}` | **SI** `putMother` | `ProfileMotherPage` |
| GET | `/api/Madre/estadisticaEdadesMadre` | **SI** `getStatisticsAgeMother` | `StatisticsPage` |
| POST | `/api/Madre/delete` | **SI** `postMotherDelete` | `ListMotherPage` + `CoordinacionPage` |

---

## Matriz Usuario

| Método | Path OpenAPI | Front | Notas |
|--------|--------------|-------|--------|
| POST | `/api/Usuario` | **SI** `postUsuario` | `CoordinacionPage` |
| POST | `/api/Usuario/login` | **SI** `postLogin` | `LoginPage` — URL en código `usuario/login/` |
| GET | `/api/Usuario/id/{idUsuario}` | **SI** `getUsuarioById` | `CoordinacionPage` |
| PUT | `/api/Usuario/id/{idUsuario}` | **SI** `putUsuarioById` | `CoordinacionPage` |
| POST | `/api/Usuario/delete` | **SI** `postUsuarioDelete` | `CoordinacionPage` |

---

## Matriz Voluntaria

| Método | Path OpenAPI | Front | Notas |
|--------|--------------|-------|--------|
| GET | `/api/Voluntaria` | **SI** `getVolunteers` | `ListVolunteerPage` |
| POST | `/api/Voluntaria` | **SI** `postVolunteer` | `VolunteerPage` |
| GET | `/api/Voluntaria/libres` | **SI** `getVolunteersFree` | `HomePage` |
| GET | `/api/Voluntaria/estados` | **SI** `getVolunteersStates` | Filtros |
| GET | `/api/Voluntaria/id/{Id}` | **SI** `getVolunteerById` | `ProfileVolunteerPage` |
| PUT | `/api/Voluntaria/id/{Id}` | **SI** `putVolunteer` | `ProfileVolunteerPage` |
| POST | `/api/Voluntaria/delete` | **SI** `postVolunteerDelete` | `ListVolunteerPage` + `CoordinacionPage` |

---

## Brechas consolidadas

- **OpenAPI vs `redux/api`:** todas las operaciones listadas en **`swagger-detail.json`** tienen función equivalente en **`src/redux/api/index.js`**, salvo la **discrepancia documental** del **POST raíz `/api/Insumo`** (el front usa `postSupplyCreate` hacia `/insumo`; el JSON de contrato puede no listar ese `POST` — validar en despliegue).
- **UX / producto (no son “faltantes de API”):** consulta bebé por DNI solo en **listado bebés** (coordinadora), no duplicada en perfil madre; panel de coordinación usa formularios “técnicos” (JSON) para parte de insumos/usuarios.

---

## Validación en frontend

| Área | Estado | Referencia |
|------|--------|------------|
| Madre alta / edición | Centralizada al guardar | `motherFormValidation.js`, `MotherForm` |
| Voluntaria | Alta vs perfil; `normalizeVolunteerPayload` | `volunteerFormValidation.js`, `ProfileVolunteerPage`, `ProfileForm` |
| Bebé | Alta en flujo madre; edición perfil | `babyPayload` / templates |
| Login | UI + normalización body | `LoginPage` / `postLogin` |
| Tareas / asignación | Componentes + sagas | `TasksPage`, `assignmentSaga` |
| Coordinación (coordinadora) | Asignación avanzada, asistencia, usuarios, bajas, insumo por id | `CoordinacionPage`, rutas y sagas asociadas |
| Horarios voluntaria | Carga y guardado días | `VolunteerHorarioSection`, `horarioSaga` |
| Errores API | Toasts / mapeo campos | `apiErrorMessage.js`, sagas |

---

## Seguridad

| Tema | Actual | Acción recomendada |
|------|--------|-------------------|
| Token | JWT en `localStorage`; Bearer en interceptor | Valorar cookies httpOnly; mitigar XSS |
| Rutas | `PrivateRoute` comprueba token | RBAC en servidor |
| 401 | Limpia storage → login | Refresh token si el API lo ofrece |
| Bajas / admin | deletes en varios recursos | Solo roles autorizados en **backend** |
| Transporte | — | HTTPS en producción para `VITE_URL_API` |

---

## Mantenimiento

1. Tras cambios en el backend: volcar `swagger/v1/swagger.json` y actualizar **`swagger-detail.json`** en el repo.
2. Nueva integración: `src/redux/api/index.js` → saga / actions / reducer → ruta si hay UX.
3. Reglas del proyecto: `.cursor/rules/04-endpoints-backend.mdc`, `03-contratos-frontend-y-lineamientos.mdc`.
4. Actualizar este archivo y referencias cruzadas (p. ej. `docs/pendientes.md` si aplica).

---

## Registro de cambios (documento)

| Fecha | Cambio |
|-------|--------|
| May 2026 | Integración coordinadora: `CoordinacionPage`, horarios en perfil voluntaria, listados con bajas, `getBabyByDni` / `disponibles-abrazo` con fallback. Matrices y brechas alineadas a `redux/api`. |
| May 2026 | Relectura de `swagger-detail.json`: matrices ampliadas; snapshot de conteos; rutas UI en `RouterApp.jsx`. |

---

*Inventario estático: validar siempre paths y verbos contra el entorno desplegado (`VITE_URL_API`).*
