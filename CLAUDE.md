# CLAUDE.md — Resimamis

> Fuente de verdad para Claude Code en este repositorio. Leer antes de tocar cualquier archivo.

## Qué es este proyecto

**Resimamis** es un sistema de gestión operativa para un programa social de **abrazos de bebé** en una Unidad de Neonatología (NEO). Voluntarias entrenadas visitan bebés prematuros, los abrazan (método mamá canguro / piel a piel) y registran la actividad. El sistema gestiona quién abraza a quién, cuándo, con qué insumos, y genera estadísticas del programa.

No es un marketplace, no tiene pagos, no tiene e-commerce. Es una app de campo mobile-first para uso en tablet/smartphone dentro de un hospital.

### Actores

| Actor | Descripción |
|-------|-------------|
| **Voluntaria** | Usuario operativo. Login con DNI + contraseña. Registra asistencia (entrada/salida), ejecuta abrazos según asignaciones, consulta su perfil y horarios. |
| **Coordinadora** | Subrol de voluntaria con `rol === "coordinadora"` (o `idRol === VITE_COORDINADORA_ID_ROL`). Acceso elevado: gestiona asignaciones, genera reportes, da de baja madres/voluntarias/bebés, administra usuarios. En el backend el rol equivalente se llama **"Administrativa"**. |
| **Madre** | Beneficiaria del programa. Datos demográficos: DNI, nombre, localidad, estado civil, motivo del abrazo, cantidad de hijos. Tiene uno o más bebés asociados. |
| **Bebé** | Beneficiario directo del abrazo. Se registra con sala NEO, asociado a una madre. |

### Flujo operativo del día

1. Voluntaria llega → **registra entrada** (`POST /asistencia/entrada/{id}`)
2. Ve sus **asignaciones del día** (qué bebé le toca abrazar)
3. **Inicia el abrazo** → `POST /asignacion/iniciarAbrazo/{idAsignacion}`
4. **Finaliza el abrazo** con comentario opcional → `POST /asignacion/finalizarAbrazo/`
5. Opcionalmente registra **insumos usados** → `POST /asignacion/registrarDetalleAsignacion/`
6. Al irse → **registra salida** (`POST /asistencia/salida/{id}`)

La coordinadora además puede generar asignaciones masivas (múltiples voluntarias + múltiples bebés) y resetear abrazos colgados.

---

## Estructura del repositorio

```
resimamis-tesis/
├── resimamis/          # BACKEND — ASP.NET Core .NET 8 + EF Core + PostgreSQL
│   ├── Controllers/    # 11 controladores REST
│   ├── Datos/          # ApplicationDbContext + repositorios (patrón repositorio)
│   ├── Entidades/      # DTOs, request/response models, ApiResponse envelope
│   ├── Negocio/        # Servicios de negocio (Neg*), algoritmo de asignación
│   ├── Migrations/     # EF Core migrations
│   ├── Program.cs
│   ├── Starup.cs       # (typo intencional del backend) configuración de servicios
│   └── appsettings.json
│
├── src/                # FRONTEND — React 18 + Vite + Redux + Redux-Saga + MUI v5
│   ├── pages/          # Controladores de ruta: conectan Redux al template
│   ├── components/     # Atomic Design: atoms/molecules/organisms/templates + common/
│   ├── redux/
│   │   ├── api/index.js      # TODAS las funciones HTTP (Axios)
│   │   ├── actions/          # Creadores de acciones por dominio
│   │   ├── sagas/            # Efectos async (takeLatest → call → put)
│   │   ├── reducers/         # Un reducer por dominio
│   │   ├── consts/actionTypes.js  # ~237 constantes de acción
│   │   ├── interceptor/interceptor.js  # AxiosInstance + auth header + 401
│   │   └── store/index.js    # createStore + sagaMiddleware
│   ├── routes/RouterApp.jsx  # Rutas con useRoutes
│   ├── utils/          # Validaciones, formateos, helpers de localStorage
│   ├── helpers/
│   │   ├── theme.js    # baseTheme MUI, PALETTE
│   │   └── const/appLayout.js  # APP_COLUMN_MAX_WIDTH_PX = 444
│   └── main.jsx        # Entry point: Provider + ThemeProvider + BrowserRouter + RouterApp
│
├── docs/               # Documentación: cobertura Swagger vs front, pendientes
├── .cursor/rules/      # Reglas de contexto para Cursor/Claude (FUENTE DE VERDAD REAL)
├── swagger-detail.json # Export OpenAPI del backend
├── vite.config.js
└── index.html          # Entry HTML Vite

```

