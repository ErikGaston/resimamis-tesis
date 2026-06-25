import * as actionTypes from '../consts/actionTypes';

export function getSalasAll() {
    return { type: actionTypes.GET_SALAS_ALL };
}

export function postSala(body) {
    return { type: actionTypes.POST_SALA, payload: body };
}

export function putSala(idSala, body) {
    return { type: actionTypes.PUT_SALA, payload: { idSala, body } };
}

export function postSalaDelete(idSala) {
    return { type: actionTypes.POST_SALA_DELETE, payload: idSala };
}

export function clearSalaWrites() {
    return { type: actionTypes.CLEAR_SALA_WRITES };
}
