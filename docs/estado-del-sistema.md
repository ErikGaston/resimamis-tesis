# Estado del sistema — qué hace hoy Resimamis

Sistema de gestión operativa para un programa de **abrazos de bebé** (método mamá canguro) en
una Unidad de Neonatología. Este documento describe **qué hace**; el *cómo técnico* vive en
`.claude/rules/`.

**Última revisión:** 2026-08-24 (frontend `fa61730`, backend `4684eea`).

**Stack:** Frontend React 18 + Vite + Redux-Saga + MUI v5 (raíz).
Backend ASP.NET Core .NET 8 + EF Core + PostgreSQL (`resimamis/`, repo independiente).

> El backend va **por delante** del frontend: expone ~100 endpoints y la app consume ~50.
> Las secciones marcadas *(solo backend)* existen en la API pero todavía no tienen UI.
> Detalle en [`cobertura-api.md`](cobertura-api.md).

---

## 1. Autenticación

- Login con **DNI + contraseña** → JWT Bearer en `localStorage['token']`.
- Sesión en `localStorage['voluntaria']`.
- Interceptor inyecta el header en cada request; en 401 limpia storage y redirige a `/login`.
- **Rol coordinadora** (`isCoordinadoraSession()`) habilita funcionalidad avanzada en
  `/tareas`, `/insumos`, listados y `/coordinacion`.
- Cambio de contraseña propio desde `/mi-perfil`. **No hay recupero por email.**

## 2. Voluntarias

- Alta (`/voluntaria`), listado con buscador (`/voluntarias`), perfil editable
  (`/voluntaria/perfil/:id`), perfil propio (`/mi-perfil`).
- Registro de horarios disponibles (días + turno).
- Carrusel de voluntarias "libres" en la home.
- Estados: `Activa`, `Asignada`, `Abrazando`, `Ayudando`, `Inactiva`, `Licencia`,
  `Carpeta médica`.
- Baja lógica.

## 3. Madres y bebés

- Alta de madre con bebé opcional en el mismo formulario (`/madre`).
- Perfil de madre con acordeón de bebés: editar madre, editar bebé, consulta de bebé por DNI.
- Perfil de bebé (`/bebe/perfil/:id`) con pesos (nacimiento, ingreso NEO, día de abrazos, alta)
  y diagnósticos.
- Listados con buscador por nombre/apellido/DNI.
- **Egreso del bebé:** cargar `FechaSalida` da de baja lógica al bebé automáticamente.
- Baja lógica de madre, voluntaria o bebé.

## 4. Asistencia

- Registrar **entrada y salida** del día.
- Consultar asistencia propia (individual, hoy, históricas).
- Reporte por período y listado completo, con baja lógica desde las cards.

## 5. Asignaciones y abrazos (`/tareas`)

La pantalla central. Tres secciones:

| Sección | Visible para |
|---------|-------------|
| **Actividades** | Todas: entrada/salida, abrazo activo, iniciar/finalizar |
| **Mis asignaciones** | Todas: asignaciones del día con estado y datos del bebé |
| **Asignación** | Solo coordinadora: voluntarias libres + bebés disponibles → generación masiva |

**Ciclo del abrazo:** generar asignación → iniciar → (registrar insumos, opcional) → finalizar
con comentario opcional. Los estados son `Creada` → `Iniciado` → `Finalizado`.

**Abrazos colgados:** la coordinadora puede cerrar asignaciones iniciadas en días anteriores
que nunca se finalizaron.

## 6. Insumos (`/insumos`)

- Catálogo con stock actual, mínimo y máximo.
- Movimientos de stock (entrada/salida, con proveedor opcional).
- Consulta de movimientos por período.
- Estadística de consumo por insumo.
- *(solo backend)* Listado de insumos bajo stock mínimo y **aviso por email** a las
  coordinadoras, disparado automáticamente tras cada movimiento.

## 7. Estadísticas (`/estadisticas`)

Hoy: distribución de madres por localidad, edades de madres, asignaciones por día del mes,
duración de abrazos y consumo de insumos (chart.js).

*(solo backend)* Un módulo `Dashboard` completo sin UI: resumen de período, snapshot de
coordinación del día, cobertura de abrazos, bebés por estado/sala/rango de edad/permanencia,
evolución de peso ingreso vs egreso, ranking de voluntarias e historial de abrazos por bebé y
por voluntaria.

## 8. Coordinación (`/coordinacion`)

Panel avanzado, solo coordinadora. Seis secciones en cards:

**Asignación** (editar/eliminar por id, resetear abrazos colgados) · **Asistencia** (reporte por
fechas, listado, baja) · **Usuarios** (ABM vinculado a voluntarias) · **Bajas** (madre / bebé /
voluntaria) · **Proveedores** (ABM) · **Salas** (ABM).

> Si entra alguien que no es coordinadora, la página muestra un aviso y un botón para volver;
> no redirige sola.

## 9. Visitas

Registro de visitas de familiares a bebés: visitante, si es familiar, fecha/hora, documento,
teléfono y observación. Baja lógica por flag `Activa`. Se accede desde el perfil del bebé.

## 10. Asistente IA *(solo backend)*

Asistente conversacional para la coordinadora, sobre OpenAI, con 19 herramientas de **solo
lectura** contra los datos del dashboard (cobertura del día, rankings, búsquedas de bebés y
voluntarias, evolución de peso, stock bajo mínimo). Requiere API key configurada. Sin UI.

---

## Lo que el sistema NO tiene

- **Tests automáticos**: no hay suite configurada en ninguno de los dos repos.
- **CI**: no hay `.github/workflows`.
- **Lint/format**: no hay ESLint ni Prettier.
- Recupero de contraseña por email.
- Notificaciones push (sí hay email, solo para stock mínimo).
- Multi-idioma.
- Roles granulares más allá de voluntaria y coordinadora.
- ABM de tareas de catálogo con UI (el backend y el Redux existen; falta la pantalla).

> Deuda técnica priorizada, incluido un **bug bloqueante en los estados de asignación**:
> [`deuda-tecnica.md`](deuda-tecnica.md).
