import * as actionTypes from '../consts/actionTypes';

const initialState = {
    coordinacionHoy: null,
    coberturaHoy: null,
    bebesPorSala: null,
    bebesPorEstado: null,
    bebesRangoEdades: null,
    rankingVoluntarias: null,
    loading: false,
    error: null,
};

const ACTIONS = {
    [actionTypes.SUCCESS_GET_COORDINACION_HOY]: (state, action) =>
        ({ ...state, coordinacionHoy: action.response.data, error: null, loading: false }),
    [actionTypes.SUCCESS_GET_COBERTURA_HOY]: (state, action) =>
        ({ ...state, coberturaHoy: action.response.data, error: null, loading: false }),
    [actionTypes.SUCCESS_GET_BEBES_POR_SALA]: (state, action) =>
        ({ ...state, bebesPorSala: action.response.data, error: null, loading: false }),
    [actionTypes.SUCCESS_GET_BEBES_POR_ESTADO]: (state, action) =>
        ({ ...state, bebesPorEstado: action.response.data, error: null, loading: false }),
    [actionTypes.SUCCESS_GET_BEBES_RANGO_EDADES]: (state, action) =>
        ({ ...state, bebesRangoEdades: action.response.data, error: null, loading: false }),
    [actionTypes.SUCCESS_GET_RANKING_VOLUNTARIAS]: (state, action) =>
        ({ ...state, rankingVoluntarias: action.response.data, error: null, loading: false }),
    [actionTypes.ERROR_DASHBOARD]: (state, action) =>
        ({ ...state, error: action.response, loading: false }),
    [actionTypes.SHOW_LOADING]: (state, action) => ({ ...state, loading: action.payload }),
    [actionTypes.CLEAR_DASHBOARD]: () => ({ ...initialState }),
};

export default function dashboardReducer(state = initialState, action) {
    return ACTIONS[action.type]?.(state, action) ?? state;
}
