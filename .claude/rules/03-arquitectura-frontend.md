# 03 — Arquitectura Frontend — Resimamis

## Stack oficial (no reemplazar sin alinear)

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
| Carrusel | `@trendyol-js/react-carousel` |

**Prohibido introducir:** Next.js, RTK Query, React Query (está en package.json pero el `QueryClientProvider` en main.jsx está comentado — no activar), Zustand, styled-components, redux-saga en proyectos futuros si no está ya.

## Estructura de carpetas

```
src/
├── main.jsx                  # Entry: Provider + ThemeProvider + BrowserRouter + RouterApp
├── routes/RouterApp.jsx      # Rutas con useRoutes
├── pages/                    # Un directorio por pantalla
├── components/
│   ├── atoms/                # Primitivos reutilizables: button, textfield, select, datePicker, loading, dialog...
│   ├── molecules/            # Combinaciones: labelInput, cardBaby, volunteerForm, motherForm...
│   ├── organisms/            # Secciones completas: assignedList, assignmentTask, activityTask, statistics...
│   ├── templates/            # Layouts por feature: tasks/, home/, login/, mother/, volunteer/...
│   └── common/               # Piezas transversales: GlobalSnackBar, PageScrollMain, Tabs, Loading...
├── redux/
│   ├── store/index.js        # createStore + sagaMiddleware
│   ├── consts/actionTypes.js # ~237 constantes de acción
│   ├── api/index.js          # TODAS las funciones HTTP (AxiosInstance)
│   ├── actions/              # Creadores de acción por dominio
│   ├── sagas/                # rootSaga + un archivo por dominio
│   ├── reducers/             # combineReducers + un archivo por dominio
│   └── interceptor/interceptor.js  # AxiosInstance + auth header + 401
├── utils/                    # Validaciones, formateos, helpers localStorage
├── hooks/                    # useStep, useResponsive, useNotify
├── helpers/
│   ├── theme.js              # baseTheme MUI, PALETTE
│   └── const/appLayout.js   # APP_COLUMN_MAX_WIDTH_PX = 444
└── assets/                   # Imágenes estáticas
```

## Patrón de página (page → template → organism → molecule → atom)

```
TasksPage.jsx  (page / controlador)
  └── TasksTemplate  (template — recibe todo como props)
        ├── activityTask/ (organism — asistencia + abrazo activo)
        ├── assignedList/ (organism — listado asignaciones del día)
        └── assignmentTask/ (organism — generación masiva, solo coordinadora)
              └── cardBabyHug/ (molecule) → atoms
```

- **`pages/`**: Controladores. `useDispatch` + `useSelector` + `useState`/`useEffect`. Despachan actions, arman handlers, pasan todo como props al template. Sin JSX de presentación pesado.
- **`templates/`**: Layout de la pantalla. No conectan Redux.
- **`organisms/`**: Secciones con lógica de sección completa.
- **`molecules/`**: Combinaciones de atoms.
- **`atoms/`**: Primitivos reutilizables. Si son interactivos, aceptan prop opcional `dataTestId`.
- **`common/`**: Componentes transversales (snackbar global, loading, tabs).

## Cómo agregar una feature completa

1. **`actionTypes.js`** → agregar `GET_X`, `SUCCESS_GET_X`, `ERROR_GET_X`, `CLEAR_X`, `CLEAR_X_WRITES`.
2. **`redux/api/index.js`** → agregar `const getX = (payload) => AxiosInstance.get('/x/', { params: payload })`.
3. **`redux/actions/xActions.js`** → agregar creadores de acción.
4. **`redux/sagas/xSaga.js`** → agregar worker + watcher:
```js
function* asyncGetX({ payload }) {
  try {
    const response = yield call(API.getX, payload)
    if (response) yield put({ type: SUCCESS_GET_X, response })
  } catch (error) {
    yield* showApiErrorToast(error)
    yield put({ type: ERROR_X, response: error })
  }
}
function* watchGetX() { yield takeLatest(GET_X, asyncGetX) }
```
5. **`redux/reducers/xReducer.js`** → manejar tipos con dispatch-table:
```js
const ACTIONS = {
  [SUCCESS_GET_X]: (state, action) => ({ ...state, x: action.response.data, loading: false }),
  [CLEAR_X_WRITES]: (state) => ({ ...state, postXSuccess: null, putXSuccess: null }),
}
export default (state = initialState, action) => (ACTIONS[action.type]?.(state, action) ?? state)
```
6. **`redux/reducers/index.js`** → si es reducer nuevo, agregar a `combineReducers`.
7. **`redux/sagas/index.js`** → agregar watcher al `all([...])` del rootSaga.
8. Crear page + template + organisms según el patrón.

## `CLEAR_*_WRITES` — limpieza granular (patrón clave)

No usar `CLEAR_MADRE` (vacía el listado). Usar `CLEAR_MADRE_WRITES` que solo limpia flags de escritura (`postMotherSuccess`, `putMotherSuccess`) sin vaciar `madres` ni `madreDetail`. Esto evita carreras de render cuando se hacen writes desde listados. Ver `motherReducer.js` como referencia.

## Reducers — store completo

