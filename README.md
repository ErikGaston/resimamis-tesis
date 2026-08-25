# Resimamis — frontend (tesis)

Aplicación web **React 18 + Vite + Redux/Redux-Saga + MUI v5** para la gestión de un programa
de **abrazos de bebé** (método mamá canguro) en una Unidad de Neonatología: madres, bebés,
voluntarias, asignación de abrazos, asistencias e insumos.

Mobile-first: la UI se dibuja en una columna de 444 px pensada para tablet o celular dentro
del hospital.

## Requisitos

- **Node.js** 18+ (LTS recomendado)
- **npm** 9+
- Para el backend: **.NET 8 SDK** y una base **PostgreSQL**

## Estructura del repositorio

```
resimamis-tesis/
├── src/          Frontend React + Vite (este repo)
├── resimamis/    Backend ASP.NET Core — repositorio Git INDEPENDIENTE
├── docs/         Estado del sistema, deuda técnica, cobertura de API
└── .claude/      Configuración de Claude Code: rules, skills, hooks
```

### El backend es un repo aparte

`resimamis/` no se versiona desde este repositorio: es un clon de
[`maurogab2018/resimamis`](https://github.com/maurogab2018/resimamis) que vive dentro de esta
carpeta y está en `.gitignore`. **Un `git clone` de este repo no lo trae.**

```bash
git clone https://github.com/maurogab2018/resimamis.git resimamis
cd resimamis && git pull        # para actualizarlo
```

## Variables de entorno

Copiá `.env.example` a `.env` y definí:

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `VITE_URL_API` | Sí | URL base del backend, con el prefijo que corresponda |
| `VITE_COORDINADORA_ID_ROL` | No | Id numérico del rol coordinadora, como fallback si el login no devuelve un `rol` de texto reconocible |

> `.env` está en `.gitignore`. No commitear secretos.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
```

Backend:

```bash
cd resimamis
dotnet run         # http://localhost:5110 — Swagger UI en la raíz
```

## Build de producción

```bash
npm run build      # vite build + copia web.config a dist/ (compatible Windows/Unix)
npm run preview    # sirve el build localmente
```

Hay dos targets de deploy: **IIS** (vía `web.config`) y **Vercel** (vía `vercel.json`, con
rewrite SPA a `index.html`).

## Tests

**No hay suite configurada** — ni unitaria, ni E2E, ni CI. Si se agrega, documentar el comando
acá. Ver [`docs/deuda-tecnica.md`](docs/deuda-tecnica.md).

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [`CLAUDE.md`](CLAUDE.md) | Arranque rápido: comandos, convenciones, trampas conocidas |
| [`.claude/rules/`](.claude/rules/) | Fuente de verdad técnica (índice en `00-index.md`) |
| [`docs/estado-del-sistema.md`](docs/estado-del-sistema.md) | Qué hace hoy el sistema |
| [`docs/deuda-tecnica.md`](docs/deuda-tecnica.md) | Deuda priorizada de front y back |
| [`docs/cobertura-api.md`](docs/cobertura-api.md) | Endpoints del backend vs consumidos por el front |

El contrato de la API **no se versiona como JSON**: la fuente de verdad es el código de
`resimamis/Controllers/`. Para explorarlo en vivo, el Swagger UI del backend.

## Contribución

Ramas por feature y mensajes de commit claros. Si un cambio toca arquitectura, endpoints o
reglas de negocio, actualizar la rule correspondiente de `.claude/rules/` **en la misma
sesión** (mapeo en `.claude/rules/90-gobernanza.md`).
