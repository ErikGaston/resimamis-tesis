---
name: nueva-feature-redux
description: Guía paso a paso para agregar una feature completa que consuma un endpoint del backend en Resimamis — actionTypes, función API, actions, saga, reducer, cableado en el store y pantalla. Usar al integrar un endpoint nuevo, crear un dominio Redux nuevo, o cuando se pida agregar una pantalla que traiga o escriba datos del backend.
argument-hint: "[nombre del dominio, ej: dashboard]"
---

# Agregar una feature Redux completa

Los 7 pasos son obligatorios: saltear uno deja la feature a medio cablear. El slice `tarea`
del repo es exactamente eso — actions, saga y reducer completos que **ninguna página despacha**.

Antes de escribir código, **leer el controller del backend** en `resimamis/Controllers/`.
La skill `sync-api-contract` cubre cómo verificar el contrato.

## 1. `src/redux/consts/actionTypes.js`

```js
export const GET_X = 'GET_X';
export const SUCCESS_GET_X = 'SUCCESS_GET_X';
export const ERROR_X = 'ERROR_X';
export const CLEAR_X = 'CLEAR_X';
export const CLEAR_X_WRITES = 'CLEAR_X_WRITES';
```

## 2. `src/redux/api/index.js`

Rutas **relativas, sin `/api/`** (ya viene en `VITE_URL_API`) y en minúsculas.

```js
const getX = (payload) => AxiosInstance.get('/x/', { params: payload });
const postXDelete = (idX) => AxiosInstance.post(`/x/delete?idX=${idX}`);   // body vacío
```

Si el body necesita transformarse, el normalizador va en `src/utils/`, no inline en la saga.

## 3. `src/redux/actions/xActions.js`

## 4. `src/redux/sagas/xSaga.js`

Sin funciones `watch*` y sin `all()` — ese patrón no se usa acá:

```js
import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../consts/actionTypes';
import * as API from '../api';
import { showApiErrorToast } from './showApiErrorToast';

function* asyncGetX({ payload }) {
    try {
        const response = yield call(API.getX, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_X, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_X, response: error });
    }
}

export default function* xSaga() {
    yield takeLatest(actionTypes.GET_X, asyncGetX);
}
```

`showApiErrorToast` va en el `catch` de **toda** saga; login es la única excepción.

## 5. `src/redux/reducers/xReducer.js`

Dispatch table. Incluir siempre `CLEAR_X_WRITES`, que limpia solo los flags de escritura y
**no** vacía los listados:

```js
const ACTIONS = {
  [SUCCESS_GET_X]: (state, action) => ({ ...state, x: action.response.data, loading: false }),
  [CLEAR_X_WRITES]: (state) => ({ ...state, postXSuccess: null, putXSuccess: null }),
};
export default (state = initialState, action) => (ACTIONS[action.type]?.(state, action) ?? state);
```

El backend devuelve `{ data }` en éxito, así que el payload útil está en `action.response.data`.

## 6. `src/redux/reducers/index.js` — agregar al `combineReducers`

## 7. `src/redux/sagas/index.js` — agregar la saga al `all([...])` del `rootSaga`

## 8. Pantalla

`page` (conecta Redux, arma handlers) → `template` (solo props) → organisms → molecules → atoms.
**Solo la page usa `useSelector`/`useDispatch`.**

Al montar una pantalla que lista y escribe, el orden es `clear*` → `get*`, para evitar la
carrera con el listado.

### Errores

La saga ya mostró el toast. En la página, el efecto de error solo corta el loading:

```jsx
useEffect(() => {
  if (reducer?.error != null) dispatch(showLoading(false));
}, [reducer?.error]);
```

No leer `reducer.error` para mostrarlo en un `Alert` o `DialogSuccess`: duplica el toast.

## 9. Cerrar

- Comentarios: solo donde el código no se explique solo.
- Actualizar `.claude/rules/30-api-contract.md` (mapeo función API → saga) y, si integraste un
  endpoint que figuraba como pendiente, `docs/cobertura-api.md`.
