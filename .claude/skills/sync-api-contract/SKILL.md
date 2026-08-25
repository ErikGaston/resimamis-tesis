---
name: sync-api-contract
description: Contrasta el contrato HTTP real del backend (código fuente en resimamis/Controllers/) contra lo que consume el frontend en src/redux/api/index.js, y reporta endpoints nuevos, rotos o sin consumir. Usar antes de crear o modificar cualquier llamada al backend, al empezar una feature que integre la API, o cuando se sospecha que la documentación de endpoints quedó vieja.
argument-hint: "[controller opcional, ej: Dashboard]"
---

# Sincronizar el contrato de API

La fuente de verdad del contrato es **el código del backend**, no un export de Swagger ni lo
que ya esté escrito en `src/redux/api/index.js`.

| Recurso | Ubicación |
|---------|-----------|
| **Contrato real** | `resimamis/Controllers/*.cs` |
| DTOs de request/response | `resimamis/Entidades/` |
| Reglas de negocio y validaciones | `resimamis/Negocio/Neg*.cs` |
| Swagger vivo (opcional, para probar) | `https://resimamis.onrender.com/` (cold start ~2 min) |
| Consumo del frontend | `src/redux/api/index.js` |

`resimamis/` es un repo Git independiente. Si hace rato que no se actualiza, empezar por ahí.

## Procedimiento

### 1. Actualizar el backend

```bash
cd resimamis && git fetch origin && git log --oneline HEAD..origin/main
```

Si hay commits pendientes, `git pull --ff-only origin main` y revisar qué tocaron los
controllers antes de seguir.

### 2. Extraer el contrato real de los controllers

Los atributos de ruta dan el mapa. Cada controller es `[Route("api/[controller]")]`, así que la
ruta final es `api/<NombreController>/<template del atributo>`:

```bash
grep -rn "\[Http\(Get\|Post\|Put\|Delete\)" resimamis/Controllers/ -A1
```

Para un controller puntual (`$1` si se pasó argumento), leerlo entero: importan la firma del
método, el tipo del body y de dónde se bindea cada parámetro.

**Convenciones del backend que cambian la firma:**
- Por `[ApiController]`, un `int` que **no** está en el template de ruta se bindea del **query
  string**. Por eso las bajas son `POST api/X/delete?idX=N` con body vacío.
- Los únicos `DELETE` reales son `DELETE api/Asignacion/id/{id}` y
  `DELETE api/Horario/voluntaria/{id}`. El resto de bajas es `POST .../delete`.
- El JSON sale en **camelCase** (`PropertyNamingPolicy = CamelCase`), aunque las propiedades
  C# estén en PascalCase. De ahí el patrón `p.activa ?? p.Activa` en el front.

### 3. Extraer lo que consume el frontend

```bash
grep -n "AxiosInstance\.\(get\|post\|put\|delete\)" src/redux/api/index.js
```

El front usa rutas **relativas sin el prefijo `/api/`** y con distinto casing que el backend
(`/asignacion/...` vs `api/Asignacion/...`). Comparar normalizando a minúsculas.

### 4. Reportar las tres categorías

1. **Roto** — el front llama algo que el backend ya no expone, o con verbo/body distinto.
   Es lo urgente: ya está fallando en producción.
2. **Sin consumir** — el backend expone algo que el front no usa. Oportunidad, no error.
   Hoy es la mayor parte de `api/Dashboard` y `api/Asistente`.
3. **Divergente** — mismo endpoint, distinta forma del body o de los parámetros.

### 5. Actualizar documentación si cambió el contrato

- `.claude/rules/30-api-contract.md` — tabla de endpoints y mapeo función API → saga
- `.claude/rules/20-backend.md` — si aparecieron controllers o servicios nuevos
- `docs/cobertura-api.md` — qué expone el backend vs qué consume el frontend

## Reglas al integrar un endpoint

- **El código del backend manda sobre el del frontend.** Si difieren, corregir el front; no
  asumir que lo histórico está bien.
- **El envelope no tiene campo `success`.** Éxito → `{ data }` con HTTP 200. Error →
  `{ message, errors }` con status semántico (400/401/403/404/409/500). El front decide
  `try`/`catch` por el status HTTP. **Login es la excepción: responde plano, sin envelope.**
- **Verificar quién autoriza de verdad.** Solo 8 operaciones validan rol en el servidor
  (ver `20-backend.md`). Que la UI esconda un botón no significa que el endpoint esté protegido.
- Toda función HTTP nueva pasa por su saga y su reducer (ver `11-frontend-redux.md`).
