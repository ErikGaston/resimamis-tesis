import * as actionTypes from '../consts/actionTypes';

const initialState = {
    getBabys: null,
    postBaby: null,
    putBaby: null,
    loading: false,
    error: null,
    getBabysFree: null,
    getBabySalas: null,
    getBabyByDni: null,
    postBabyDelete: null,
    getBabyWeightEvolution: null,
    getBabyPermanencia: null,
};

export default function babyReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_GET_BABYS]: responseToReturn('getBabys'),
        [actionTypes.SUCCESS_POST_BABY]: responseToReturn('postBaby'),
        [actionTypes.SUCCESS_PUT_BABY]: responseToReturn('putBaby'),
        [actionTypes.SUCCESS_GET_BABYS_FREE]: responseToReturn('getBabysFree'),
        [actionTypes.SUCCESS_GET_BABY_SALAS]: responseToReturn('getBabySalas'),
        [actionTypes.SUCCESS_GET_BABY_BY_DNI]: responseToReturn('getBabyByDni'),
        [actionTypes.SUCCESS_POST_BABY_DELETE]: responseToReturn('postBabyDelete'),
        [actionTypes.SUCCESS_GET_BABY_WEIGHT_EVOLUTION]: responseToReturn('getBabyWeightEvolution'),
        [actionTypes.SUCCESS_GET_BABY_PERMANENCIA]: responseToReturn('getBabyPermanencia'),
        [actionTypes.ERROR_BABY]: responseToReturn('error'),
        [actionTypes.CLEAR_BABY]: clearBaby(),
        [actionTypes.CLEAR_BABY_WRITES]: clearBabyWrites(),
    };

    function responseToReturn(typeState) {
        let res = { ...state };
        if (action.response) {
            const payload = action.response.data;
            if (typeState === 'getBabys' || typeState === 'postBaby' || typeState === 'putBaby' || typeState === 'getBabysFree'
                || typeState === 'getBabySalas' || typeState === 'getBabyByDni' || typeState === 'postBabyDelete'
                || typeState === 'getBabyWeightEvolution' || typeState === 'getBabyPermanencia') {
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
                ...state,
                postBaby: null,
                putBaby: null,
                error: null,
                getBabysFree: null,
                getBabySalas: null,
                getBabyByDni: null,
                postBabyDelete: null,
                getBabyWeightEvolution: null,
                getBabyPermanencia: null,
            };
        }
        return res;
    }

    function clearBabyWrites() {
        if (action.type === 'CLEAR_BABY_WRITES') {
            return {
                ...state,
                postBaby: null,
                putBaby: null,
                postBabyDelete: null,
                error: null,
            };
        }
        return { ...state };
    }

    let receiveAction = DEFAULT;

    if (ACTIONS[action.type] !== undefined) {
        receiveAction = ACTIONS[action.type];
    }

    return receiveAction;
}