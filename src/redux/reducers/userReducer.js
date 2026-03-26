import * as actionTypes from '../consts/actionTypes';

const initialState = {
    postLogin: null,
    loading: false,
    error: null
};

export default function userReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_POST_LOGIN]: responseToReturn('postLogin'),
        [actionTypes.ERROR_LOGIN]: responseToReturn('error'),
        [actionTypes.CLEAR_LOGIN]: clearLogin()
    };

    function responseToReturn(typeState) {
        let res = { ...state };
        if (action.response) {
            res = { ...state, [typeState]: action.response.data, loading: false };
        }
        return res;
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