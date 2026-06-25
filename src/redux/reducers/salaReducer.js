import * as actionTypes from '../consts/actionTypes';

const initialState = {
    getSalasAll: null,
    postSala: null,
    putSala: null,
    postSalaDelete: null,
    loading: false,
    error: null,
};

export default function salaReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_GET_SALAS_ALL]: responseToReturn('getSalasAll'),
        [actionTypes.SUCCESS_POST_SALA]: responseToReturn('postSala'),
        [actionTypes.SUCCESS_PUT_SALA]: responseToReturn('putSala'),
        [actionTypes.SUCCESS_POST_SALA_DELETE]: responseToReturn('postSalaDelete'),
        [actionTypes.ERROR_SALA]: responseToReturn('error'),
        [actionTypes.CLEAR_SALA_WRITES]: clearSalaWrites(),
    };

    function responseToReturn(typeState) {
        let res = { ...state };
        if (action.response) {
            res = { ...state, [typeState]: action.response.data, loading: false };
            if (typeState !== 'error') res.error = null;
        }
        return res;
    }

    function showLoading() {
        if (action.type === 'SHOW_LOADING') {
            return { ...state, loading: action.payload };
        }
        return { ...state };
    }

    function clearSalaWrites() {
        if (action.type === actionTypes.CLEAR_SALA_WRITES) {
            return { ...state, postSala: null, putSala: null, postSalaDelete: null, error: null };
        }
        return { ...state };
    }

    let receiveAction = DEFAULT;
    if (ACTIONS[action.type] !== undefined) receiveAction = ACTIONS[action.type];
    return receiveAction;
}
