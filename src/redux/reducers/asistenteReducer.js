import * as actionTypes from '../consts/actionTypes';

const initialState = {
    estado: null,
    ultimaRespuesta: null,
    consultando: false,
    error: null,
};

const ACTIONS = {
    [actionTypes.GET_ASISTENTE_ESTADO]: (state) => ({ ...state, error: null }),
    [actionTypes.SUCCESS_GET_ASISTENTE_ESTADO]: (state, action) =>
        ({ ...state, estado: action.response.data, error: null }),
    // `consultando` es propio del asistente y no usa el loading global: la
    // pantalla muestra la burbuja "escribiendo…" sin bloquear el resto.
    [actionTypes.POST_ASISTENTE_PREGUNTA]: (state) =>
        ({ ...state, consultando: true, error: null }),
    [actionTypes.SUCCESS_POST_ASISTENTE_PREGUNTA]: (state, action) =>
        ({ ...state, ultimaRespuesta: action.response.data, consultando: false, error: null }),
    [actionTypes.ERROR_ASISTENTE]: (state, action) =>
        ({ ...state, error: action.response, consultando: false }),
    [actionTypes.CLEAR_ASISTENTE]: () => ({ ...initialState }),
};

export default function asistenteReducer(state = initialState, action) {
    return ACTIONS[action.type]?.(state, action) ?? state;
}
