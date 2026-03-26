import * as actionTypes from '../consts/actionTypes';

export function getSupplies() {
    return {
        type: actionTypes.GET_SUPPLIES,
    };
}

export function getStatisticsSupplies() {
    return {
        type: actionTypes.GET_STATISTICS_SUPPLIES,
    };
}

export function clearSupply() {
    return {
        type: actionTypes.CLEAR_SUPPLY,
    };
}