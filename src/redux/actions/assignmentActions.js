import * as actionTypes from '../consts/actionTypes';

export function postAssignmentGenerate() {
    return {
        type: actionTypes.POST_ASSIGNMENT_GENERATE,
    };
}

export function postDetailAssignment(param) {
    return {
        type: actionTypes.POST_DETAIL_ASSIGNMENT,
        payload: param
    };
}

export function postStartHug(param) {
    return {
        type: actionTypes.POST_START_HUG,
        payload: param
    };
}

export function postEndHug(param) {
    return {
        type: actionTypes.POST_END_HUG,
        payload: param
    };
}

export function getDurationHug() {
    return {
        type: actionTypes.GET_DURATION_HUG,
    };
}

export function getAssignmentToday() {
    return {
        type: actionTypes.GET_ASSIGNMENT_TODAY,
    };
}

export function getAssignmentTodayById(param) {
    return {
        type: actionTypes.GET_ASSIGNMENT_TODAY_BY_ID,
        payload: param
    };
}

export function clearAssignment() {
    return {
        type: actionTypes.CLEAR_ASSIGNMENT,
    };
}

export function getStatisticsAssignmentMonth() {
    return {
        type: actionTypes.GET_STATISTICS_ASSIGNMENT_MONTH,
    };
}