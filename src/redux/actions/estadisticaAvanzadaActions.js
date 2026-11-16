import * as actionTypes from '../consts/actionTypes';

export function getEstadisticaAvanzada(tipo, params) {
    return { type: actionTypes.GET_ESTADISTICA_AVANZADA, payload: { tipo, params } };
}

export function clearEstadisticaAvanzada() {
    return { type: actionTypes.CLEAR_ESTADISTICA_AVANZADA };
}
