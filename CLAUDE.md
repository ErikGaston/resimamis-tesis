# CLAUDE.md — Resimamis

Sistema de gestión operativa para un programa de **abrazos de bebé** (método mamá canguro /
piel a piel) en una Unidad de Neonatología. Voluntarias abrazan bebés prematuros bajo la
coordinación de una coordinadora. App de campo **mobile-first** (columna de 444 px) para
tablet/celular dentro de un hospital.

No es un marketplace: no tiene pagos, carrito ni e-commerce.

## Dónde está el detalle

Este archivo es el arranque rápido. El detalle vive en `.claude/rules/`, que se cargan solas
según el archivo que estés tocando (ver `.claude/rules/00-index.md`).

| Necesitás… | Leé |
|-----------|-----|
| Dominio, actores, validaciones | `.claude/rules/01-negocio.md` |
| Login, JWT, roles, guards | `.claude/rules/02-auth.md` |
| Stack, rutas, Atomic Design, dialogs | `.claude/rules/10-frontend.md` |
| Sagas, reducers, cómo agregar una feature | `.claude/rules/11-frontend-redux.md` |
| Backend .NET, capas, migraciones | `.claude/rules/20-backend.md` |
| Contrato HTTP y endpoints | `.claude/rules/30-api-contract.md` |
| Qué hace hoy el sistema | `docs/estado-del-sistema.md` |
| Deuda técnica priorizada | `docs/deuda-tecnica.md` |

## Estructura

```
resimamis-tesis/
├── src/          FRONTEND — React 18 + Vite + Redux + Redux-Saga + MUI v5
├── resimamis/    BACKEND — ASP.NET Core .NET 8 + EF Core + PostgreSQL
├── docs/         documentación de producto y deuda
└── .claude/      rules, skills, agents, hooks, settings
```

**El backend es un repositorio Git independiente** (`github.com/maurogab2018/resimamis`)
clonado dentro de `resimamis/`, ignorado por el repo del frontend. Tiene su propio historial:
para actualizarlo, `cd resimamis && git pull`. Un `git clone` del frontend **no** lo trae.

## Comandos

```bash
# Frontend (raíz)
npm install
npm run dev        # http://localhost:5173
npm run build      # vite build + copia web.config a dist/ para IIS
npm run preview

# Backend
cd resimamis
dotnet run         # http://localhost:5110 — Swagger en /
dotnet build
dotnet ef migrations add NombreMigracion
dotnet ef database update
```

**No hay lint, format, tests ni CI** en ninguno de los dos lados. No existe ESLint, Prettier,
TypeScript, Vitest, Playwright ni `.github/workflows`. No inventes un `npm test`.

## Convenciones que no se derivan del código

### Comentarios

**No agregar comentarios innecesarios.** El código debe explicarse solo: nombres claros y
funciones cortas antes que comentarios. Comentar únicamente lo que es genuinamente difícil de
entender leyendo el código — el *por qué* de una decisión no obvia, un workaround, una
restricción externa. Nunca comentarios que repiten lo que la línea ya dice
(`// incrementa i`, `// setea el estado`), ni encabezados decorativos, ni bloques de código
comentado. Al editar código existente, borrar los comentarios que sobran.

### Errores de API

- **Login:** solo inline (`<Typography role="alert">` en `LoginTemplate`).
- **Todo el resto:** solo toast (`showApiErrorToast(error)` en el `catch` de la saga).

`asyncPostLogin` es la única saga que omite `showApiErrorToast`. Las páginas no deben leer
`reducer.error` para mostrarlo en un `Alert` o `DialogSuccess`: duplica el toast.
Detalle y excepciones en `.claude/rules/10-frontend.md`.

### Redux

- Solo `pages/` conecta Redux. Los templates reciben todo por props.
- Tras una escritura usar `CLEAR_*_WRITES`, nunca `CLEAR_*` completo: vaciar el slice pierde
  los listados y produce carreras de render.
- Las sagas de dominio encadenan `takeLatest` en el default export. **No existen funciones
  `watch*`**; `all([...])` se usa solo en `rootSaga`.

### Backend

- **Baja lógica universal:** nada se borra físicamente. `POST /api/X/delete` setea `idEstado`
  al estado "Eliminado" del ámbito correspondiente. Proveedores y salas usan un flag `Activa`.
- **El envelope no tiene campo `success`.** Éxito → `{ data }` con HTTP 200. Error →
  `{ message, errors }` con status semántico (400/401/403/404/409/500). El front decide
  `try`/`catch` por el status HTTP. **Login es la excepción: responde plano, sin envelope.**
- **Que la UI esconda un botón no significa que el endpoint esté protegido.** Solo 8
  operaciones validan rol en el servidor; el resto solo pide un JWT válido.

### Contrato HTTP

La fuente de verdad es el **código del backend** en `resimamis/Controllers/` y
`resimamis/Entidades/`, no lo que ya esté en `src/redux/api/index.js`. Antes de crear o
modificar una llamada, leer el controller. La skill `sync-api-contract` automatiza el diff.

## Trampas conocidas

Cosas que la documentación vieja afirmaba mal y conviene no repetir:

- **`date-fns` no está instalado.** Solo `dayjs`.
- **`redux` no está declarado en `package.json`** aunque se importa directamente; funciona por
  hoisting transitivo.
- **El bloque 401 del interceptor está activo**, no comentado.
- **`CoordinacionPage` no redirige** si no sos coordinadora: muestra un `Alert` + botón.
- **El tab "Inicio" del Footer navega a `/home`**, que redirige a `/overview`.
- **No existe prop `dataTestId`** en los atoms.
- `palette.primary.main` está en `'#transparent'`, que no es un color válido.
- El slice `tarea` está cableado en el store y el `rootSaga` pero **ninguna página lo usa**.
- `react-query` está instalado y sus imports siguen vivos en `main.jsx`, pero el
  `QueryClientProvider` está comentado. No activarlo sin alinear con el equipo.

**No introducir:** Next.js, RTK Query, React Query, Zustand, styled-components, Tailwind,
react-router-dom v5, TypeScript.

## Seguridad

- `.env` **está commiteado en el historial de git** (deuda abierta, ver `docs/deuda-tecnica.md`).
  No agregar secretos nuevos a archivos versionados.
- La clave JWT está hardcodeada y duplicada en `Starup.cs` y `NegUsuarios.cs`.
- `appsettings.json` tiene credenciales de PostgreSQL commiteadas; en producción las pisa
  `DATABASE_URL`.
- El hook `repo-guard` bloquea escrituras sobre `.env*`, lockfiles y `appsettings*.json`.

## Gobernanza

Si tu cambio invalida una rule, actualizala **en la misma sesión**. El mapeo cambio→rule está
en `.claude/rules/90-gobernanza.md`, y el hook `rules-reminder` avisa cuál revisar según el
archivo que tocaste.
