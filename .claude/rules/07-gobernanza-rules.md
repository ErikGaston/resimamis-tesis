# 07 — Gobernanza de Rules — Resimamis

Las rules en `.claude/rules/` son la **fuente de verdad** del proyecto para Claude Code. Actualizar la rule correspondiente **en la misma sesión** del cambio.

> Las rules en `.cursor/rules/*.mdc` tienen más detalle y sirven como referencia extensa (Cursor las carga automáticamente). Claude Code no las lee, por eso existen estas en `.claude/rules/`. Mantener ambas sincronizadas ante cambios estructurales.

## Mapeo cambio → rule

| Cambio en el código | Rule a actualizar |
|--------------------|-------------------|
| Nueva función en `redux/api/index.js` o nuevo saga | `06-endpoints-api.md` + `CLAUDE.md` (mapeo) |
| Nuevo flujo de auth, localStorage, interceptor o rol | `02-auth.md` |
| Nueva ruta en `RouterApp.jsx` o nuevo layout/guard | `03-arquitectura-frontend.md` + `CLAUDE.md` (rutas) |
| Nuevo atom/molecule/organism/template reutilizable | `03-arquitectura-frontend.md` |
| Nuevo Dialog pattern o cambio de pattern existente | `03-arquitectura-frontend.md` |
| Cambio en flujo de asistencia, asignación, abrazo, insumos | `04-flujo-operativo.md` |
| Cambio en CoordinacionPage (tabs, CRUD) | `04-flujo-operativo.md` + `06-endpoints-api.md` |
| Cambio de stack, dependencias clave o estructura de carpetas | `03-arquitectura-frontend.md` + `CLAUDE.md` raíz |
| Nuevo reducer/saga (nuevo dominio) | `03-arquitectura-frontend.md` (combineReducers) + `06-endpoints-api.md` (mapeo) |
| Nuevo endpoint, migración EF Core o entidad backend | `05-backend.md` + `06-endpoints-api.md` |
| Nueva entidad de negocio, actor o regla de negocio | `01-negocio.md` |
| Cambio en auth del backend (JWT, roles, CORS) | `02-auth.md` + `05-backend.md` |
| Nueva ruta en Footer (tab bar) | `03-arquitectura-frontend.md` + `CLAUDE.md` (rutas) |

## Qué actualizar

- **Eliminar** referencias a código que ya no existe.
- **Agregar** el nuevo patrón/ruta/hook/componente con ejemplo mínimo.
- **Corregir** nombres de archivos/paths si cambiaron.
- **No duplicar** info entre rules: cada concepto vive en una sola.

## Calidad de una rule

Está al día si: (1) un agente nuevo puede leerla y actuar igual que el código real; (2) no menciona tecnologías/patrones eliminados; (3) los ejemplos son coherentes con el stack real (React 18 + Vite + Redux + Redux-Saga + MUI v5 + ASP.NET Core .NET 8 + EF Core + PostgreSQL).

## Cierre de tarea

No dar por terminada una tarea que toca arquitectura/endpoints/negocio sin actualizar la rule correspondiente. Ante cambio grande que no entra en la sesión, dejar nota en `docs/pendientes.md`.

## Nota sobre el archivo de nombres

Los archivos `04-ordenes-checkout.md` y `05-data-testid.md` conservan sus nombres originales (del proyecto anterior) por compatibilidad, pero su contenido es sobre **flujo operativo** y **backend** respectivamente. El índice en `00-index.md` los referencia con sus nombres reales de contenido.
