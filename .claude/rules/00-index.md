# 00 — Índice de Rules — Resimamis

Rules de Resimamis en `.claude/rules/`. Fuente de verdad para Claude Code en este repo.
Documentación extensa adicional en `.cursor/rules/` (Cursor las carga; Claude Code no — por eso existen estas).

| Rule | Cubre |
|------|-------|
| [01-negocio](01-negocio.md) | Dominio: actores (voluntaria/coordinadora/madre/bebé), flujo del día, entidades, validaciones de negocio |
| [02-auth](02-auth.md) | JWT Bearer, localStorage, interceptor 401, rol coordinadora, guards de ruta |
| [03-arquitectura-frontend](03-arquitectura-frontend.md) | Stack React 18 + Vite + Redux + Redux-Saga + MUI v5, estructura, patrón page→template, cómo agregar features, ProfileTemplate props, MyProfilePage, Footer tabs, patrones Dialog |
| [04-flujo-operativo](04-ordenes-checkout.md) | Asistencia, asignaciones, abrazos (iniciar/finalizar/detalle, InformationHug Dialog), CardBabyHug, insumos, algoritmo auto, CoordinacionPage 6 tabs |
| [05-backend](05-data-testid.md) | ASP.NET Core .NET 8 + EF Core + PostgreSQL, capas, convenciones HTTP, estados, baja lógica, deploy |
| [06-endpoints-api](06-endpoints-backend.md) | Referencia completa de endpoints REST + mapeo función API → saga (incluye proveedores, salas, visitas, tareas, horario PUT, usuario/contrasena) |
| [07-gobernanza-rules](07-gobernanza-rules.md) | Cuándo y cómo actualizar estas rules; mapeo cambio→rule |

## Qué es este proyecto

**Resimamis** gestiona un programa de **abrazos de bebé** (método mamá canguro / piel a piel) en una Unidad de Neonatología (NEO). Voluntarias abrazan bebés prematuros bajo la coordinación de una coordinadora.

**Repo:** frontend (React/Vite) en `src/` + backend (ASP.NET Core) en `resimamis/`.

> **ATENCIÓN:** Las rules que existían aquí antes de jul 2026 describían "Universal Market" (marketplace B2C — proyecto completamente distinto). Ignorar cualquier referencia de ese contexto: RTK Query, Next.js, MercadoPago, Pago360, PUDO, Shipnow, cookie `token`, `is_staff`, dashboard 2FA, órdenes de marketplace. Nada de eso pertenece a este repo.
