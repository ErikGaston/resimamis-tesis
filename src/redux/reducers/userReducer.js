import * as actionTypes from '../consts/actionTypes';

const initialState = {
    postLogin: null,
    loading: false,
    error: null,
    postUsuario: null,
    getUsuarioById: null,
    putUsuario: null,
    postUsuarioDelete: null,
    userAdminError: null,
};

export default function userReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_POST_LOGIN]: responseToReturn('postLogin'),
        [actionTypes.ERROR_LOGIN]: responseToReturn('error'),
        [actionTypes.CLEAR_LOGIN]: clearLogin(),
        [actionTypes.SUCCESS_POST_USUARIO]: responseToReturn('postUsuario'),
        [actionTypes.SUCCESS_GET_USUARIO_BY_ID]: responseToReturn('getUsuarioById'),
        [actionTypes.SUCCESS_PUT_USUARIO]: responseToReturn('putUsuario'),
        [actionTypes.SUCCESS_POST_USUARIO_DELETE]: responseToReturn('postUsuarioDelete'),
        [actionTypes.ERROR_USER]: userAdminError(),
        [actionTypes.CLEAR_USER_ADMIN]: clearUserAdmin(),
    };

    function responseToReturn(typeState) {
        let res = { ...state };
        if (action.response) {
            const payload = action.response.data;
            if (typeState === 'postLogin') {
                res = { ...state, postLogin: payload, error: null, loading: false };
            } else if (['postUsuario', 'getUsuarioById', 'putUsuario', 'postUsuarioDelete'].includes(typeState)) {
                res = {
                    ...state,
                    [typeState]: payload,
                    userAdminError: null,
                    loading: false,
                };
            } else {
                res = { ...state, [typeState]: payload, loading: false };
            }
        }
        return res;
    }

    function userAdminError() {
        if (action.type === 'ERROR_USER') {
            return { ...state, userAdminError: action.response, loading: false };
        }
        return { ...state };
    }

    function clearUserAdmin() {
        if (action.type === 'CLEAR_USER_ADMIN') {
            return {
                ...state,
                postUsuario: null,
                getUsuarioById: null,
                putUsuario: null,
                postUsuarioDelete: null,
                userAdminError: null,
            };
        }
        return { ...state };
    }

    function showLoading() {
        let res = { ...state };
        if (action.type === 'SHOW_LOADING') {
            res = { ...state, loading: action.payload };
        }
        return res;
    }

    function clearLogin() {
        let res = { ...state };
        if (action.type === 'CLEAR_LOGIN') {
            res = { ...state, postLogin: null, error: null };
        }
        return res;
    }

    let receiveAction = DEFAULT;

    if (ACTIONS[action.type] !== undefined) {
        receiveAction = ACTIONS[action.type];
    }

    return receiveAction;
}