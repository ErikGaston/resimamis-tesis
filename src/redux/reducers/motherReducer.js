import * as actionTypes from '../consts/actionTypes';

const initialState = {
    postMother: null,
    getStatisticsLocalities: null,
    getStatisticsAgeMother: null,
    getMother: null,
    getMotherId: null,
    loading: false,
    error: null,
    putMother: null,
    postMotherDelete: null,
};

export default function motherReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_POST_MOTHER]: responseToReturn('postMother'),
        [actionTypes.SUCCESS_GET_MOTHER]: responseToReturn('getMother'),
        [actionTypes.SUCCESS_GET_MOTHER_ID]: responseToReturn('getMotherId'),
        [actionTypes.SUCCESS_GET_STATISTICS_LOCALITIES]: responseToReturn('getStatisticsLocalities'),
        [actionTypes.SUCCESS_GET_STATISTICS_AGE_MOTHER]: responseToReturn('getStatisticsAgeMother'),
        [actionTypes.ERROR_MOTHER]: responseToReturn('error'),
        [actionTypes.CLEAR_MOTHER_API_ERROR]: clearMotherApiError(),
        [actionTypes.CLEAR_MOTHER]: clearMother(),
        [actionTypes.CLEAR_MOTHER_WRITES]: clearMotherWrites(),
        [actionTypes.SUCCESS_PUT_MOTHER]: responseToReturn('putMother'),
        [actionTypes.SUCCESS_POST_MOTHER_DELETE]: responseToReturn('postMotherDelete'),

    };

    function responseToReturn(typeState) {
        let res = { ...state };
        if (action.response) {
            const patch = { [typeState]: action.response.data, loading: false };
            if (typeState !== 'error') {
                patch.error = null;
            }
            res = { ...state, ...patch };
        }
        return res;
    }

    function clearMotherApiError() {
        return { ...state, error: null };
    }

    function showLoading() {
        let res = { ...state };
        if (action.type === 'SHOW_LOADING') {
            res = { ...state, loading: action.payload };
        }
        return res;
    }

    function clearMother() {
        let res = { ...state };
        if (action.type === 'CLEAR_MOTHER') {
            res = {
                ...state, postMother: null, error: null, getMother: null,
                getStatisticsLocalities: null, getStatisticsAgeMother: null, putMother: null,
                postMotherDelete: null,
            };
        }
        return res;
    }

    function clearMotherWrites() {
        if (action.type === 'CLEAR_MOTHER_WRITES') {
            return {
                ...state,
                postMother: null,
                putMother: null,
                postMotherDelete: null,
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