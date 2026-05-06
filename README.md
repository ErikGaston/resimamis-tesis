# Resimamis — frontend (tesis)

Aplicación web **React 18** + **Vite** + **Redux / Redux-Saga** + **Material UI** para la gestión de madres, voluntarias, bebés, asignación de abrazos, asistencias e insumos, integrada con la API documentada en OpenAPI (Swagger).

## Requisitos

- **Node.js** 18+ (recomendado LTS)
- **npm** 9+

## Variables de entorno

Copiá `.env.example` a `.env` y definí al menos:

- `VITE_URL_API` — URL base del backend (incluye prefijo si corresponde, p. ej. `https://.../`).
- Opcional: `VITE_COORDINADORA_ID_ROL` — id numérico del rol coordinadora si el login no envía texto `rol` reconocible.

## Instalación y desarrollo

```bash
npm install
npm run dev
```

La app suele levantarse en `http://localhost:5173`.

## Build de producción

```bash
npm run build
```

El script ejecuta `vite build` y copia `web.config` al directorio `dist/` con Node (compatible con Windows y Unix).

## Estructura útil

- `src/redux/api/index.js` — cliente HTTP (Axios) y funciones por endpoint.
- `src/redux/sagas/` — efectos secundarios y llamadas API.
- `src/pages/` — páginas por ruta.
- `docs/` — inventario Swagger vs front (`cobertura-swagger-frontend.md`), pendientes y tareas de validación.

## Documentación

- Contrato API y matrices de cobertura: carpeta **`docs/`** y reglas en **`.cursor/rules/`** (p. ej. `04-endpoints-backend.mdc`, `06-swagger-contrato-api.mdc`).

## Tests

No hay suite E2E ni unitaria configurada en este repositorio; si se agrega, documentar el comando aquí (p. ej. Vitest / Playwright).

## Contribución

Usar ramas por feature, mensajes de commit claros y mantener alineados `swagger-detail.json`, `redux/api` y los documentos de `docs/` cuando cambie el contrato HTTP.
