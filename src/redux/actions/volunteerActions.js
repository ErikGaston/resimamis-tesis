import * as actionTypes from '../consts/actionTypes';

export function postVolunteer(param) {
    return {
        type: actionTypes.POST_VOLUNTEER,
        payload: param
    };
}

export function postAssistance(param) {
    return {
        type: actionTypes.POST_ASSISTANCE,
        payload: param
    };
}

export function getVolunteersFree() {
    return {
        type: actionTypes.GET_VOLUNTEERS_FREE,
    };
}

export function getAssistance(param) {
    return {
        type: actionTypes.GET_ASSISTANCE,
        payload: param
    };
}

export function getVolunteersStates() {
    return {
        type: actionTypes.GET_VOLUNTEERS_STATES,
    };
}

export function getVolunteerById(id) {
    return {
        type: actionTypes.GET_VOLUNTEER_BY_ID,
        payload: id
    };
}

export function putVolunteer(param) {
    return {
        type: actionTypes.PUT_VOLUNTEER,
        payload: param
    };
}

export function getVolunteers() {
    return {
        type: actionTypes.GET_VOLUNTEERS,
    };
}

export function clearVolunteer() {
    return {
        type: actionTypes.CLEAR_VOLUNTEER,
    };
}