```js
combineReducers({
  userReducer,       // token, login, datos de sesión, CRUD usuario admin
  volunteerReducer,  // asistencia, voluntarias libres/históricas, reporte, estados
  motherReducer,     // alta/edición madre, listados, estadísticas localidades/edades
  genericsReducer,   // localidades
  babyReducer,       // bebés, bebés libres (abrazar), salas
  assignmentReducer, // asignaciones, inicio/fin abrazo, estadísticas asignaciones
  supplyReducer,     // catálogo insumos, movimientos, proveedores
  toastReducer,      // snackbar global (GlobalSnackBar lo escucha)
  horarioReducer,    // días disponibles + alta horario voluntaria
})
```

## Layout global

- `AppScreenLayout`: columna centrada `maxWidth: 444px` (`APP_COLUMN_MAX_WIDTH_PX`). Constante en `helpers/const/appLayout.js`.
- `BottomNavigation`: tab bar fijo en la parte inferior.
- `GlobalSnackBar`: escucha `toastReducer`, muestra el snackbar global.
- `PageScrollMain`: padding inferior calculado para no tapar campos bajo la nav.
- FABs: se posicionan con `fabRightInsetInColumn` para alinearse dentro de la columna.

## Tema MUI (`src/helpers/theme.js`)

- Botón activo / primario: `#7A659B` (violeta/lavanda).
- Error: `#C53814`.
- Fondos: `#F6F6F6`, `#FAFAFA`.
- Font: Open Sans → Roboto → Helvetica.
- `createTheme(baseTheme)` en `main.jsx`.

## Manejo de errores

- `resolveApiErrorMessage(err)` en `utils/apiErrorMessage.js`: interpreta errores Axios + ASP.NET Core ProblemDetails.
- `stripValidationIndexPrefix`: quita el prefijo `"0: "` del ModelState de ASP.NET.
- `showApiErrorToast(error)` en sagas: llama a `dispatch(showToast(...))`.
- Nunca mostrar mensajes crudos del backend ni stack traces al usuario.

### Regla de display de errores de API (NO violar)

| Contexto | Mecanismo | Razón |
|----------|-----------|-------|
| **Login** | **Solo inline** — `<Typography role="alert">` en `LoginTemplate` | El usuario necesita verlo mientras reingresa la contraseña; un toast que desaparece solo no sirve en una pantalla de credenciales |
| **Todo el resto de la app** | **Solo toast** — `showApiErrorToast(error)` en la saga catch | Un único punto de feedback visible sin duplicar. Ya montado en `GlobalSnackBar` en `main.jsx`. |

**Implementación:**
- `asyncPostLogin` en `userSaga.js` es la **única saga** que omite `showApiErrorToast`. En su lugar pone `ERROR_LOGIN` con `{ data: { message } }` en el reducer para que `LoginPage` lo lea y muestre inline.
- Todas las demás sagas siempre llaman `yield* showApiErrorToast(error)` en el catch.
- Las páginas NO deben leer `reducer.error` para mostrarlo en un `DialogSuccess`, `Alert` ni ningún elemento inline — eso duplica el toast.

**Excepciones permitidas (no son errores de API):**
1. **Validación de campo (field-level)** — errores ModelState 400 con `errors: {}` de ASP.NET se mapean inline por campo via `mapAspNetErrorsToMotherFieldErrors` + `setFieldErrors`. La saga suprime el toast para estos casos (`shouldToastMotherWriteError`). Solo aplica a formularios madre/voluntaria.
2. **Validación client-side** — errores calculados en el frontend antes de enviar al backend (campos vacíos, formato inválido) pueden mostrarse inline o en `DialogSuccess`.

**Anti-patrones a evitar:**
```jsx
// ❌ MAL — duplica el toast ya disparado por la saga
useEffect(() => {
  if (reducer?.error != null) {
    setError(reducer.error)      // ← no hacer
    setStateForm('ERROR')        // ← no hacer
  }
}, [reducer?.error])

// ❌ MAL — Alert de error de API en template
{apiError && <Alert severity="error">{apiError}</Alert>}

// ✅ BIEN — la saga ya mostró el toast; solo parar el loading
useEffect(() => {
  if (reducer?.error != null) {
    dispatch(showLoading(false))
  }
}, [reducer?.error])
```

## Estilo de código

- ES6+: arrow functions, `const`/`let`, `?.`, `??`, template strings.
- `camelCase` (vars/fns), `PascalCase` (componentes). Handlers con prefijo `handle`.
- Imports: externos primero, luego locales. Early returns sobre anidación.
- Una responsabilidad por archivo: `api/index.js` solo funciones HTTP; `interceptor.js` solo Axios; `page.jsx` solo conecta datos↔template.

## Rutas declaradas en `RouterApp.jsx`

| Path | Página | Acceso |
|------|--------|--------|
| `/` | `RootRedirect` | pública |
| `/login` | `LoginPage` | pública (PublicRoute) |
| `/overview` | `HomePage` | privada |
| `/madres` | `ListMotherPage` | privada |
| `/madre` | `MotherPage` | privada |
| `/madre/perfil/:id` | `ProfileMotherPage` | privada |
| `/voluntaria` | `VolunteerPage` | privada |
| `/voluntaria/perfil/:id` | `ProfileVolunteerPage` | privada |
| `/voluntarias` | `ListVolunteerPage` | privada |
| `/bebes` | `ListBabysPage` | privada |
| `/tareas` | `TasksPage` | privada |
| `/estadisticas` | `StatisticsPage` | privada |
| `/insumos` | `SupplyPage` | privada |
| `/coordinacion` | `CoordinacionPage` | privada (check interno por coordinadora) |
| `/home` | redirect a `/overview` | — |
