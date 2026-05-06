# Pendientes — resimamis-web

Listado de trabajo pendiente y deudas técnicas. **Convención:** al cerrar un ítem, marcá la fila, mové a “Hecho” con fecha, o eliminá la entrada.

**Inventario completo Swagger vs front (operaciones, vistas, validación, seguridad, prioridades P0–P3):** ver **[`docs/cobertura-swagger-frontend.md`](cobertura-swagger-frontend.md)**.

**Última actualización:** 2026-05-05 (cierre técnico: Redux writes, madre/bebé/coordinación, movimientos stock, detalle asignación, README).

---

## Hecho recientemente (para retomar el contexto)

| Área | Archivos / notas |
|------|-------------------|
| **Redux “writes” selectivos** | Nuevas acciones `CLEAR_*_WRITES` en `mother`, `volunteer`, `supply`, `assignment`, `baby` reducers + actions. **`CoordinacionPage`** ya no hace `clearMother` / `clearVolunteer` / `clearAssignment` / `clearSupply` completos tras éxitos (no se pierde `getMother` ni listados). |
| **Montaje listados / perfil madre** | **`ProfileMotherPage`**, **`MotherPage`**, **`ListMotherPage`**, **`ListVolunteerPage`**: orden `clear*` → `get*`; evita carrera con `getMother`/`getVolunteers`. Tras baja en listado: **`clearMotherWrites`** / **`clearVolunteerWrites`** / **`clearBabyWrites`** para no re-disparar efectos. |
| **Validación madre** | **`resolveListadoMadreId`**, **`getMotherEstadoCivilOptionsForSelect`** en `motherFormValidation.js`; **`MotherForm`** usa opciones dinámicas; duplicado DNI tolera `idMadre` / `IdMadre` / `id`. |
| **Movimientos insumo** | **`supplyMovementPayload.js`**: `normalizeEsEntradaForApi` + uso en **`supplySaga`** antes de `postSupplyRegisterMovement`. |
| **Detalle asignación (Tareas)** | **`AssistanceDataDialog`**: prop `presentation` (`auto` / `assistance` / `assignment`); vista resumen + acordeón JSON. **`TasksPage`** pasa `assignment` / `assistance`. |
| **Perfil madre + coordinadora** | **`ProfileMotherPage`**: bloque consulta bebé por DNI (`getBabyByDni`) si sesión coordinadora. |
| **README** | Sustituidos placeholders por instrucciones reales (stack, `.env`, build). |
| **Build Windows** | `package.json`: copia `web.config` con Node tras `vite build`. |

---

## Próximos pasos sugeridos (siguiente sesión)

1. **Swagger vivo:** bajar `swagger/v1/swagger.json` del despliegue y contrastar con `swagger-detail.json` + `redux/api/index.js`.
2. **Movimientos stock:** prueba manual contra backend; si rechaza `esEntrada`, ajustar mapeo en `supplyMovementPayload.js` según respuesta real.
3. **Estado civil:** si el backend publica catálogo o códigos distintos a 1–6, reemplazar o complementar `MOTHER_ESTADO_CIVIL_OPTIONS` con datos del API.
4. **Detalle asignación:** ampliar campos del “Resumen” cuando tengas ejemplo real de payload `consultar`.

---

## Contrato API y Swagger

| Estado | Ítem | Notas |
|--------|------|--------|
| Hecho | **`GET` bebés a abrazar** | Path alineado a `/bebe/abrazar`; query vía `{ params }` en `getBabysFree`. |
| Hecho | **`getVolunteerById`** | URL `/voluntaria/id/:id` sin doble slash. |
| Hecho | **Login body** | `postLogin` normaliza a `dni` / `contrasena`. |
| Pendiente | **Re-sincronizar** `swagger/v1/swagger.json` | Antes de cambios HTTP, contrastar siempre el JSON publicado (ver `06-swagger-contrato-api.mdc`). |

---

## Redux / sagas / datos

| Estado | Ítem | Notas |
|--------|------|--------|
| Hecho | **`getDurationHug`** | `assignmentSaga` + Estadísticas. |
| Hecho | **`postAssignmentGenerate` (legacy)** | `postAssignmentGenerateLegacy` en API. |
| Hecho | **`CLEAR_*_WRITES`** | Limpieza parcial tras coordinación / bajas en listados; ver `actionTypes.js` y reducers. |

---

## Autenticación y rutas

| Estado | Ítem | Notas |
|--------|------|--------|
| Hecho | **Ruta `/home` tras login** | `LoginPage` → `/overview`; `RouterApp` redirige `home` → `overview`. |
| Hecho | **`PublicRoute`** | Con token redirige a `/overview`. |

---

## Formulario madre y dominio

| Estado | Ítem | Notas |
|--------|------|--------|
| Hecho | **`MOTHER_ESTADO_CIVIL_OPTIONS` + legacy** | Si el registro trae un código no listado, aparece opción *“Código N (registrado en el sistema)”* vía `getMotherEstadoCivilOptionsForSelect`. |
| Hecho | **Duplicado DNI / id en listado** | `resolveListadoMadreId` unifica `idMadre`, `IdMadre`, `id`, etc. |

---

## Build, scripts y documentación del repo

| Estado | Ítem | Notas |
|--------|------|--------|
| Hecho | **`npm run build` en Windows** | Ver `package.json`. |
| Hecho | **`README.md`** | Introducción, env, scripts, enlaces a `docs/`. |

---

## UX y errores

| Estado | Ítem | Notas |
|--------|------|--------|
| Hecho | **FAB Insumos (lista)** | `SupplyTemplate` → pestaña Movimientos. |
| Hecho | **Toasts en sagas** | `showApiErrorToast` usa **`resolveApiErrorMessage`** (`showApiErrorToast.js`). |

---

## Endpoints / vistas / brechas (detalle)

La **matriz operación por operación** está en **`cobertura-swagger-frontend.md`**.

---

## Mantenimiento de este archivo

- Tras completar tareas, actualizar tablas y `cobertura-swagger-frontend.md`.
- Backlog general: `05-mantenimiento-reglas.mdc`.
