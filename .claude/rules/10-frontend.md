---
paths:
  - "src/**"
  - "package.json"
  - "vite.config.js"
  - "index.html"
---

# 10 — Frontend

## Stack real (verificado contra `package.json`)

| Área | Tecnología |
|------|------------|
| Framework | React 18 |
| Bundler | Vite 4 |
| Lenguaje | JavaScript / JSX. **Sin TypeScript.** |
| Estado | Redux + Redux-Saga (ver `11-frontend-redux.md`) |
| HTTP | Axios 0.27 — instancia única en `src/redux/interceptor/interceptor.js` |
| Routing | react-router-dom v6 (`useRoutes`) |
| UI | MUI v5 + `@mui/icons-material` + `@mui/x-date-pickers` |
| Estilos | `@emotion/react` + `@emotion/styled` |
| Gráficos | chart.js + react-chartjs-2 |
| Fechas | **dayjs** |
| Carrusel | `@trendyol-js/react-carousel` |

**Ojo con estos hechos**, que suelen documentarse mal:

- **`date-fns` NO está instalado.** Solo `dayjs`. No lo importes.
- **`redux` no está declarado en `package.json`** aunque `store/index.js` y `reducers/index.js`
  lo importan directamente; funciona por hoisting transitivo. Es frágil: si tocás dependencias,
  declaralo.
- **`react-query` está instalado y sus imports siguen vivos en `main.jsx`**, pero el
  `QueryClientProvider` está comentado. No activarlo sin alinear con el equipo.
- `faker@5.5.3` y `@types/react*` están instalados sin uso.

**No introducir:** Next.js, RTK Query, React Query, Zustand, styled-components, Tailwind,
react-router-dom v5.

## Scripts

```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # vite build + copia web.config a dist/ para IIS
npm run preview  # sirve el build localmente
```

No hay `lint`, `format`, `test` ni `typecheck` — **no existe ESLint, Prettier, TS ni tests**.
No hay CI. Ver `docs/deuda-tecnica.md`.

## Variables de entorno

Solo dos, y son las únicas `import.meta.env.*` del código:

| Variable | Dónde | Uso |
|----------|-------|-----|
| `VITE_URL_API` | `redux/interceptor/interceptor.js` | `baseURL` de Axios |
| `VITE_COORDINADORA_ID_ROL` | `utils/coordinadoraRole.js` | fallback numérico del rol |

## Estructura y Atomic Design

```
src/
├── main.jsx          Provider → ThemeProvider → BrowserRouter → GlobalSnackBar + AppScreenLayout → RouterApp
├── routes/           RouterApp + PrivateRoute / PublicRoute / RootRedirect
├── pages/            controladores: useDispatch + useSelector, arman handlers y pasan props
├── components/
│   ├── atoms/        primitivos (loading, button, dialog, select, datePicker…)
│   ├── molecules/    combinaciones (labelInput, cardBabyHug, motherForm, Footer…)
│   ├── organisms/    secciones con lógica (activityTask, assignedList, informationHug…)
│   ├── templates/    layout por feature; NO conectan Redux
│   └── common/       transversales (AppScreenLayout, PageHeader, GlobalSnackBar, ErrorBoundary…)
├── redux/            ver 11-frontend-redux.md
├── utils/            validaciones, normalizadores de payload, helpers de localStorage
├── hooks/            useStep, useResponsive, useNotify  ← los tres SIN consumidores
└── helpers/          theme.js + const/appLayout.js
```

**Regla de capas:** `page` → `template` → `organism` → `molecule` → `atom`.
Solo `pages/` conecta Redux. Los templates reciben todo por props.

> No existe prop `dataTestId` en los atoms, pese a lo que decía documentación vieja.

## Rutas (`src/routes/RouterApp.jsx`)

Todo envuelto en `ErrorBoundary` (se resetea por `location.key`) + `Suspense`.

| Path | Página | Carga | Acceso |
|------|--------|-------|--------|
| `/` | `RootRedirect` | eager | pública |
| `/login` | `LoginPage` | eager | `PublicRoute` |
| `/home` | `<Navigate to="/overview">` | — | — |
| `/overview` | `HomePage` | eager | privada |
| `/madres` `/madre` `/madre/perfil/:id` | listado / alta / perfil madre | eager | privada |
| `/voluntaria` `/voluntarias` `/voluntaria/perfil/:id` | alta / listado / perfil voluntaria | eager | privada |
| `/bebes` | `ListBabysPage` | eager | privada |
| `/bebe/perfil/:id` | `ProfileBabyPage` | **lazy** | privada |
| `/tareas` | `TasksPage` | eager | privada (sección coord.) |
| `/estadisticas` | `StatisticsPage` | **lazy** | privada |
| `/insumos` | `SupplyPage` | **lazy** | privada (acciones coord.) |
| `/coordinacion` | `CoordinacionPage` | **lazy** | privada (guard in-page, ver `02-auth.md`) |
| `/mi-perfil` | `MyProfilePage` | **lazy** | privada |

