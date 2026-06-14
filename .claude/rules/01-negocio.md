# 01 — Negocio — Resimamis

## Qué es el sistema

Resimamis gestiona un **programa social de abrazos de bebé** (método mamá canguro / contacto piel a piel) en una Unidad de Neonatología (NEO). Voluntarias entrenadas visitan a bebés prematuros, los abrazan y registran la actividad. El sistema centraliza quién abraza a quién, cuándo, con qué insumos, y genera estadísticas del programa.

**No** es un marketplace. No tiene pagos ni e-commerce. Es una app de campo **mobile-first** (máx 444 px) para uso en hospital con tablet/smartphone.

## Actores

| Actor | Descripción |
|-------|-------------|
| **Voluntaria** | Usuario operativo. Login con DNI + contraseña. Registra asistencia (entrada/salida), ejecuta abrazos según sus asignaciones, ve/edita su perfil y horarios. |
| **Coordinadora** | Subrol de voluntaria (`rol === "coordinadora"`, insensible a mayúsculas/acentos). Acceso elevado: genera asignaciones masivas, reportes de asistencia, da de baja madres/voluntarias/bebés, administra usuarios. En el backend se llama **"Administrativa"** (`ROL.Nombre`). |
| **Madre** | Beneficiaria del programa. Datos demográficos: DNI (único), nombre, localidad, estado civil, motivo del abrazo, cantidad de hijos. Tiene uno o más bebés. |
| **Bebé** | Beneficiario directo del abrazo. Asociado a una madre; tiene sala NEO. Aparece en listados de "bebés disponibles para abrazar". |

## Flujo operativo del día

1. Voluntaria llega al centro → **registra entrada** (`POST /asistencia/entrada/{id}`)
2. Ve sus **asignaciones del día** (qué bebé le toca abrazar o qué tarea tiene)
3. **Inicia el abrazo** → `POST /asignacion/iniciarAbrazo/{idAsignacion}` (marca hora inicio)
4. **Finaliza el abrazo** con comentario opcional → `POST /asignacion/finalizarAbrazo/` body `{ idAsignacion, comentario }`
5. Opcionalmente registra **insumos usados** → `POST /asignacion/registrarDetalleAsignacion/` body array `[{ idAsignacion, idInsumo, cantidadInsumo }]`
6. Al irse → **registra salida** (`POST /asistencia/salida/{id}`)

La coordinadora además puede:
- **Generar asignaciones masivas** (N voluntarias + N bebés): `POST /asignacion/generarTareas/` body `{ idVoluntarias: int[], idTareas: int[] }`
- **Asignación rápida** (1+1): `POST /asignacion/generarTarea` body `{ idVoluntaria, idTarea }`
- **Resetear abrazos colgados**: `POST /asignacion/resetearAbrazosColgados` (cierra los iniciados sin finalizar de días anteriores)

## Entidades principales

| Entidad | Campos clave |
|---------|-------------|
| **VOLUNTARIA** | `IdVoluntaria`, `Dni`, `Nombre`, `Apellido`, `Mail`, `Celular`, `IdRol`, `rol` (NotMapped, viene de `RolInfo`), `IdEstado` |
| **MADRE** | `IdMadre`, `Dni` (7-8 dígitos, único), `Nombre`, `Apellido`, `FechaNacimiento`, `Localidad` (FK), `EstadoCivil` (1–6), `CantidadHijos`, `MotivoAbrazo`, `Celular`, `IdEstado` |
| **BEBE** | `ID`, `Dni?`, `nombre`, `apellido`, `Sexo`, `FechaNacimiento?`, `IdSala?`, `IdMadre?`, `IdEstado?` |
| **ASIGNACION** | `idAsignacion`, `idVoluntaria`, `idBebe?`, `idTarea?`, `idEstado`, `fechaHoraInicio?`, `fechaHoraFin?`, `comentario` |
| **ASISTENCIA** | `IdAsistencia`, `IdVoluntaria?`, `FechaHoraIngreso?`, `FechaHoraSalida?`, `idEstado` |
| **INSUMO** | `idInsumo`, `nombre`, `descripcion`, `stockActual`, `stockMinimo`, `stockMaximo`, `idEstado` |
| **MOVIMIENTOSTOCK** | `idMovimiento`, `idInsumo`, `esEntrada?` (bool), `cantidad?`, `idProveedor?` |
| **TAREA** | `idTarea`, `nombre`, `Estado` (bool vigente), `esUnica` (bool: solo 1 activa simultánea) |
| **VISITA** | `idVisita`, `idBebe`, `nombreVisitante`, `familiar`, `fechaHoraVisita`, `documentoVisitante?`, `Activa` (bool) |
| **DETALLEASIGNACION** | `idDetalleAsignacion`, `idAsignacion`, `idInsumo`, `cantidad`, `nombreInsumo` |

## Validaciones de negocio

- **DNI madre:** 7–8 dígitos, único. El front detecta duplicados contra `getMother` antes de enviar.
- **Edad mínima:** 13 años para madres (`FechaNacimiento`).
- **Motivo del abrazo:** obligatorio, max 250 chars.
- **Estado civil:** catálogo 1–6 (1=Soltera/o, 2=Casada/o, 3=Unión convivencial, 4=Divorciada/o, 5=Viuda/o, 6=Separada/o). Si el backend devuelve un código fuera del rango, la UI muestra `"Código N (registrado en el sistema)"` como opción legacy.
- **Celular:** 10–15 dígitos, permite `+` inicial.
- **`movimientoStock.esEntrada`**: el backend espera boolean. `normalizeEsEntradaForApi()` en `utils/supplyMovementPayload.js` convierte el string del formulario.
- **Bebés a abrazar:** el front intenta `GET /bebe/disponibles-abrazo` y hace fallback a `GET /bebe/abrazar`. La respuesta puede tener varias formas; `listBabysFromAbrazarResponse()` en `utils/assignmentSelection.js` normaliza todos los casos.

## Estados de entidades (tabla polimórfica ESTADO + AMBITO)

El backend usa una tabla `ESTADO` con `idAmbito` para estados por entidad. Ver `05-backend.md` para detalles. Estados conocidos relevantes para el front:

| Entidad | Estados |
|---------|---------|
| Bebés | `Sin abrazar`, `Asignado`, `Abrazado`, `Eliminado` |
| Voluntarias | `Activa`, `Asignada`, `Abrazando`, `Ayudando`, `Inactiva`, `Licencia`, `Carpeta médica`, `Eliminado` |
| Asignaciones | `Creada`, `Eliminado` |
