import * as actionTypes from '../consts/actionTypes';

const initialState = {
    getSupplies: null,
    getStatisticsSupplies: null,
    postSupplyConsultMovements: null,
    getSupplyProviders: null,
    postSupplyRegisterMovement: null,
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
        [actionTypes.ERROR_SUPPLY]: responseToReturn('error'),
        [actionTypes.CLEAR_SUPPLY]: clearSupply(),
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