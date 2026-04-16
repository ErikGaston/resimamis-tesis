# Pendientes — resimamis-web

Listado de trabajo pendiente y deudas técnicas. **Convención:** al cerrar un ítem, marcá la fila, mové a “Hecho” con fecha, o eliminá la entrada.

**Inventario completo Swagger vs front (operaciones, vistas, validación, seguridad, prioridades P0–P3):** ver **[`docs/cobertura-swagger-frontend.md`](cobertura-swagger-frontend.md)**.

**Última actualización:** 2026-04-16 (sesión: UI asistencias, bebés, voluntaria perfil, insumos FAB).

---

## Hecho recientemente (para retomar el contexto)

| Área | Archivos / notas |
|------|-------------------|
| **Asistencias hoy / histórico** | `AssistanceDataDialog.jsx`: tabla (nombre, DNI, ingreso, salida); normalización API; `volunteerFallback` desde `localStorage` en `TasksPage` para histórico sin `voluntaria`. |
| **Listado bebés** | `CardBaby.jsx`: línea DNI; `ListBabysTemplate` búsqueda con `Dni`. |
| **Perfil voluntaria** | `ProfileVolunteerPage.jsx`, `volunteerFormValidation.js`, `ProfileForm.jsx`: exclusión correcta en duplicado DNI; nacimiento opcional en perfil; fechas inicio/fin perfil sin ventana de “alta”; `normalizeVolunteerPayload` copia `id`→`idVoluntaria`. |
| **Insumos** | `SupplyTemplate.jsx`: FAB «+» cambia a pestaña Movimientos y hace scroll a `#supply-register-movement` (ya no `Link` inútil a `/insumos`). |

---

## Próximos pasos sugeridos (siguiente sesión)

1. **Movimientos stock:** probar `POST /insumo/registrarMovimiento` y, si el backend rechaza el body, ajustar `esEntrada` (hoy `S`/`N` en formulario).
2. **Detalle asignación:** si el equipo quiere paridad con asistencias, reemplazar JSON del diálogo por vista estructurada según respuesta real de `consultar`.
3. **Swagger:** bajar JSON publicado y contrastar con `swagger-detail.json` + `redux/api/index.js`.
4. **Build Windows:** script `cp web.config` → alternativa cross-platform o `copy` en `package.json`.
5. **Madre:** pendientes de siempre (`MOTHER_ESTADO_CIVIL_OPTIONS`, DNI/`idMadre` en validación) — ver `tareas-validacion-madre.md`.
6. **Endpoints sin UI:** Horario, `POST Usuario`, delete voluntaria — priorizar con negocio.

---

## Contrato API y Swagger

| Estado | Ítem | Notas |
|--------|------|--------|
| Hecho | **`GET` bebés a abrazar** | Path alineado a `/bebe/abrazar`; query vía `{ params }` en `getBabysFree`. |
| Hecho | **`getVolunteerById`** | Se eliminó el doble slash: URL `/voluntaria/id/:id` (`redux/api/index.js`). |
| Hecho | **Login body** | `postLogin` normaliza a `dni` (número) y `contrasena` antes del POST. |
| Pendiente | **Re-sincronizar** `swagger/v1/swagger.json` | Antes de cambios HTTP, contrastar siempre el JSON publicado (ver `06-swagger-contrato-api.mdc`). El repo puede tener copia local `swagger-detail.json` desactualizada. |

---

## Redux / sagas / datos

| Estado | Ítem | Notas |
|--------|------|--------|
| Hecho | **`getDurationHug`** | Registrado en `assignmentSaga`; UI en Estadísticas (respuesta JSON). |
| Hecho | **`postAssignmentGenerate` (legacy)** | Renombrado en API a `postAssignmentGenerateLegacy` (JSDoc); el flujo de tareas usa `postAssignmentGenerateTareas` / `generarTareas`. |

---

## Autenticación y rutas

| Estado | Ítem | Notas |
|--------|------|--------|
| Hecho | **Ruta `/home` tras login** | `LoginPage` y sesión ya logueada navegan a `/overview`; en `RouterApp`, `path: 'home'` redirige a `/overview`. |
| Hecho | **`PublicRoute`** | Envuelve `LoginPage`; con token redirige a `/overview`. El resto de rutas sigue en `PrivateRoute` / 401. |

---

## Formulario madre y dominio

| Estado | Ítem | Notas |
|--------|------|--------|
| Pendiente | **`MOTHER_ESTADO_CIVIL_OPTIONS`** | Los enteros 1–6 son una convención de UI; deben **coincidir con la enumeración del backend**. Si el API expone catálogo (o valores distintos), reemplazar por datos del servidor o ajustar la lista. |
| Pendiente | **Duplicado DNI / `idMadre`** | Si el listado devuelve otro nombre de propiedad para el id, actualizar `validateMotherForm`. Ver notas en `docs/tareas-validacion-madre.md`. |

---

## Build, scripts y documentación del repo

| Estado | Ítem | Notas |
|--------|------|--------|
| Pendiente | **`npm run build` en Windows** | El script usa `cp web.config dist/` (Unix). En Windows puede fallar tras `vite build` OK; usar `copy`/`xcopy`, script cross-platform o documentar solo Linux/CI. |
| Pendiente | **`README.md`** | Contiene placeholders TODO (introducción, instalación, tests, contribución). Completar o enlazar a esta carpeta `docs/`. |

---

## UX y errores

| Estado | Ítem | Notas |
|--------|------|--------|
| Hecho | **FAB Insumos (lista)** | Lleva a registro de movimiento en pestaña Movimientos (`SupplyTemplate`). |
| Pendiente | **Toasts en sagas** | Tras envío, errores red/500 siguen por `showApiErrorToast`; la validación de formulario madre ya es inline. Revisar si se quiere unificar mensajes. Ver `docs/tareas-validacion-madre.md`. |

---

## Endpoints / vistas / brechas (detalle)

La **matriz operación por operación**, marcas SI/NO/PARCIAL, vistas faltantes, validaciones y checklist de seguridad está en **`cobertura-swagger-frontend.md`** (no duplicar aquí).

---

## Mantenimiento de este archivo

- Tras completar tareas, actualizar tablas de esta página y la matriz en `cobertura-swagger-frontend.md`.
- Backlog general: ver `05-mantenimiento-reglas.mdc` (referencia a `docs/pendientes.md`).
