import * as actionTypes from '../consts/actionTypes';

const initialState = {
    historialBajas: null,
    diasTurnos: null,
    reporteDiario: null,
    visitasEstadisticas: null,
    loading: false,
    error: null,
};

const guardar = (clave) => (state, action) => ({
    ...state,
    [clave]: action.response?.data?.data ?? null,
    loading: false,
    error: null,
});

const ACTIONS = {
    [actionTypes.GET_HISTORIAL_BAJAS]: (state) => ({ ...state, loading: true }),
    [actionTypes.GET_DIAS_TURNOS]: (state) => ({ ...state, loading: true }),
    [actionTypes.GET_REPORTE_DIARIO]: (state) => ({ ...state, loading: true }),
    [actionTypes.GET_VISITAS_ESTADISTICAS]: (state) => ({ ...state, loading: true }),
    [actionTypes.SUCCESS_GET_HISTORIAL_BAJAS]: guardar('historialBajas'),
    [actionTypes.SUCCESS_GET_DIAS_TURNOS]: guardar('diasTurnos'),
    [actionTypes.SUCCESS_GET_REPORTE_DIARIO]: guardar('reporteDiario'),
    [actionTypes.SUCCESS_GET_VISITAS_ESTADISTICAS]: guardar('visitasEstadisticas'),
    [actionTypes.ERROR_REPORTE]: (state, action) => ({ ...state, loading: false, error: action.response ?? true }),
    [actionTypes.CLEAR_REPORTE]: () => initialState,
};

export default function reporteReducer(state = initialState, action) {
    return ACTIONS[action.type]?.(state, action) ?? state;
}
