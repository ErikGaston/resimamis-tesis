---
paths:
  - ".claude/**"
  - "docs/**"
  - "CLAUDE.md"
---

# 90 — Gobernanza de rules y documentación

Las rules de `.claude/rules/` son la fuente de verdad para Claude Code. Se actualizan
**en la misma sesión** del cambio que las invalida.

## Presupuesto de contexto

Las rules **sin** `paths:` se cargan en cada sesión. Mantener ese conjunto chico:

| Siempre cargado | Techo sugerido |
|-----------------|----------------|
| `CLAUDE.md` | 200 líneas |
| `00-index.md` + `01-negocio.md` + `02-auth.md` | ~250 líneas entre las tres |

Todo lo demás debe llevar `paths:` para cargar solo cuando se toque esa zona del código.
Antes de agregar una rule nueva sin `paths:`, preguntarse si no puede scopearse.

> Los `@imports` de `CLAUDE.md` **no ahorran contexto**: el archivo importado se expande
> igual al arrancar la sesión. Para ahorrar, usar `paths:`.

## Mapeo cambio → qué actualizar

| Cambio en el código | Actualizar |
|--------------------|------------|
| Función nueva en `redux/api/index.js` | `30-api-contract.md` |
| Saga / reducer / action / actionTypes | `11-frontend-redux.md` |
| Ruta nueva en `RouterApp.jsx` | `10-frontend.md` + `CLAUDE.md` |
| Atom/molecule/organism/template reutilizable | `10-frontend.md` |
| Patrón de Dialog nuevo o modificado | `10-frontend.md` |
| Login, token, interceptor, guard, rol | `02-auth.md` |
| Stack, `package.json`, estructura de carpetas | `10-frontend.md` + `CLAUDE.md` |
| Endpoint, controller, servicio `Neg*` o repositorio | `20-backend.md` + `30-api-contract.md` |
| Migración EF Core o entidad | `20-backend.md` + `01-negocio.md` si cambia el dominio |
| Auth del backend (JWT, roles, CORS) | `02-auth.md` + `20-backend.md` |
| Actor, regla o validación de negocio | `01-negocio.md` |
| Funcionalidad visible nueva | `docs/estado-del-sistema.md` |
| Deuda detectada o saldada | `docs/deuda-tecnica.md` |
| Endpoint integrado o descartado en el front | `docs/cobertura-api.md` |

## Calidad de una rule

Está al día si: (1) un agente nuevo la lee y actúa igual que el código real; (2) no menciona
como vigente nada que se haya eliminado; (3) los paths y firmas coinciden con el código.

**Verificar antes de documentar.** Buena parte de la documentación vieja de este repo afirmaba
cosas que el código contradecía (un patrón de saga con `watch*` que no existe, `date-fns` como
dependencia, el bloque 401 "comentado", un redirect en `CoordinacionPage`). Si vas a escribir
un hecho en una rule, leelo antes en el código.

## Cierre de tarea

No dar por terminada una tarea que toca arquitectura, endpoints o negocio sin actualizar la
rule correspondiente. Si el cambio es demasiado grande para la sesión, dejar nota en
`docs/deuda-tecnica.md`.

El hook `PostToolUse` `.claude/hooks/rules-reminder.mjs` avisa qué rule revisar según el
archivo tocado. Si agregás un mapeo cambio→rule acá, agregalo también en `RULES_MAP` del hook.

## Skills

Cada skill instalada aporta su `name` + `description` al contexto de **toda** sesión, y orienta
a Claude hacia el stack que describe. Una skill que asume otro stack no es neutra: empuja
activamente hacia patrones que este repo prohíbe.

| Skill | Origen | Para qué |
|-------|--------|----------|
| `sync-api-contract` | del proyecto | diff entre `resimamis/Controllers/` y `src/redux/api/index.js` |
| `nueva-feature-redux` | del proyecto | los 7 pasos para cablear una feature Redux completa |
| `ui-ux-pro-max` | terceros | base de datos de diseño (paletas, tipografías, layouts) |
| `premium-ui-design` | terceros | sistemas de diseño y micro-interacciones sobre Emotion |

Las dos de terceros son **material de referencia de diseño**, y sesgan hacia Tailwind, shadcn/ui
y Next.js. Este proyecto usa **MUI v5 + Emotion, sin Tailwind y sin Next.js**: tomar de ellas
criterio visual (color, jerarquía, espaciado, tipografía), nunca la implementación.

En ago 2026 se eliminaron `engineering-team/` (code-reviewer, playwright-pro, senior-qa,
tdd-guide, senior-frontend-react), `senior-frontend-react` y `unit-tests`: describían
Next.js, TypeScript, Tailwind, Jest y RTK Query — nada de eso existe acá — y `unit-tests`
apuntaba directamente a otro repositorio. `playwright-pro` además era un plugin completo
vendorizado dentro de `skills/`. Para revisar código está el agente `revisor-resimamis`, que
sí conoce las convenciones reales.

**Antes de instalar una skill nueva:** verificar que su stack coincida con el del proyecto. Si
solo sirve una parte, conviene escribir una skill propia y corta antes que vendorizar un árbol
de terceros. Un plugin se instala como plugin, no se copia dentro de `skills/`.

## Estructura de `.claude/`

```
.claude/
├── settings.json         permisos + hooks compartidos (se versiona)
├── settings.local.json   personal, gitignored
├── CLAUDE.md → no usar   (el del proyecto vive en la raíz: ./CLAUDE.md)
├── rules/                estas rules
├── agents/               subagentes del proyecto
├── skills/               skills invocables
└── hooks/                scripts de hooks
```
