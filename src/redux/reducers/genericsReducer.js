import * as actionTypes from '../consts/actionTypes';

const initialState = {
    getLocalities: null,
    getEstadosCiviles: null,
    loading: false,
    error: null
};

export default function genericsReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_GET_LOCALITIES]: responseToReturn('getLocalities'),
        [actionTypes.ERROR_LOCALITIES]: responseToReturn('error'),
        [actionTypes.SUCCESS_GET_ESTADOS_CIVILES]: responseToReturn('getEstadosCiviles'),
        [actionTypes.ERROR_ESTADOS_CIVILES]: responseToReturn('error'),
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

    let receiveAction = DEFAULT;

    if (ACTIONS[action.type] !== undefined) {
        receiveAction = ACTIONS[action.type];
    }

    return receiveAction;
}