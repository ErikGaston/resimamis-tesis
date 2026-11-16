import * as actionTypes from '../consts/actionTypes';

const initialState = {
    porTipo: {},
    cargando: null,
    error: null,
};

const ACTIONS = {
    [actionTypes.GET_ESTADISTICA_AVANZADA]: (state, action) => ({ ...state, cargando: action.payload.tipo, error: null }),
    [actionTypes.SUCCESS_GET_ESTADISTICA_AVANZADA]: (state, action) => ({
        ...state,
        porTipo: { ...state.porTipo, [action.tipo]: action.response?.data?.data ?? null },
        cargando: null,
    }),
    [actionTypes.ERROR_ESTADISTICA_AVANZADA]: (state, action) => ({ ...state, cargando: null, error: action.response ?? true }),
    [actionTypes.CLEAR_ESTADISTICA_AVANZADA]: () => initialState,
};

export default function estadisticaAvanzadaReducer(state = initialState, action) {
    return ACTIONS[action.type]?.(state, action) ?? state;
}
