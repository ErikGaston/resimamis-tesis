import * as actionTypes from '../consts/actionTypes';

const initialState = {
    getVisitas: null,
    getVisitasByBebe: null,
    getVisitaById: null,
    postVisita: null,
    putVisita: null,
    postVisitaDelete: null,
    loading: false,
    error: null,
};

export default function visitaReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_GET_VISITAS]: responseToReturn('getVisitas'),
        [actionTypes.SUCCESS_GET_VISITAS_BY_BEBE]: responseToReturn('getVisitasByBebe'),
        [actionTypes.SUCCESS_GET_VISITA_BY_ID]: responseToReturn('getVisitaById'),
        [actionTypes.SUCCESS_POST_VISITA]: responseToReturn('postVisita'),
        [actionTypes.SUCCESS_PUT_VISITA]: responseToReturn('putVisita'),
        [actionTypes.SUCCESS_POST_VISITA_DELETE]: responseToReturn('postVisitaDelete'),
        [actionTypes.ERROR_VISITA]: responseToReturn('error'),
        [actionTypes.CLEAR_VISITA_WRITES]: clearVisitaWrites(),
    };

    function responseToReturn(typeState) {
        let res = { ...state };
        if (action.response) {
            const patch = { [typeState]: action.response.data, loading: false };
            if (typeState !== 'error') patch.error = null;
            res = { ...state, ...patch };
        }
        return res;
    }

    function showLoading() {
        let res = { ...state };
        if (action.type === 'SHOW_LOADING') res = { ...state, loading: action.payload };
        return res;
    }

    function clearVisitaWrites() {
        if (action.type === 'CLEAR_VISITA_WRITES') {
            return {
                ...state,
                postVisita: null,
                putVisita: null,
                postVisitaDelete: null,
                error: null,
            };
        }
        return { ...state };
    }

    let receiveAction = DEFAULT;
    if (ACTIONS[action.type] !== undefined) receiveAction = ACTIONS[action.type];
    return receiveAction;
}
