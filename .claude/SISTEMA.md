# Estado del sistema — qué hace hoy Resimamis

Sistema de gestión operativa para un programa de **abrazos de bebé** (método mamá canguro) en una Unidad de Neonatología. El *cómo técnico* vive en `.claude/rules/`; este doc es el *qué hace*.

**Stack:** Frontend React 18 + Vite + Redux + Redux-Saga + MUI v5 (raíz). Backend ASP.NET Core .NET 8 + EF Core + PostgreSQL (`resimamis/`).

---

## 1. Autenticación

- Login con **DNI + contraseña** → JWT Bearer en `localStorage['token']`.
- Datos de sesión en `localStorage['voluntaria']` (id, nombre, apellido, mail, dni, celular, idRol, rol).
- Interceptor inyecta `Authorization: Bearer <token>` en cada request. En 401: limpia storage y redirige a `/login`.
- **Rol coordinadora:** detectado por `isCoordinadoraSession()` (verifica `rol === "coordinadora"` o `idRol === VITE_COORDINADORA_ID_ROL`). Habilita funcionalidades avanzadas en `/tareas` y `/coordinacion`.

## 2. Gestión de voluntarias

- Alta de voluntaria (`/voluntaria`), listado con buscador (`/voluntarias`), perfil con edición (`/voluntaria/perfil/:id`).
- Registro de horarios disponibles (días + hora inicio/fin).
- Voluntarias "libres" en el carrusel de la home (las que tienen asistencia de entrada hoy y no están asignadas).
- Estados: `Activa`, `Asignada`, `Abrazando`, `Ayudando`, `Inactiva`, `Licencia`, `Carpeta médica`.
- Baja lógica (solo coordinadora).

## 3. Gestión de madres y bebés

- Alta de madre con bebé opcional en el mismo formulario (`/madre`).
- Perfil de madre con acordeón de bebés (`/madre/perfil/:id`): editar madre + editar bebé, consulta de bebé por DNI (coordinadora).
- Listados con buscador por nombre/apellido/DNI (`/madres`, `/bebes`).
- Estadísticas: distribución por localidad y edades de madres.
- Baja lógica de madre, voluntaria o bebé (solo coordinadora).

## 4. Asistencia

- Registrar **entrada y salida** del día.
- Consultar asistencia propia (individual, hoy, históricas).
- Reporte por período (coordinadora): todas las asistencias entre fechas.
- Baja lógica de asistencia (coordinadora).

## 5. Asignaciones y abrazos (pantalla `/tareas`)

La pantalla central del sistema. Tres secciones principales:

| Sección | Visible para |
|---------|-------------|
| **Actividades** (activityTask) | Todas: registrar entrada/salida, ver abrazo activo, iniciar/finalizar abrazo, ver asistencias propias |
| **Mis asignaciones** (assignedList) | Todas: listado de asignaciones del día, estado, datos del bebé |
| **Asignación** (assignmentTask) | Solo coordinadora: seleccionar voluntarias libres + bebés disponibles → generar asignaciones masivas |

**Ciclo de un abrazo:** generar asignación → iniciar → (registrar insumos opcional) → finalizar con comentario opcional.

**Abrazos colgados:** la coordinadora puede resetear asignaciones iniciadas en días anteriores que nunca se finalizaron.

## 6. Insumos (`/insumos`)

- Catálogo de insumos con stock (actual, mínimo, máximo).
- Registro de movimientos de stock (entrada/salida con proveedor opcional).
- Consulta de movimientos por período y filtros.
- Estadística de consumo por insumo.
- Alta, edición, baja lógica (coordinadora para algunos).

## 7. Estadísticas (`/estadisticas`)

- Distribución de madres por localidad.
- Distribución de edades de madres.
- Cantidad de asignaciones por día del mes.
- Duración de abrazos (datos de API + gráficos chart.js).
- Consumo de insumos.

## 8. CoordinacionPage (`/coordinacion`)

Panel avanzado solo para coordinadora (check on-mount). Pestañas:
- **Asignación:** editar/eliminar asignación por id; resetear abrazos colgados.
- **Asistencia:** reporte por rango de fechas; baja lógica por id.
- **Usuarios:** CRUD de usuarios del sistema (vinculados a voluntarias).
- **Bajas:** baja lógica de madre/voluntaria/bebé por id.
- **Insumos:** GET/PUT/DELETE de insumo por id (panel técnico).

## 9. Visitas (módulo nuevo, jun 2026)

Registro de visitas de familiares a bebés: visitante, familiar (bool), fecha/hora, documento, teléfono, observación. Baja lógica (flag `Activa`).

## 10. Lo que el sistema todavía NO tiene (pendientes conocidos)

- Tests automáticos (Jest/Vitest/Playwright): **no hay suite configurada**.
- Recupero de contraseña por email (`PUT /usuario/contrasena` existe pero sin flujo front de "olvidé").
- Notificaciones push o por email.
- Multi-idioma.
- Roles granulares adicionales (solo voluntaria y coordinadora).

> Detalle de pendientes técnicos: `docs/pendientes.md`.
