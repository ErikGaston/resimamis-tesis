# Tarea: Validaciones registrar / editar madre

Estado: **implementado y endurecido** (frontend). Última actualización: **2026-05-05**.

## Objetivo

Validar todos los campos **al hacer clic en Guardar** (o en el ícono de confirmar en perfil), mostrar errores **inline** bajo cada control (MUI `helperText` + `error`), con límites de longitud en inputs y mensajes sin prefijo `0:` en respuestas de API unificadas.

## Hecho

| Requisito | Implementación |
|-----------|----------------|
| Validación conjunta al guardar | `validateMotherForm` en `src/utils/motherFormValidation.js`; `MotherPage.submitMother` y `ProfileMotherPage.submitMother`. |
| Errores inline | `fieldErrors`; `LabelInput`, `LabelDate`, `LabelAutocomplete`, `DatePickerCustomized`, `AutocompleteCustomized`. |
| Quitar prefijo `0:` en mensajes API | `stripValidationIndexPrefix` y ASP.NET en `src/utils/apiErrorMessage.js`. |
| Nombre / apellido | Regex Unicode, máx 50. |
| DNI | 7–8 dígitos, duplicados contra `listadoMadres`; exclusión por id con **`resolveListadoMadreId`** (`idMadre`, `IdMadre`, `id`, …). |
| Fecha nacimiento | No futura, mínimo 13 años, picker acotado. |
| Localidad obligatoria | Autocomplete. |
| Celular | Dígitos y `+` opcional; normalización en `normalizeMotherPayload`. |
| Motivo abrazo | Obligatorio, máx 250. |
| Cantidad hijos | 1–40. |
| Estado civil | Lista fija 1–6 + **opción dinámica** si el backend devolvió otro código entero (`getMotherEstadoCivilOptionsForSelect`); **`MotherForm`** usa ese arreglo para el autocomplete. |
| Payload | `normalizeMotherPayload`. |
| Montaje perfil / alta | **`ProfileMotherPage`**: primero `clearMother`, luego `getMotherId` + `getMother` (sin `clear` inmediato después del `get`). **`MotherPage`**: `clearMother` + `clearBaby` antes de `getMother` / `getLocalities`. |
| Coordinación + listados | **`ListMotherPage`** / **`ListVolunteerPage`**: mismo patrón de montaje; tras baja, **`clearMotherWrites`** / **`clearVolunteerWrites`** para no dejar flags y evitar bucles en `useEffect`. |
| Perfil coordinadora | **`ProfileMotherPage`**: consulta **bebé por DNI** (`getBabyByDni`) con resultado JSON (solo lectura). |

## Archivos tocados (referencia)

- `src/utils/motherFormValidation.js` — `resolveListadoMadreId`, `getMotherEstadoCivilOptionsForSelect`, validación estado civil y DNI.
- `src/utils/apiErrorMessage.js`
- `src/utils/supplyMovementPayload.js` — (contexto stock; no madre directamente)
- `src/components/molecules/motherForm/MotherForm.jsx`
- `src/components/molecules/labelInput/LabelInput.jsx`, `labelDate`, `labelAutocomplete`, `datePicker`, `autocomplete`
- `src/components/organisms/motherAccordionForm/MotherAccordionForm.jsx`
- `src/components/templates/mother/MotherTemplate.jsx`, `profile/ProfileTemplate.jsx`
- `src/pages/mother/MotherPage.jsx`, `src/pages/profile/ProfileMotherPage.jsx`
- `src/pages/list/ListMotherPage.jsx`
- Redux: `CLEAR_MOTHER_WRITES`, reducers/actions asociados.

## Pendiente / notas (bajo negocio o QA)

- **Catálogo estado civil desde API:** si el backend expone enumeración oficial, sustituir o fusionar con `MOTHER_ESTADO_CIVIL_OPTIONS`.
- **Pruebas E2E** del flujo madre (alta, edición perfil, duplicado DNI, coordinadora + consulta bebé).
