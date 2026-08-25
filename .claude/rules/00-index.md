# 00 — Índice de rules

Fuente de verdad para Claude Code en este repo. Un concepto vive en **una sola** rule.

## Cómo se cargan

Las rules sin frontmatter `paths:` se cargan **en cada sesión**. Las que tienen `paths:` se
cargan **solo cuando Claude toca archivos que matchean** — así el contexto no se llena con
detalle de backend mientras se trabaja en el frontend.

| Rule | Carga | Cubre |
|------|-------|-------|
| `00-index.md` | siempre | este índice |
| `01-negocio.md` | siempre | dominio: actores, flujo del día, entidades, validaciones |
| `02-auth.md` | siempre | JWT, localStorage, interceptor, rol coordinadora |
| `10-frontend.md` | `src/**`, `package.json`, `vite.config.js` | stack React/Vite, Atomic Design, rutas, layout, errores, dialogs |
| `11-frontend-redux.md` | `src/redux/**` | patrón real de saga/reducer/action, `CLEAR_*_WRITES`, cómo agregar una feature |
| `20-backend.md` | `resimamis/**` | ASP.NET Core, capas, DI, estados, migraciones, deploy |
| `30-api-contract.md` | `src/redux/api/**`, `src/redux/sagas/**`, `resimamis/Controllers/**` | contrato HTTP: endpoints, mapeo API→saga, qué no consume el front |
| `90-gobernanza.md` | `.claude/**`, `docs/**`, `CLAUDE.md` | cuándo actualizar rules y docs |

## Qué es el proyecto

**Resimamis** gestiona un programa de **abrazos de bebé** (método mamá canguro / piel a piel)
en una Unidad de Neonatología (NEO). Voluntarias abrazan bebés prematuros bajo la coordinación
de una coordinadora. App de campo **mobile-first** (columna de 444 px) para tablet/celular
dentro de un hospital.

No es un marketplace: no tiene pagos, carrito ni e-commerce.

**Repo:** frontend React/Vite en `src/` + backend ASP.NET Core en `resimamis/`
(repositorio Git independiente, ver `20-backend.md`).

## Documentación complementaria

| Archivo | Contenido |
|---------|-----------|
| `CLAUDE.md` | arranque rápido: qué es, comandos, convenciones que no se derivan del código |
| `docs/estado-del-sistema.md` | qué hace hoy el sistema, funcionalidad por funcionalidad |
| `docs/deuda-tecnica.md` | inventario de deuda front + back, priorizado |
| `docs/cobertura-api.md` | endpoints del backend vs consumidos por el frontend |

> El contrato de API **no se versiona como JSON**. La fuente de verdad es el código del
> backend en `resimamis/Controllers/`. Para el diff automático, usar la skill
> `sync-api-contract`.

> Historia: las rules previas a jul 2026 describían "Universal Market" (marketplace B2C, otro
> proyecto). Ignorar cualquier referencia a RTK Query, Next.js, MercadoPago, PUDO, `is_staff`.
