# 02 — Autenticación — Resimamis

> Fuente de verdad: `src/redux/interceptor/interceptor.js`, `src/utils/localStorage.js`, `src/utils/coordinadoraRole.js`, `src/routes/`.

## Almacenamiento (localStorage)

| Qué | Key | Tipo |
|-----|-----|------|
| JWT Token | `token` | string |
| Datos de sesión | `voluntaria` | JSON: `{ id, nombre, apellido, mail, dni, celular, idRol, rol }` |

No hay cookie. No hay `is_staff`. El token es **JWT Bearer** (no DRF Token).

## Login

1. Form: campos `Dni` (number) + `Contrasena` (string).
2. `postLogin` en `redux/api/index.js` normaliza a `{ dni, contrasena }` (minúsculas) → `POST usuario/login/`.
3. Respuesta plana (sin envelope `data`): incluye `token` + datos de la voluntaria.
4. Se guarda `localStorage.setItem('token', token)` y `localStorage.setItem('voluntaria', JSON.stringify({ id, nombre, apellido, mail, dni, celular, idRol, rol }))`.
5. `setAuthToken(token)` en `utils/setAuthToken.js` refuerza el header por defecto de Axios.
6. Navega a `/overview` (o `/home` que redirige a `/overview`).

```js
// Helpers en src/utils/localStorage.js
getIdVolunteer()     // localStorage['voluntaria'].id
getNameVolunteer()   // localStorage['voluntaria'].nombre
```

## Interceptor Axios (`src/redux/interceptor/interceptor.js`)

- **Request:** lee `localStorage.getItem('token')` e inyecta `Authorization: Bearer <token>` si existe.
- **Response 401:** limpia `localStorage` (borra `token` y `voluntaria`) y redirige a `/login`.
- **Base URL:** `import.meta.env.VITE_URL_API`.
- **Timeout:** 20 s.

> Los comentarios de las líneas 33–35 del interceptor (`localStorage.clear()`, `window.location.reload()`, `window.location.href = '/login'`) son el bloque 401 que está inactivo/comentado. Si se reactiva, verificar que limpia exactamente `token` y `voluntaria` (no `localStorage.clear()` que borraría todo).

## Rol coordinadora

```js
// src/utils/coordinadoraRole.js
isCoordinadoraSession()
  // Lee localStorage['voluntaria']
  // 1. Verifica rol === "coordinadora" (normalizado: sin acentos, minúsculas)
  // 2. Fallback: idRol === parseInt(import.meta.env.VITE_COORDINADORA_ID_ROL)
  // Retorna boolean

readVolunteerSession()  // Retorna el objeto voluntaria parseado o null
```

El rol "coordinadora" en el frontend equivale al rol **"Administrativa"** en el backend (`ROL.Nombre`).

## Guards de ruta (`src/routes/`)

| Componente | Comportamiento |
|------------|----------------|
| `PrivateRoute` | Chequea `localStorage.getItem('token')`. Sin token → `<Navigate to="/login">`. |
| `PublicRoute` | Con token → `<Navigate to="/overview">`. |
| `RootRedirect` | Entrada raíz: con token → `/overview`, sin token → `/login`. |

`CoordinacionPage` hace su propio check on-mount: `isCoordinadoraSession()` → si false → navega a `/overview`.

## Usuarios admin (desde CoordinacionPage)

La coordinadora puede crear/editar/eliminar usuarios (`USUARIO` del backend) vía:
- `POST /usuario` — crear usuario (asociado a una voluntaria existente)
- `GET /usuario/id/{id}`, `PUT /usuario/id/{id}/` — editar
- `POST /usuario/delete` — baja lógica

Los usuarios son distintos a las voluntarias: `USUARIO` tiene `IdVoluntaria` (FK) + `Contrasena` (BCrypt). Login → `POST usuario/login/` con `{ dni, contrasena }`.

## Cambio de contraseña

`PUT /usuario/contrasena` (auth requerida). No hay flujo de reset por email actualmente.
