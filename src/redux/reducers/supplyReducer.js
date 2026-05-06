import * as actionTypes from '../consts/actionTypes';

const initialState = {
    getSupplies: null,
    getStatisticsSupplies: null,
    postSupplyConsultMovements: null,
    getSupplyProviders: null,
    postSupplyRegisterMovement: null,
    postSupplyCreate: null,
    getSupplyById: null,
    putSupplyById: null,
    postSupplyDelete: null,
    loading: false,
    error: null
};

export default function supplyReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_GET_SUPPLIES]: responseToReturn('getSupplies'),
        [actionTypes.SUCCESS_GET_STATISTICS_SUPPLIES]: responseToReturn('getStatisticsSupplies'),
        [actionTypes.SUCCESS_POST_SUPPLY_CONSULT_MOVEMENTS]: responseToReturn('postSupplyConsultMovements'),
        [actionTypes.SUCCESS_GET_SUPPLY_PROVIDERS]: responseToReturn('getSupplyProviders'),
        [actionTypes.SUCCESS_POST_SUPPLY_REGISTER_MOVEMENT]: responseToReturn('postSupplyRegisterMovement'),
        [actionTypes.SUCCESS_POST_SUPPLY_CREATE]: responseToReturn('postSupplyCreate'),
        [actionTypes.SUCCESS_GET_SUPPLY_BY_ID]: responseToReturn('getSupplyById'),
        [actionTypes.SUCCESS_PUT_SUPPLY_BY_ID]: responseToReturn('putSupplyById'),
        [actionTypes.SUCCESS_POST_SUPPLY_DELETE]: responseToReturn('postSupplyDelete'),
        [actionTypes.ERROR_SUPPLY]: responseToReturn('error'),
        [actionTypes.CLEAR_SUPPLY]: clearSupply(),
        [actionTypes.CLEAR_SUPPLY_WRITES]: clearSupplyWrites(),
    };

    function responseToReturn(typeState) {
        let res = { ...state };
        if (action.response) {
            res = { ...state, [typeState]: action.response.data, loading: false };
            if (typeState !== 'error') {
                res.error = null;
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

    function clearSupply() {
        let res = { ...state };
        if (action.type === 'CLEAR_SUPPLY') {
            res = {
                ...state,
                getSupplies: null,
                error: null,
                getStatisticsSupplies: null,
                postSupplyConsultMovements: null,
                getSupplyProviders: null,
                postSupplyRegisterMovement: null,
                postSupplyCreate: null,
                getSupplyById: null,
                putSupplyById: null,
                postSupplyDelete: null,
            };
        }
        return res;
    }

    function clearSupplyWrites() {
        if (action.type === 'CLEAR_SUPPLY_WRITES') {
            return {
                ...state,
                putSupplyById: null,
                postSupplyDelete: null,
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