> Las reglas en `.claude/rules/` (00–07) son la fuente de verdad de dominio/arquitectura para Claude Code en este repo. Las reglas en `.cursor/rules/*.mdc` tienen más detalle para Cursor y deben mantenerse sincronizadas.

---

## Frontend

### Stack (no reemplazar sin justificación)

| Área | Tecnología |
|------|------------|
| Framework | **React 18** |
| Bundler | **Vite 4** |
| Lenguaje | **JavaScript / JSX** (ES6+). Sin TypeScript activo. |
| Estado global | **Redux** (`react-redux` v8) + **Redux-Saga** |
| HTTP | **Axios** — instancia única `AxiosInstance` en `src/redux/interceptor/interceptor.js` |
| Routing | **react-router-dom v6** (`useRoutes`, `useNavigate`, `BrowserRouter`) |
| UI | **MUI v5** (`@mui/material` + `@mui/icons-material` + `@mui/x-date-pickers`) |
| Estilos | `@emotion/react` + `@emotion/styled` |
| Gráficos | **chart.js** + **react-chartjs-2** |
| Fechas | **date-fns** + **dayjs** |

**No introducir:** Next.js, RTK Query, React Query (está en package.json pero INACTIVO — el `QueryClientProvider` en main.jsx está comentado), Zustand, styled-components, react-router-dom v5.

### Patrón de página (Page → Template → Organism → Molecule → Atom)

```
LoginPage.jsx (page)
  └── LoginTemplate (template) — recibe props del page
        └── atoms: textfield, button
```

- **`pages/`**: controladores. Usan `useDispatch` + `useSelector` + `useState`/`useEffect`. Despachan actions, arman handlers, pasan todo como props al template.
- **`templates/`**: layout de la pantalla; no conectan Redux directamente.
- **`organisms/`**: secciones con lógica propia de sección.
- **`molecules/`**: combinaciones de atoms (label + input + error text).
- **`atoms/`**: primitivos reutilizables: button, textfield, select, datePicker, dialog, loading.
- **`common/`**: componentes transversales compartidos entre múltiples features.

### Cómo agregar una feature completa

1. **`src/redux/consts/actionTypes.js`** — agregar constantes `GET_X`, `SUCCESS_GET_X`, `ERROR_GET_X`, `CLEAR_X`, `CLEAR_X_WRITES`.
2. **`src/redux/api/index.js`** — agregar función `getX(payload)` usando `AxiosInstance`.
3. **`src/redux/actions/xActions.js`** — agregar creadores de acción.
4. **`src/redux/sagas/xSaga.js`** — agregar worker + watcher (`takeLatest`).
5. **`src/redux/reducers/xReducer.js`** — manejar los tipos de éxito/error/clear.
6. **`src/redux/reducers/index.js`** — si es un reducer nuevo, agregar al `combineReducers`.
7. **`src/redux/sagas/index.js`** — agregar el watcher al `rootSaga` con `all([...])`.
8. Crear page, template, organisms según necesidad.

### Patrón de saga

```javascript
function* asyncGetAlgo({ payload }) {
  try {
    const response = yield call(API.getAlgo, payload);
    if (response) yield put({ type: SUCCESS_GET_ALGO, response });
  } catch (error) {
    yield* showApiErrorToast(error);
    yield put({ type: ERROR_ALGO, response: error });
  }
}
function* watchGetAlgo() { yield takeLatest(GET_ALGO, asyncGetAlgo); }
```

### Patrón de reducer

```javascript
const ACTIONS = {
  [SUCCESS_GET_ALGO]: (state, action) => ({ ...state, algo: action.response.data, loading: false }),
  [CLEAR_ALGO_WRITES]: (state) => ({ ...state, postAlgoSuccess: null, putAlgoSuccess: null }),
  // ...
};
export default (state = initialState, action) => (ACTIONS[action.type]?.(state, action) ?? state);
```

### `CLEAR_*_WRITES` — limpieza granular

Patrón clave para no perder datos de listados al hacer operaciones de escritura. En lugar de limpiar todo el slice con `CLEAR_MADRE`, usar `CLEAR_MADRE_WRITES` que solo limpia flags como `postMotherSuccess`, `putMotherSuccess`, sin vaciar `madres` ni `madreDetail`. Ver `motherReducer.js` como referencia.

