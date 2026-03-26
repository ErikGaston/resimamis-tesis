import * as actionTypes from '../consts/actionTypes';

export function showLoading(param) {
    return {
        type: actionTypes.SHOW_LOADING,
        payload: param
    };
}