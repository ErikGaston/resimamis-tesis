import * as actionTypes from '../consts/actionTypes';

export function postBaby(param) {
    return {
        type: actionTypes.POST_BABY,
        payload: param
    };
}

export function putBaby(param) {
    return {
        type: actionTypes.PUT_BABY,
        payload: param,
    };
}

export function getBabySalas() {
    return {
        type: actionTypes.GET_BABY_SALAS,
    };
}

export function getBabysFree() {
    return {
        type: actionTypes.GET_BABYS_FREE,
    };
}

export function getBabys() {
    return {
        type: actionTypes.GET_BABYS
    };
}

export function getBabyByDni(dni) {
    return {
        type: actionTypes.GET_BABY_BY_DNI,
        payload: dni,
    };
}

export function postBabyDelete(idBebe) {
    return {
        type: actionTypes.POST_BABY_DELETE,
        payload: idBebe,
    };
}


export function clearBaby() {
    return {
        type: actionTypes.CLEAR_BABY,
    };
}

export function clearBabyWrites() {
    return { type: actionTypes.CLEAR_BABY_WRITES };
}