### Layout global

- `AppScreenLayout` envuelve toda la app: columna centrada `maxWidth: 444px`.
- `GlobalSnackBar` escucha `toastReducer`.
- `Footer` (tab bar móvil): 4 tabs fijos — **Inicio** (`/overview`), **Tareas** (`/tareas`), **Estadísticas** (`/estadisticas`), **Perfil** (`/mi-perfil`).
- `PageScrollMain`: padding inferior para no tapar contenido bajo la nav.

### Error display rule (NO violar)

| Contexto | Mecanismo |
|----------|-----------|
| **Login** | Solo inline (`<Typography role="alert">` en `LoginTemplate`) — el toast desaparece, el usuario necesita ver el error mientras reingresa la contraseña |
| **Todo el resto** | Solo toast (`showApiErrorToast(error)` en el catch de la saga) |

`asyncPostLogin` en `userSaga.js` es la **única saga** que omite `showApiErrorToast`. Todas las demás siempre lo llaman.

### Patrones de Dialog

| Patrón | Uso | `PaperProps.sx` clave |
|--------|-----|----------------------|
| Full-screen (100dvh) | Finalizar abrazo, detalles de asignación, Coordinación | `height: '100dvh', maxHeight: '100dvh', m: 0, borderRadius: 0` |
| Bottom-sheet (90dvh) | Cambio de contraseña, formularios cortos | `mb: 0, mt: 'auto', borderRadius: '20px 20px 0 0', maxHeight: '90dvh'` + `sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}` |

### Errores de API

`resolveApiErrorMessage(err)` en `utils/apiErrorMessage.js` interpreta errores Axios y ASP.NET Core ProblemDetails. Usar siempre; no mostrar mensajes crudos del backend. `showApiErrorToast(error)` en sagas dispara el snackbar global.

---

## Backend (`resimamis/`)

### Stack

| Área | Tecnología |
|------|------------|
| Framework | **ASP.NET Core Web API** — .NET 8 |
| ORM | **Entity Framework Core 8** |
| Base de datos | **PostgreSQL** (Npgsql 8) |
| Auth | **JWT Bearer** (`Microsoft.AspNetCore.Authentication.JwtBearer` 6.0) |
| Passwords | **BCrypt.Net-Next** |
| API Docs | **Swagger** (Swashbuckle 6.8) — disponible en `/` |
| Contenedores | **Docker** (Dockerfile incluido) |
| Deploy | **Render** (ver `RENDER_DEPLOY.md`) |

### Arquitectura: 3 capas

```
Controller → Negocio (servicios Neg*) → Repositorio (*Repositorio) → EF Core → PostgreSQL
```

