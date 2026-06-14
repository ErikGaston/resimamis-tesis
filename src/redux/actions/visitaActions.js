import * as actionTypes from '../consts/actionTypes';

export function getVisitas() {
    return { type: actionTypes.GET_VISITAS };
}

export function getVisitasByBebe(idBebe) {
    return { type: actionTypes.GET_VISITAS_BY_BEBE, payload: idBebe };
}

export function getVisitaById(idVisita) {
    return { type: actionTypes.GET_VISITA_BY_ID, payload: idVisita };
}

export function postVisita(body) {
    return { type: actionTypes.POST_VISITA, payload: body };
}

export function putVisita(idVisita, body) {
    return { type: actionTypes.PUT_VISITA, payload: { idVisita, body } };
}

export function postVisitaDelete(idVisita) {
    return { type: actionTypes.POST_VISITA_DELETE, payload: idVisita };
}

export function clearVisitaWrites() {
    return { type: actionTypes.CLEAR_VISITA_WRITES };
}
