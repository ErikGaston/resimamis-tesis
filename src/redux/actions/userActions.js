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