- **Controllers/** (`ControllerBase`): reciben HTTP, delegan a capa Negocio, devuelven `ApiResults.Success/BadRequest`.
- **Negocio/**: clases `Neg*` con toda la lógica de negocio. `NegConversorFecha`: timezone Argentina (UTC-3).
- **Datos/**: clases `*Repositorio`, `ApplicationDbContext`. Sin inyección de dependencias propia: cada repositorio instancia su propio `DbContext` con `new`.

> Los errores de negocio devuelven **HTTP 200 con `success: false`**, no HTTP 4xx. El front debe chequear `response.data.success` además del status HTTP.

### Autenticación backend

- `POST /api/Usuario/login` recibe `{ Dni: int, Contrasena: string }` → devuelve JWT (30 días, sin validación de expiración activa).
- Header requerido: `Authorization: Bearer <token>`.
- Rol coordinadora: el backend lo llama **"Administrativa"**. `NegUsuarios.EsAdministrativaPorDni(dni)` consulta la DB. Las operaciones restringidas llaman a `RequiereAdministrativa(dniSolicitante)`.
- CORS: `AllowAnyOrigin + AllowAnyHeader + AllowAnyMethod`.

### Baja lógica universal

Ninguna entidad se borra físicamente. El endpoint `POST /api/X/delete` setea `idEstado` al estado "Eliminado" del ámbito correspondiente en la tabla ESTADO. Siempre respetar este patrón al trabajar en el backend.

### Tabla ESTADO + AMBITO (polimorfismo de estados)

Una sola tabla `ESTADO` con campo `idAmbito` permite estados distintos por entidad. Ámbitos: `Bebes`, `Voluntarias`, `Madres`, `Insumos`, `Asistencias`, `Asignaciones`, `Usuarios`. `EstadoRepositorio` resuelve IDs por nombre+ámbito.

---

## Entidades del dominio

| Entidad | Campos clave |
|---------|-------------|
| **VOLUNTARIA** | `IdVoluntaria`, `Dni`, `Nombre`, `Apellido`, `Mail`, `Celular`, `IdRol`, `rol` (NotMapped), `IdEstado` |
| **MADRE** | `IdMadre`, `Dni` (7-8 dígitos, único), `Nombre`, `Apellido`, `FechaNacimiento`, `Localidad` (FK), `EstadoCivil` (1-6), `CantidadHijos`, `MotivoAbrazo`, `Celular`, `IdEstado` |
| **BEBE** | `ID`, `Dni?`, `nombre`, `apellido`, `Sexo`, `FechaNacimiento?`, `IdSala?`, `IdMadre?`, `IdEstado?` |
| **ASIGNACION** | `idAsignacion`, `idVoluntaria`, `idBebe?`, `idTarea?`, `idEstado`, `fechaHoraInicio?`, `fechaHoraFin?`, `comentario` |
| **ASISTENCIA** | `IdAsistencia`, `IdVoluntaria?`, `FechaHoraIngreso?`, `FechaHoraSalida?`, `idEstado` |
| **INSUMO** | `idInsumo`, `nombre`, `descripcion`, `stockActual`, `stockMinimo`, `stockMaximo`, `idEstado` |
| **MOVIMIENTOSTOCK** | `idMovimiento`, `idInsumo`, `esEntrada?` (bool), `cantidad?`, `idProveedor?`, `fechaMovimiento?` |
| **TAREA** | `idTarea`, `nombre`, `Estado` (bool), `esUnica` (bool: si true, solo una activa simultáneamente) |
| **VISITA** | `idVisita`, `idBebe`, `nombreVisitante`, `familiar`, `fechaHoraVisita`, `documentoVisitante?`, `telefonoVisitante?`, `Activa` (bool), `fechaRegistro` |
| **DETALLEASIGNACION** | `idDetalleAsignacion`, `idAsignacion`, `idInsumo`, `cantidad`, `nombreInsumo` |

---

## Roles y autorización (frontend)

```javascript
// utils/coordinadoraRole.js
isCoordinadoraSession()
  // verifica localStorage['voluntaria'].rol === "coordinadora" (insensible a acentos/mayúsculas)
  // o idRol === parseInt(VITE_COORDINADORA_ID_ROL)
```

- Las rutas son accesibles a todas las voluntarias; el acceso elevado se maneja con guards in-page.
- `CoordinacionPage` llama `isCoordinadoraSession()` on-mount y redirige a `/overview` si no es coordinadora.
- En listados de madres/voluntarias/bebés, la coordinadora ve íconos de baja adicionales.

---

## Autenticación (frontend)

### Login

1. Form: `Dni` (number) + `Contrasena` (string) → `postLogin` normaliza a `{ dni, contrasena }` → `POST usuario/login/`.
2. Respuesta plana (sin envelope `data`): incluye `token` y objeto `voluntaria`.
3. Se guardan en `localStorage`:
   - `localStorage['token']` → JWT Bearer
   - `localStorage['voluntaria']` → JSON con `{ id, nombre, apellido, mail, dni, celular, idRol, rol }`
4. `setAuthToken(token)` refuerza el header por defecto de Axios.

### Interceptor (`src/redux/interceptor/interceptor.js`)

- **Request:** inyecta `Authorization: Bearer <localStorage['token']>` si existe.
- **Response 401:** limpia `localStorage`, recarga → redirige a `/login`.
- Base URL: `import.meta.env.VITE_URL_API`.

### Guards de ruta

- `PrivateRoute`: chequea `localStorage['token']` → redirige a `/login` si ausente.
- `PublicRoute` (login): con token redirige a `/overview`.
- `RootRedirect`: entrada raíz → con token a `/overview`, sin token a `/login`.

---

## Variables de entorno

### Frontend (`.env`)

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `VITE_URL_API` | URL base del backend, ej: `https://resimamis.onrender.com/` | Sí |
| `VITE_COORDINADORA_ID_ROL` | id numérico del rol coordinadora como fallback | No |

Copiar `.env.example` → `.env`.

### Backend

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string PostgreSQL (formato `postgres://...` de Render; se convierte automáticamente) |
| `DefaultConnection` | Alternativa en formato Npgsql directo |
| `PORT` | Puerto Kestrel (Render lo inyecta) |
| `RUN_MIGRATIONS_ON_STARTUP` | `"false"` para omitir `db.Database.Migrate()` al arrancar |

---

## Scripts

### Frontend

```bash
npm run dev        # Vite dev server en http://localhost:5173 (abre automáticamente)
npm run build      # vite build + copia web.config a dist/ para IIS
npm run preview    # sirve el build de producción localmente
```

### Backend (`resimamis/`)

```bash
dotnet run                        # dev server en http://localhost:5110
dotnet build                      # compilar
dotnet ef migrations add NombreMigracion  # nueva migración EF Core
dotnet ef database update         # aplicar migraciones
docker build -t resimamis .       # imagen Docker
```

---

## Rutas de la app

| Path | Página | Acceso | APIs principales |
|------|--------|--------|-----------------|
| `/` | `RootRedirect` | pública | — |
| `/login` | `LoginPage` | pública | `postLogin` |
| `/overview` | `HomePage` | privada | `getVolunteersFree` |
| `/madres` | `ListMotherPage` | privada | `getMother`, baja (coord) |
| `/madre` | `MotherPage` | privada | `postMother`, `postBaby`, `getLocalities` |
| `/madre/perfil/:id` | `ProfileMotherPage` | privada | `getMotherId`, `putMother`, `getBabySalas`, `putBaby`, `getBabyByDni` (coord) |
| `/voluntaria` | `VolunteerPage` | privada | `postVolunteer` |
| `/voluntaria/perfil/:id` | `ProfileVolunteerPage` | privada | `getVolunteerById`, `putVolunteer`, `getHorarioDias`, `postHorario` |
| `/voluntarias` | `ListVolunteerPage` | privada | `getVolunteers`, `getVolunteersStates` |
| `/bebes` | `ListBabysPage` | privada | `getBabys`, baja (coord) |
| `/tareas` | `TasksPage` | privada | asistencia, asignaciones, abrazos, insumos (la pantalla más compleja) |
| `/estadisticas` | `StatisticsPage` | privada | estadísticas madre, asignación, insumo |
| `/insumos` | `SupplyPage` | privada | catálogo, movimientos, proveedores |
| `/bebe/perfil/:id` | `ProfileBabyPage` | privada | `getBabyByDni`, `putBaby`, `getBabySalas` |
| `/coordinacion` | `CoordinacionPage` | solo coordinadora | gestión avanzada: PUT/DELETE asignación, reset abrazos, CRUD usuarios, reportes, CRUD proveedores, CRUD salas |
| `/mi-perfil` | `MyProfilePage` | privada | `getVolunteerById`, `putVolunteer`, `putUsuarioContrasena` |

La ruta `/home` redirige a `/overview` (legacy).

---

## Endpoints backend — referencia rápida

Base URL: `VITE_URL_API`. Prefijo en el backend: `/api/[Controller]`. Auth: `Authorization: Bearer <token>`.

### Usuario
| Método | Path | Notas |
|--------|------|-------|
| POST | `/usuario/login/` | Sin auth. Body: `{ dni, contrasena }` |
| GET | `/usuario` | Solo Administrativa |
| POST | `/usuario` | Solo Administrativa |
| GET | `/usuario/id/{id}` | — |
| PUT | `/usuario/id/{id}/` | Solo Administrativa |
| PUT | `/usuario/contrasena` | Body: `{ ContrasenaActual, ContrasenaNueva }` |
| POST | `/usuario/delete` | Query `idUsuario` |
| GET | `/usuario/voluntarias-sin-usuario` | Voluntarias sin usuario asignado |

### Voluntaria + Asistencia
| Método | Path |
|--------|------|
| POST | `/voluntaria/` |
| GET | `/voluntaria/`, `/voluntaria/libres/`, `/voluntaria/estados/`, `/voluntaria/id/{id}` |
| PUT | `/voluntaria/id/{id}/` |
| POST | `/voluntaria/delete` |
| POST | `/asistencia/entrada/{id}`, `/asistencia/salida/{id}` |
| GET | `/asistencia/id/{id}`, `/asistencia/hoy`, `/asistencia/historicas/{id}`, `/asistencia/reporte?fechaInicio=&fechaFin=` |
| POST | `/asistencia/delete` |

### Madre / Bebé
| Método | Path |
|--------|------|
| POST | `/madre/`, `/bebe/` |
| GET | `/madre/`, `/madre/id/{id}`, `/madre/estadisticaLocalidades`, `/madre/estadisticaEdadesMadre` |
| GET | `/bebe/`, `/bebe/disponibles-abrazo` (o `/bebe/abrazar`), `/bebe/listarSalas`, `/bebe/id/{dni}` |
| PUT | `/madre/id/{id}/`, `/bebe/` |
| POST | `/madre/delete`, `/bebe/delete` |

### Asignación y abrazos
| Método | Path | Notas |
|--------|------|-------|
| POST | `/asignacion/generarTareas/` | Body: `{ idVoluntarias: int[], idTareas: int[] }` |
| POST | `/asignacion/generarTarea` | Body: `{ idVoluntaria, idTarea }` |
| POST | `/asignacion/iniciarAbrazo/{idAsignacion}` | — |
| POST | `/asignacion/finalizarAbrazo/` | Body: `{ idAsignacion, comentario }` |
| POST | `/asignacion/registrarDetalleAsignacion/` | Body: array `[{ idAsignacion, idInsumo, cantidadInsumo }]` |
| GET | `/asignacion/listarAsignacionesHoy/`, `/asignacion/listarAsignacionesHoyVoluntaria/{id}` | — |
| GET | `/asignacion/consultar/{id}`, `/asignacion/duracionAbrazos/`, `/asignacion/listarCantidadAsignacionesPorDia/` | — |
| PUT | `/asignacion/id/{id}/` | Solo coordinadora |
| DELETE | `/asignacion/id/{id}/` | Solo coordinadora |
| POST | `/asignacion/resetearAbrazosColgados` | Sin body |

### Insumos
| Método | Path |
|--------|------|
| GET | `/insumo`, `/insumo/estadisticaInsumoCantidad`, `/insumo/proveedores`, `/insumo/id/{id}` |
| POST | `/insumo`, `/insumo/consultaMovimientos`, `/insumo/registrarMovimiento`, `/insumo/delete` |
| PUT | `/insumo/id/{id}/` |

### Proveedores
| Método | Path | Notas |
|--------|------|-------|
| GET | `/proveedor` | Listado activos |
| POST | `/proveedor` | Body: `{ nombre, descripcion?, Activa }` |
| PUT | `/proveedor/id/{id}` | — |
| POST | `/proveedor/delete` | Query `idProveedor` |

### Salas
| Método | Path | Notas |
|--------|------|-------|
| GET | `/sala` | Listado activas |
| POST | `/sala` | Body: `{ Nombre, Activa }` |
| PUT | `/sala/id/{id}` | — |
| POST | `/sala/delete` | Query `idSala` |

### Otros
| Método | Path |
|--------|------|
| GET | `/genericos/localidades` |
| GET | `/genericos/estadosCiviles` |
| GET | `/horario/dias` |
| POST | `/horario` |
| PUT | `/horario/{idVoluntaria}` |
| GET / POST / PUT | `/tarea/`, `/tarea/disponibles`, `/tarea/id/{id}`, `/tarea/delete` |
| GET / POST / PUT | `/visita/`, `/visita/bebe/{idBebe}`, `/visita/id/{id}`, `/visita/delete` |

> El Swagger completo está en `swagger-detail.json` y en `https://resimamis.onrender.com/` (puede haber cold start).

---

## Mapeo función API → saga

| Función `src/redux/api/index.js` | Saga |
|---|---|
| `postLogin`, `postUsuario`, `getUsuarios`, `getUsuarioById`, `putUsuarioById`, `postUsuarioDelete`, `putUsuarioContrasena`, `getVoluntariasSinUsuario` | `userSaga` |
| `getLocalities`, `getEstadosCiviles` | `genericsSaga` |
| `postMother`, `getMother`, `getMotherId`, `putMother`, `getStatisticsLocalities`, `getStatisticsAgeMother`, `postMotherDelete` | `motherSaga` |
| `postVolunteer`, `putVolunteer`, `getVolunteers`, `getVolunteersFree`, `getVolunteersStates`, `getVolunteerById`, `postVolunteerDelete`, `postAssistance`, `postAssistanceSalida`, `getAssistance`, `getAssistanceToday`, `getAssistanceHistoricas`, `getAssistanceReporte`, `postAssistanceDelete`, `getAsistenciasAll` | `volunteerSaga` |
| `postBaby`, `putBaby`, `getBabys`, `getBabysFree`, `getBabysDisponiblesAbrazo`, `getBabySalas`, `getBabyByDni`, `postBabyDelete` | `babySaga` |
| `postAssignmentGenerateTareas`, `postAssignmentGenerateTarea`, `getAssignmentById`, `postDetailAssignment`, `postStartHug`, `postEndHug`, `getDurationHug`, `getAssignmentToday`, `getAssignmentTodayById`, `getStatisticsAssignmentMonth`, `putAssignmentById`, `deleteAssignmentById`, `postResetAbrazosColgados` | `assignmentSaga` |
| `getSupplies`, `postSupplyCreate`, `getStatisticsSupplies`, `postSupplyConsultMovements`, `getSupplyProviders`, `postSupplyRegisterMovement`, `getSupplyById`, `putSupplyById`, `postSupplyDelete` | `supplySaga` |
| `getHorarioDias`, `postHorario`, `putHorario` | `horarioSaga` |
| `getTareas`, `getTareasDisponibles`, `getTareaById`, `postTarea`, `putTareaById`, `postTareaDelete` | `tareaSaga` |
| `getVisitas`, `getVisitasByBebe`, `getVisitaById`, `postVisita`, `putVisitaById`, `postVisitaDelete` | `visitaSaga` |
| `getProveedoresAll`, `postProveedor`, `putProveedor`, `postProveedorDelete` | `proveedorSaga` |
| `getSalasAll`, `postSala`, `putSala`, `postSalaDelete` | `salaSaga` |

---

## Deudas técnicas conocidas

- **JWT hardcodeado:** la clave secreta está duplicada en `Starup.cs` y `NegUsuarios.cs`. Mover a variable de entorno antes de cualquier auditoría de seguridad.
- **Credenciales en appsettings.json:** las credenciales de PostgreSQL de producción (Render) están commiteadas. En producción se sobreescriben con `DATABASE_URL`.
- **Sin DI propia:** cada repositorio instancia su propio `ApplicationDbContext` con `new`. Múltiples contextos por request no son ideal.
- **`ValidateLifetime` comentado:** los tokens JWT no expiran técnicamente.
- **`SaveChangesAsync()` sin `await`** en varios repositorios: potencial error silencioso.
- **`react-query` instalado pero inactivo:** el `QueryClientProvider` en `main.jsx` está comentado. No activar sin alineación del equipo.

---

## Dónde está cada cosa

| Qué buscar | Dónde |
|-----------|-------|
| Todas las llamadas HTTP del frontend | `src/redux/api/index.js` |
| Constantes de acción Redux | `src/redux/consts/actionTypes.js` |
| Base URL de la API | `VITE_URL_API` → `src/redux/interceptor/interceptor.js` |
| Validación formulario madre | `src/utils/motherFormValidation.js` |
| Validación formulario voluntaria | `src/utils/volunteerFormValidation.js` |
| Detección de coordinadora (front) | `src/utils/coordinadoraRole.js` |
| localStorage helpers | `src/utils/localStorage.js` |
| Normalización de listas de bebés | `src/utils/assignmentSelection.js` → `listBabysFromAbrazarResponse` |
| Normalización movimiento stock | `src/utils/supplyMovementPayload.js` → `normalizeEsEntradaForApi` |
| Tema y colores MUI | `src/helpers/theme.js` |
| Ancho máximo columna (444px) | `src/helpers/const/appLayout.js` → `APP_COLUMN_MAX_WIDTH_PX` |
| Swagger completo export | `swagger-detail.json` (raíz) |
| Inventario Swagger vs front | `docs/cobertura-swagger-frontend.md` |
| Pendientes técnicos | `docs/pendientes.md` |
| Reglas de contexto detalladas | `.cursor/rules/` (01 a 06) |
| Entidades EF Core | `resimamis/Datos/ApplicationDbContext.cs` |
| Algoritmo de asignación automática | `resimamis/Negocio/NegAsignacion.cs` → `generarAsiganaciones()` |
| Timezone Argentina (UTC-3) backend | `resimamis/Negocio/NegConversorFecha.cs` |
| Deploy backend | `resimamis/RENDER_DEPLOY.md` |
