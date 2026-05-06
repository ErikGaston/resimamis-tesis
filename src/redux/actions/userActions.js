import * as actionTypes from '../consts/actionTypes';

export function postLogin(param) {
    return {
        type: actionTypes.POST_LOGIN,
        payload: param
    };
}

export function clearLogin() {
    return {
        type: actionTypes.CLEAR_LOGIN,
    };
}

export function postUsuario(body) {
    return { type: actionTypes.POST_USUARIO, payload: body };
}

export function getUsuarioById(idUsuario) {
    return { type: actionTypes.GET_USUARIO_BY_ID, payload: idUsuario };
}

export function putUsuario(idUsuario, body) {
    return { type: actionTypes.PUT_USUARIO, payload: { idUsuario, body } };
}

export function postUsuarioDelete(idUsuario) {
    return { type: actionTypes.POST_USUARIO_DELETE, payload: idUsuario };
}

export function clearUserAdmin() {
    return { type: actionTypes.CLEAR_USER_ADMIN };
}
