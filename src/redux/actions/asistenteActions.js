import * as actionTypes from '../consts/actionTypes';

export function getAsistenteEstado() {
    return { type: actionTypes.GET_ASISTENTE_ESTADO };
}

/** @param {{ pregunta: string, historial?: Array<{ rol: string, contenido: string }> }} payload */
export function postAsistentePregunta(payload) {
    return { type: actionTypes.POST_ASISTENTE_PREGUNTA, payload };
}

export function clearAsistente() {
    return { type: actionTypes.CLEAR_ASISTENTE };
}
