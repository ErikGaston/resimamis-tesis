import * as actionTypes from '../consts/actionTypes';

const initialState = {
    getBabys: null,
    postBaby: null,
    loading: false,
    error: null,
    getBabysFree: null
};

export default function babyReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_GET_BABYS]: responseToReturn('getBabys'),
        [actionTypes.SUCCESS_POST_BABY]: responseToReturn('postBaby'),
        [actionTypes.SUCCESS_GET_BABYS_FREE]: responseToReturn('getBabysFree'),
        [actionTypes.ERROR_BABY]: responseToReturn('error'),
        [actionTypes.CLEAR_BABY]: clearBaby(),
    };

    function responseToReturn(typeState) {
        let res = { ...state };
        if (action.response) {
            const payload = action.response.data;
            if (typeState === 'getBabys' || typeState === 'postBaby' || typeState === 'getBabysFree') {
                res = { ...state, [typeState]: payload, error: null, loading: false };
            } else {
                res = { ...state, [typeState]: payload, loading: false };
            }
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

    function clearBaby() {
        let res = { ...state };
        if (action.type === 'CLEAR_BABY') {
            res = {
                ...state, postBaby: null, error: null, getBabysFree: null,
            };
        }
        return res;
    }

    let receiveAction = DEFAULT;

    if (ACTIONS[action.type] !== undefined) {
        receiveAction = ACTIONS[action.type];
    }

    return receiveAction;
}