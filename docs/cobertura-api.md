# Cobertura de API — backend expuesto vs frontend integrado

**Última revisión:** 2026-08-24 (backend en `4684eea`).

El backend expone ~100 endpoints; el frontend consume ~50. Este documento registra la brecha.

Fuente de verdad del contrato: `resimamis/Controllers/*.cs`. Para regenerar el diff, usar la
skill `sync-api-contract`.

---

## Integrado y en uso

| Familia | Cobertura |
|---------|-----------|
| `api/Usuario` | Completa — login, ABM, cambio de contraseña, voluntarias sin usuario |
| `api/Voluntaria` | Completa |
| `api/Asistencia` | Completa — entrada, salida, hoy, históricas, reporte, baja |
| `api/Madre` | Completa — ABM, estadísticas de localidades y edades |
| `api/Bebe` | Parcial — falta `estados` y `id/{id}/estado` |
| `api/Asignacion` | Parcial — falta `abrazosHistoricos/{idBebe}` y los `*Catalogo` |
| `api/Insumo` | Parcial — falta stock mínimo y movimiento por id |
| `api/Visita` | Completa — consumida por `organisms/visitasBebe` |
| `api/Proveedor` / `api/Sala` | Listado + ABM desde `CoordinacionPage` |
| `api/Genericos` | Completa |
| `api/Horario` | Parcial — solo `dias` y `PUT`; `postHorario` existe pero no se usa desde la UI |

---

## Sin integrar

### `api/Dashboard` — 16 endpoints, 2 consumidos

Sigue siendo la brecha más grande: 14 de 16 endpoints no tienen UI, y el resto de
`/estadisticas` todavía se alimenta de los endpoints viejos de madre/asignación/insumo.

| Endpoint | Qué daría |
|----------|-----------|
| `resumen` | KPIs del período |
| `coordinacion/hoy` | Snapshot operativo: bebés activos/asignados, abrazos creados/en curso/finalizados, voluntarias presentes, **abrazos colgados**, visitas |
| `coordinacion/cobertura-hoy` | % de bebés con abrazo finalizado + lista nominal de los que no recibieron |
| `asignaciones/por-dia` | Serie diaria |
| `abrazos/duracion` | Promedio/mín/máx/total en minutos |
| `bebes/por-estado`, `bebes/por-sala` | Distribuciones |
| `bebes/rango-edades` | 0-7 / 8-14 / 15-28 / 29-60 / 61+ días |
| ~~`bebes/permanencia`~~ | **Integrado** (ago 2026): `/estadisticas` → "Permanencia de los bebés" |
| ~~`bebes/evolucion-peso`~~ | **Integrado** (ago 2026): `/estadisticas` → "Evolución de peso de los bebés" |
| `voluntarias/ranking-abrazos` | Top por abrazos finalizados |
| `bebe/{id}/abrazos-hoy` · `abrazos-historial` | Historial por bebé |
| `voluntaria/{id}/abrazos-hoy` · `abrazos-historial` | Historial por voluntaria |

> Notas de integración: acepta `fechaDesde`/`fechaHasta` **o** `fechaInicio`/`fechaFin`, en
> `yyyy-MM-dd` o `dd/MM/yyyy`, con rango máximo de 731 días. Varios exigen fechas
> obligatorias (`resumen`, `asignaciones/por-dia`, `visitas/estadisticas`,
> `voluntarias/ranking-abrazos`). **Ninguno valida rol en el servidor.**

### `api/Asistente` — 2 endpoints, cero consumo

Asistente IA por OpenAI para la coordinadora, con 19 herramientas de solo lectura sobre los
datos del dashboard.

| Endpoint | Nota |
|----------|------|
| `GET /Asistente/estado` | Devuelve `{ habilitado, proveedor, modelo, quePuedeConsultar[] }`. **No valida rol** |
| `POST /Asistente/preguntar` | Body `{ pregunta, historial? }`. **Sí exige coordinadora.** Pregunta ≤ 2000 chars, historial ≤ 20 mensajes |

Requiere `Asistente:Enabled` + API key en el backend; sin key devuelve 400 con mensaje
explicativo. `GET /estado` es el chequeo natural antes de mostrar la UI.

### Sueltos

| Endpoint | Qué daría |
|----------|-----------|
| `GET /Bebe/estados` | Catálogo de estados de bebé para un selector |
| `PUT /Bebe/id/{id}/estado` | Cambio de estado explícito (400 si el bebé ya tiene `FechaSalida`) |
| `GET /Asignacion/abrazosHistoricos/{idBebe}` | Historial de abrazos del bebé |
| `GET /Insumo/bajoStockMinimo` | Listado `stockActual <= stockMinimo` — alerta en la UI de insumos |
| `POST /Insumo/avisoStockMinimo` | Disparo manual del mail de aviso |
| `GET /Insumo/movimiento/id/{id}` | Detalle de un movimiento |
| `GET /Horario/voluntaria/{id}` | Leer horarios (hoy solo se escriben) |
| `DELETE /Horario/voluntaria/{id}` | Baja de un horario puntual |
| `GET /Proveedor/activos`, `GET /Sala/activas` | El front usa los listados completos y filtra en cliente |
| `POST /Asignacion/generarTareaCatalogo` y `generarTareasCatalogo` | Asignar **tareas de catálogo**; hoy el front solo asigna bebés |

### Cableado pero sin UI

`api/Tarea` (6 endpoints) tiene action, saga y reducer completos y registrados en el store,
pero **ninguna página los despacha**. Es funcionalidad a medio construir: o se le hace UI, o
se quita el slice. Ver `deuda-tecnica.md`.

---

## Divergencias a vigilar

| Punto | Estado |
|-------|--------|
| `esEntrada` | El backend espera string `"S"`/`"N"`. El front lo normaliza correctamente con `normalizeEsEntradaForApi`. **La documentación vieja decía boolean — era el doc el que estaba mal, no el código** |
| Envelope | No existe campo `success`. Éxito `{ data }` / error `{ message, errors }` con status semántico. Documentación previa afirmaba lo contrario |
| `generarTarea` vs `generarTareaCatalogo` | En el primero `idTarea` es un **ID de BEBE**; en el segundo es un **ID de TAREA**. Fácil de confundir |
