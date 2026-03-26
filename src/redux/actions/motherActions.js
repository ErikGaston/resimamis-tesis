import * as actionTypes from '../consts/actionTypes';

export function postMother(param) {
    return {
        type: actionTypes.POST_MOTHER,
        payload: param
    };
}

export function getMother() {
    return {
        type: actionTypes.GET_MOTHER,
    };
}

export function getMotherId(param) {
    return {
        type: actionTypes.GET_MOTHER_ID,
        payload: param
    };
}

export function getStatisticsLocalities() {
    return {
        type: actionTypes.GET_STATISTICS_LOCALITIES,
    };
}


export function getStatisticsAgeMother() {
    return {
        type: actionTypes.GET_STATISTICS_AGE_MOTHER,
    };
}

export function clearMother() {
    return {
        type: actionTypes.CLEAR_MOTHER,
    };
}

export function putMother(param) {
    return {
        type: actionTypes.PUT_MOTHER,
        payload: param
    };
}