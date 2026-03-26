import * as actionTypes from '../consts/actionTypes';

export function postBaby(param) {
    return {
        type: actionTypes.POST_BABY,
        payload: param
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


export function clearBaby() {
    return {
        type: actionTypes.CLEAR_BABY,
    };
}