**No hay ruta catch-all `*`** → una URL inválida renderiza `null` dentro del layout.

## Layout global

- `AppScreenLayout` (en `main.jsx`): columna centrada `maxWidth: 444px`
  (`APP_COLUMN_MAX_WIDTH_PX` en `helpers/const/appLayout.js`), fondo `#ede8f5` en `sm+`.
  Monta `GlobalRouteTransitionLoader` (overlay de 350 ms por cambio de ruta).
- `GlobalSnackBar` escucha `toastReducer`.
- `PageScrollMain`: `<main>` con `overflowY:auto` + padding inferior para no tapar la nav.
- `Footer` (tab bar, `BottomNavigation` violeta `#8F00FF`, seleccionado `#FFEB3B`): 4 tabs —
  **Inicio → `/home`** (que redirige a `/overview`), **Tareas** `/tareas`,
  **Estadísticas** `/estadisticas`, **Perfil** `/mi-perfil`.
  Se importa **por página** (10 páginas lo montan), no vive en el layout global.

## Tema (`src/helpers/theme.js`)

Botón activo/primario `#7A659B`, error `#C53814`, fondos `#F6F6F6`/`#FAFAFA`,
font Open Sans → Roboto → Helvetica.

> `palette.primary.main` está seteado en `'#transparent'`, que **no es un color válido**.
> Si tocás el tema, corregilo.

## Regla de display de errores de API (NO violar)

| Contexto | Mecanismo |
|----------|-----------|
| **Login** | **Solo inline** — `<Typography role="alert">` en `LoginTemplate` |
| **Todo el resto** | **Solo toast** — `showApiErrorToast(error)` en el `catch` de la saga |

`asyncPostLogin` es la **única** saga que omite `showApiErrorToast`: pone `ERROR_LOGIN` con
`{ data: { message } }` para que `LoginPage` lo lea y lo muestre inline.

Las páginas **no** deben leer `reducer.error` para mostrarlo en un `Alert` o `DialogSuccess`:
eso duplica el toast.

```jsx
// ❌ MAL — duplica el toast que ya disparó la saga
useEffect(() => {
  if (reducer?.error != null) { setError(reducer.error); setStateForm('ERROR'); }
}, [reducer?.error]);

// ✅ BIEN — la saga ya avisó; acá solo se corta el loading
useEffect(() => {
  if (reducer?.error != null) dispatch(showLoading(false));
}, [reducer?.error]);
```

**Excepciones (no son errores de API):**
1. **Validación de campo**: errores ModelState 400 de ASP.NET se mapean inline por campo con
   `mapAspNetErrorsToMotherFieldErrors`; la saga suprime el toast en ese caso.
2. **Validación client-side** (campos vacíos, formato) puede ir inline o en `DialogSuccess`.

`resolveApiErrorMessage(err)` en `utils/apiErrorMessage.js` interpreta errores Axios y
ProblemDetails de ASP.NET. Nunca mostrar mensajes crudos del backend ni stack traces.

## Patrones de Dialog

| Patrón | Uso | `PaperProps.sx` |
|--------|-----|-----------------|
| Full-screen | Finalizar abrazo, detalle de asignación, Coordinación | `height:'100dvh', maxHeight:'100dvh', m:0, borderRadius:0, display:'flex', flexDirection:'column', overflow:'hidden'` |
| Bottom-sheet | Cambio de contraseña, formularios cortos | `mb:0, mt:'auto', borderRadius:'20px 20px 0 0', maxHeight:'90dvh', display:'flex', flexDirection:'column'` + `sx={{ '& .MuiDialog-container': { alignItems:'flex-end' } }}` |

`DialogContent` con `pt: 2.5` — **no** `pt: 1`: MUI recorta las floating labels de los
`TextField` outlined con padding chico.

## Estilo de código

ES6+, arrow functions, `?.` / `??`, template strings. `camelCase` para vars/fns,
`PascalCase` para componentes, handlers con prefijo `handle`. Imports externos primero.
Early returns sobre anidación. Una responsabilidad por archivo.
