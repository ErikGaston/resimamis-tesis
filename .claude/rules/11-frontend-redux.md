---
paths:
  - "src/redux/**"
---

# 11 — Redux + Redux-Saga

```
src/redux/
├── store/index.js          createStore + sagaMiddleware
├── consts/actionTypes.js   204 constantes
├── api/index.js            TODAS las funciones HTTP (86 exports) — ver 30-api-contract.md
├── actions/                14 archivos, uno por dominio
├── sagas/                  rootSaga + un archivo por dominio + showApiErrorToast.js
├── reducers/               combineReducers + un reducer por dominio
└── interceptor/            AxiosInstance + auth header + 401
```

## Slices (`combineReducers`)

`userReducer`, `volunteerReducer`, `motherReducer`, `genericsReducer`, `babyReducer`,
`assignmentReducer`, `supplyReducer`, `toastReducer`, `horarioReducer`, `tareaReducer`,
`visitaReducer`, `proveedorReducer`, `salaReducer`.

**No hay `loadingReducer`.** `SHOW_LOADING` (`loadingActions.showLoading`) se maneja como flag
`loading` **dentro de cada reducer de dominio** (12 de 13; `toastReducer` no lo maneja).

> El slice **`tarea` está muerto**: actions, saga, reducer y 6 endpoints existen y están
> cableados en el store y el `rootSaga`, pero ninguna página los despacha. No lo tomes como
> ejemplo de feature viva.

## Patrón de saga — el real

Cada saga de dominio exporta **una** generator por default que encadena `takeLatest`
secuencialmente. **No existen funciones `watch*`, y `all([...])` se usa solo en `rootSaga`.**

```js
// src/redux/sagas/salaSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../consts/actionTypes';
import * as API from '../api';
import { showApiErrorToast } from './showApiErrorToast';

function* asyncGetSalasAll() {
    try {
        const response = yield call(API.getSalasAll);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_SALAS_ALL, response });
    } catch (error) {
        yield* showApiErrorToast(error);          // salvo en asyncPostLogin
        yield put({ type: actionTypes.ERROR_SALA, response: error });
    }
}

export default function* salaSaga() {
    yield takeLatest(actionTypes.GET_SALAS_ALL, asyncGetSalasAll);
    yield takeLatest(actionTypes.POST_SALA, asyncPostSala);
    // …un takeLatest por acción, sin watch* ni all()
}
```

`rootSaga` (`sagas/index.js`) sí usa `all([...])` para arrancar las 12 sagas de dominio.

**`showApiErrorToast` va en el `catch` de todas las sagas excepto `asyncPostLogin`**
(ver la regla de errores en `10-frontend.md`).

## Patrón de reducer — dispatch table

```js
const ACTIONS = {
  [SUCCESS_GET_ALGO]: (state, action) => ({ ...state, algo: action.response.data, loading: false }),
  [CLEAR_ALGO_WRITES]: (state) => ({ ...state, postAlgoSuccess: null, putAlgoSuccess: null }),
};
export default (state = initialState, action) => (ACTIONS[action.type]?.(state, action) ?? state);
```

## `CLEAR_*_WRITES` — limpieza granular

No usar `CLEAR_MADRE` tras una escritura: vacía el listado y produce carreras de render.
Usar `CLEAR_MADRE_WRITES`, que limpia solo los flags de escritura (`postMotherSuccess`,
`putMotherSuccess`) y deja intactos `madres` y `madreDetail`. Referencia: `motherReducer.js`.

Orden al montar una página que lista y escribe: `clear*` → `get*`.

## Cómo agregar una feature completa

1. `consts/actionTypes.js` → `GET_X`, `SUCCESS_GET_X`, `ERROR_X`, `CLEAR_X`, `CLEAR_X_WRITES`.
2. `api/index.js` → función HTTP con `AxiosInstance` (**contrastar antes con Swagger**,
   ver `30-api-contract.md`).
3. `actions/xActions.js` → creadores de acción.
4. `sagas/xSaga.js` → `async*` por operación + `takeLatest` en el default export.
5. `reducers/xReducer.js` → dispatch table con éxito/error/clear.
6. `reducers/index.js` → agregar al `combineReducers` si es un dominio nuevo.
7. `sagas/index.js` → agregar la saga al `all([...])` del `rootSaga`.
8. Page + template + organisms según `10-frontend.md`.

## Normalizadores de payload (usar siempre, no armar el body a mano)

| Helper | Archivo | Para qué |
|--------|---------|----------|
| `listBabysFromAbrazarResponse` | `utils/assignmentSelection.js` | normaliza las múltiples formas de la respuesta de bebés a abrazar |
| `resolveIdTareaForGenerarTareas` | `utils/assignmentSelection.js` | extrae `idTarea` del bebé para `generarTareas` |
| `normalizeEsEntradaForApi` | `utils/supplyMovementPayload.js` | string del form → boolean que espera el backend |
| `normalizeBabyApiPayload` | `utils/babyPayload.js` | BEBE con `idMadres[]`, pesos y diagnósticos |
| `normalizeMotherPayload` | `utils/motherFormValidation.js` | limpia campos auxiliares (`nombre_localidad`) |
| `normalizeVolunteerPayload` | `utils/volunteerFormValidation.js` | payload de voluntaria |
| `normalizeVisitaBody` | `redux/api/index.js` | `documentoVisitante` (int?), `telefonoVisitante` (long?) |
