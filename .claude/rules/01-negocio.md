# 01 — Negocio

## Actores

| Actor | Descripción |
|-------|-------------|
| **Voluntaria** | Usuario operativo. Login con DNI + contraseña. Registra asistencia (entrada/salida), ejecuta abrazos según sus asignaciones, ve/edita su perfil y horarios. |
| **Coordinadora** | Subrol de voluntaria (`rol === "coordinadora"`, insensible a mayúsculas/acentos). Genera asignaciones, reportes, bajas lógicas, administra usuarios/proveedores/salas. En el backend el rol se llama **"Administrativa"**. |
| **Madre** | Beneficiaria. DNI único, localidad, estado civil, motivo del abrazo, cantidad de hijos. Tiene uno o más bebés. |
| **Bebé** | Beneficiario directo del abrazo. Asociado a una madre, ubicado en una sala NEO. |

## Flujo operativo del día

1. Voluntaria llega → **registra entrada** (`POST /asistencia/entrada/{id}`)
2. Ve sus **asignaciones del día**
3. **Inicia el abrazo** → `POST /asignacion/iniciarAbrazo/{idAsignacion}` (marca `fechaHoraInicio`)
4. **Finaliza** con comentario opcional → `POST /asignacion/finalizarAbrazo/` body `{ idAsignacion, comentario }`
   — el comentario va **solo en el body**, nunca en la URL; `comentario` acepta `null`
5. Opcional: registra **insumos usados** → `POST /asignacion/registrarDetalleAsignacion/`
   body **array** `[{ idAsignacion, idInsumo, cantidadInsumo }]`
6. Al irse → **registra salida** (`POST /asistencia/salida/{id}`). Si vuelve el mismo día puede
   marcar una nueva entrada: el backend solo rechaza una segunda entrada con la jornada anterior
   abierta (`FechaHoraSalida == null`)

La coordinadora además genera asignaciones masivas, resetea abrazos colgados (iniciados en
días anteriores y nunca finalizados) y accede al panel `/coordinacion`.

## Entidades

| Entidad | Campos clave |
|---------|-------------|
| **VOLUNTARIA** | `IdVoluntaria`, `Dni`, `Nombre`, `Apellido`, `Mail`, `Celular`, `IdRol`, `rol` (NotMapped), `IdEstado` |
| **MADRE** | `IdMadre`, `Dni` (7-8 dígitos, único), `Nombre`, `Apellido`, `FechaNacimiento`, `Localidad` (FK), `EstadoCivil` (1-6), `CantidadHijos`, `MotivoAbrazo`, `Celular`, `IdEstado` |
| **BEBE** | `ID`, `Dni?`, `nombre`, `apellido`, `Sexo`, `FechaNacimiento?`, `IdSala?`, `IdMadre?`, `IdEstado?`, `fechaSalida?`, pesos (`pesoNacimiento`, `pesoIngresoNEO`, `pesoDiaAbrazos`, `pesoAlta`) |
| **ASIGNACION** | `idAsignacion`, `idVoluntaria`, `idBebe?`, `idTarea?`, `idEstado`, `fechaHoraInicio?`, `fechaHoraFin?`, `comentario` |
| **ASISTENCIA** | `IdAsistencia`, `IdVoluntaria?`, `FechaHoraIngreso?`, `FechaHoraSalida?`, `idEstado` |
| **INSUMO** | `idInsumo`, `nombre`, `descripcion`, `stockActual`, `stockMinimo`, `stockMaximo`, `idEstado` |
| **MOVIMIENTOSTOCK** | `idMovimiento`, `idInsumo`, `esEntrada?` (bool), `cantidad?`, `idProveedor?`, `fechaMovimiento?` |
| **TAREA** | `idTarea`, `nombre`, `Estado` (bool), `esUnica` (bool: si true, solo una activa simultánea) |
| **VISITA** | `idVisita`, `idBebe`, `nombreVisitante`, `familiar` (bool), `fechaHoraVisita`, `documentoVisitante?`, `telefonoVisitante?`, `Activa` (bool) |
| **DETALLEASIGNACION** | `idDetalleAsignacion`, `idAsignacion`, `idInsumo`, `cantidad`, `nombreInsumo` |

## Validaciones de negocio

- **DNI madre:** 7-8 dígitos, único. El front detecta duplicados contra `getMother` antes de enviar.
- **Edad mínima:** 13 años para madres, 18 para voluntarias.
- **Motivo del abrazo:** obligatorio, máx 250 chars.
- **Estado civil:** catálogo 1-6 (1 Soltera/o, 2 Casada/o, 3 Unión convivencial, 4 Divorciada/o,
  5 Viuda/o, 6 Separada/o). Si el backend devuelve un código fuera de rango, la UI muestra
  `"Código N (registrado en el sistema)"` como opción legacy.
- **Celular:** 10-15 dígitos, permite `+` inicial.
- **`movimientoStock.esEntrada`:** el backend espera el string **`"S"` (entrada) o `"N"`
  (salida)**, no un boolean; rechaza cualquier otro valor con 400.
  `normalizeEsEntradaForApi()` normaliza lo que venga del formulario a `"S"`/`"N"`.
- **Detalle de asignación:** nunca enviar ítems con `cantidadInsumo = 0` — filtrar antes de despachar.

## Estados (tabla polimórfica ESTADO + AMBITO)

| Ámbito | Estados |
|--------|---------|
| Bebés | `Sin abrazar`, `Asignado`, `Abrazado`, `Eliminado` |
| Voluntarias | `Activa`, `Asignada`, `Abrazando`, `Ayudando`, `Inactiva`, `Licencia`, `Carpeta médica`, `Eliminado` |
| Asignaciones | `Creada`, `Iniciado`, `Finalizado`, `Eliminado` |
| Madres / Insumos / Asistencias / Usuarios | `Activa`/`Activo`, `Eliminado` |

**Baja lógica universal:** ninguna entidad se borra físicamente. `POST /api/X/delete` setea
`idEstado` al estado "Eliminado" del ámbito. Proveedores y salas usan un flag `Activa` en su lugar.
