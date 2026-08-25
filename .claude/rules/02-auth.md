# 02 — Autenticación

> Fuente: `src/redux/interceptor/interceptor.js`, `src/utils/localStorage.js`,
> `src/utils/coordinadoraRole.js`, `src/routes/`, `resimamis/Negocio/NegUsuarios.cs`.

## Almacenamiento

| Qué | Key de `localStorage` | Tipo |
|-----|----------------------|------|
| JWT | `token` | string |
| Sesión | `voluntaria` | JSON `{ id, nombre, apellido, mail, dni, celular, idRol, rol }` |

No hay cookie ni `is_staff`. El token es **JWT Bearer**.

Helpers: `getIdVolunteer()` / `getNameVolunteer()` en `src/utils/localStorage.js`.

## Login

1. Form `Dni` (number) + `Contrasena` (string).
2. `postLogin` normaliza a `{ dni: Number, contrasena }` → `POST usuario/login/`.
3. **Respuesta plana, sin envelope `data`**: incluye `token` + datos de la voluntaria.
4. Se guardan `token` y `voluntaria` en `localStorage`; `setAuthToken(token)` refuerza el
   header por defecto de Axios.
5. Navega a `/overview`.

Backend: `NegUsuarios.Loguear` busca por DNI, verifica con `BCrypt.Verify` y firma un JWT con
claims `NameIdentifier` y `Name` = DNI. Expiración 30 días, pero `ValidateLifetime` está
comentado → **los tokens no expiran técnicamente** (deuda conocida).

## Interceptor Axios

`src/redux/interceptor/interceptor.js` — base URL `import.meta.env.VITE_URL_API`, timeout 20 s.

- **Request:** inyecta `Authorization: Bearer <token>` si existe.
- **Response 401:** el bloque **está activo**. Usa un flag `_retry`, borra puntualmente
  `token` y `voluntaria` (no hace `localStorage.clear()`) y redirige con
  `window.location.href = '/login'`.

> Si tocás este bloque, mantené el borrado puntual: un `localStorage.clear()` borraría
> cualquier otra clave del origen.

## Rol coordinadora

```js
// src/utils/coordinadoraRole.js
readVolunteerSession()      // objeto voluntaria parseado o null
isCoordinadoraVoluntaria(v) // evalúa un objeto suelto
isCoordinadoraSession()     // rol === "coordinadora" (sin acentos, minúsculas)
                            // o idRol === Number(VITE_COORDINADORA_ID_ROL)
```

Equivale al rol **"Administrativa"** del backend (`ROL.Nombre`).

## Guards y acceso elevado

| Componente | Comportamiento |
|------------|----------------|
| `PrivateRoute` | Sin `token` → `<Navigate to="/login">` |
| `PublicRoute` | Con `token` → `<Navigate to="/overview">` |
| `RootRedirect` | Con token → `/overview`; sin token → `/login` |

**Las rutas no filtran por rol.** El acceso elevado se resuelve *dentro* de cada página con
`isCoordinadoraSession()`:

- `CoordinacionPage`: si no es coordinadora renderiza un `<Alert severity="warning">` +
  botón "Volver al inicio". **No redirige** — no hay `useEffect` de navegación.
- `TasksPage`: `canAccessAssignment` habilita la sección de asignación masiva.
- `ListMotherPage` / `ListVolunteerPage` / `ListBabysPage`: muestran íconos de baja.
- `SupplyPage`, `HomePage` (`PanelTrabajo`): habilitan acciones/cards extra.

> Esto es **UI, no seguridad**: quien conozca la ruta puede abrirla, y para casi todas estas
> acciones el backend tampoco valida el rol (ver abajo).

## Autorización en el backend

No usa `[Authorize(Roles=...)]`. `RolesVoluntaria.EsCoordinadora(idRol, nombreRol)` acepta
`idRol == 3` o un nombre en `{Coordinadora, Administrativa, Administrador, Admin}`.
`NegUsuarios.EsCoordinadoraPorDni` → `RequiereCoordinadora` → `ForbiddenException` → 403.

**Solo 8 operaciones verifican el rol en el servidor:** las cinco de gestión de usuarios
(`POST /Usuario`, `GET /Usuario`, `GET /Usuario/voluntarias-sin-usuario`,
`PUT /Usuario/id/{id}`, `POST /Usuario/delete`), `GET /Usuario/id/{id}` (coordinadora o el
propio usuario), `GET /Asignacion/listarAsignacionesHoy` y `POST /Asistente/preguntar`.

Todo lo demás solo requiere un JWT válido: las bajas lógicas de madre/bebé/voluntaria/
asistencia, `PUT`/`DELETE` de asignación, `resetearAbrazosColgados`, los 16 endpoints de
`Dashboard` y los ABM de proveedores/salas/tareas **no están protegidos por rol**. Cualquier
voluntaria autenticada puede ejecutarlos llamando la API directamente.

> Deuda de seguridad abierta, registrada en `docs/deuda-tecnica.md`. Al documentar un endpoint,
> no lo marques "solo coordinadora" salvo que el servidor lo verifique.

CORS: `AllowAnyOrigin + AllowAnyHeader + AllowAnyMethod`.

## Cambio de contraseña

`PUT /usuario/contrasena` body `{ ContrasenaActual, ContrasenaNueva }`, para cualquier usuario
autenticado. No existe flujo de "olvidé mi contraseña".
