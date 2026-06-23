import * as actionTypes from '../consts/actionTypes';

export function getLocalities() {
    return {
        type: actionTypes.GET_LOCALITIES,
    };
}

export function getEstadosCiviles() {
    return {
        type: actionTypes.GET_ESTADOS_CIVILES,
    };
}