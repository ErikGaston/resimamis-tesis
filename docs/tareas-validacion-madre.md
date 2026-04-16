# Tarea: Validaciones registrar / editar madre

Estado: **implementado** (frontend). Ultima actualizacion: 2026-04-16.

## Objetivo

Validar todos los campos **al hacer clic en Guardar** (o en el ícono de confirmar en perfil), mostrar errores **inline** bajo cada control (MUI `helperText` + `error`), con límites de longitud en inputs y mensajes sin prefijo `0:` en respuestas de API unificadas.

## Hecho

| Requisito | Implementación |
|-----------|----------------|
| Validación conjunta al guardar | `validateMotherForm` en `src/utils/motherFormValidation.js`; se llama desde `MotherPage.submitMother` y `ProfileMotherPage.submitMother` antes de `postMother` / `putMother`. |
| Errores inline | `fieldErrors` en estado; `LabelInput`, `LabelDate`, `LabelAutocomplete` reciben `error` y `helperText`; `DatePickerCustomized` y `AutocompleteCustomized` propagan a `TextField`. |
| Quitar prefijo `0:` en mensajes API | `stripValidationIndexPrefix` y manejo de `errors` ASP.NET en `src/utils/apiErrorMessage.js`. |
| Nombre / apellido: obligatorio, sin números/caracteres raros, espacios/tildes/ñ, máx 50 | Regex `^[\p{L}\s]+$/u`, `maxLength` 50. |
| DNI: solo números, 7–8 dígitos, obligatorio, sin duplicados | Validación + comparación con `listadoMadres`; en edición se excluye `idMadre` actual. |
| Fecha nacimiento: no futura, mínimo 13 años, rango en picker | `minDate` = hoy − 100 años, `maxDate` = hoy − 13 años (`MobileDatePicker`). |
| Localidad obligatoria | Mensaje inline en autocomplete. |
| Celular: obligatorio, solo dígitos y `+` inicial, 10–15 dígitos | Normalización al enviar en `normalizeMotherPayload` (número sin `+` para API). |
| Motivo abrazo: obligatorio, máx 250 | `maxLength` + validación. |
| Cantidad hijos: obligatorio, 1–40 | Campo nuevo en formulario + validación. |
| Payload | `normalizeMotherPayload` elimina `nombre_localidad` y normaliza `celular` / `cantidadHijos`. |

## Archivos tocados (referencia)

- `src/utils/motherFormValidation.js` (nuevo)
- `src/utils/apiErrorMessage.js`
- `src/components/molecules/motherForm/MotherForm.jsx`
- `src/components/molecules/labelInput/LabelInput.jsx`
- `src/components/molecules/labelDate/LabelDate.jsx`
- `src/components/molecules/labelAutocomplete/LabelAutocomplete.jsx`
- `src/components/atoms/datePicker/DatePickerCustomized.jsx`
- `src/components/atoms/autocomplete/AutocompleteCustomized.jsx`
- `src/components/organisms/motherAccordionForm/MotherAccordionForm.jsx`
- `src/components/templates/mother/MotherTemplate.jsx`
- `src/components/templates/profile/ProfileTemplate.jsx`
- `src/pages/mother/MotherPage.jsx`
- `src/pages/profile/ProfileMotherPage.jsx` (también `getMother` para lista y chequeo de DNI duplicado)

## Pendiente / notas

- Los **toasts** del saga (`showApiErrorToast`) siguen mostrándose en **errores de red o 500** tras el envío; la validación de formulario ya no depende de ellos.
- El build en Windows puede fallar en `cp web.config` (script npm); `vite build` en sí compila.
- Si el backend devuelve otro nombre de propiedad para el id de madre en el listado (`idMadre` vs otro), ajustar el chequeo de duplicados en `validateMotherForm`.
