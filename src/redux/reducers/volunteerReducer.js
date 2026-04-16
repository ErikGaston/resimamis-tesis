import * as actionTypes from '../consts/actionTypes';

const initialState = {
    postVolunteer: null,
    putVolunteer: null,
    loading: false,
    error: null,
    postAssistance: null,
    postAssistanceSalida: null,
    getAssistanceToday: null,
    getAssistanceHistoricas: null,
    getVolunteersFree: null,
    getVolunteers: null,
    getAssistance: null,
    getVolunteerStates: [],
    getVolunteer: null
};

export default function volunteerReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_POST_VOLUNTEER]: responseToReturn('postVolunteer'),
        [actionTypes.SUCCESS_POST_ASSISTANCE]: responseToReturn('postAssistance'),
        [actionTypes.SUCCESS_POST_ASSISTANCE_SALIDA]: responseToReturn('postAssistanceSalida'),
        [actionTypes.SUCCESS_GET_ASSISTANCE_TODAY]: responseToReturn('getAssistanceToday'),
        [actionTypes.SUCCESS_GET_ASSISTANCE_HISTORICAS]: responseToReturn('getAssistanceHistoricas'),
        [actionTypes.SUCCESS_GET_VOLUNTEERS_FREE]: responseToReturn('getVolunteersFree'),
        [actionTypes.SUCCESS_GET_ASSISTANCE]: responseToReturn('getAssistance'),
        [actionTypes.SUCCESS_GET_VOLUNTEERS_STATES]: responseToReturn('getVolunteerStates'),
        [actionTypes.SUCCESS_GET_VOLUNTEER_BY_ID]: responseToReturn('getVolunteer'),
        [actionTypes.SUCCESS_GET_VOLUNTEERS]: responseToReturn('getVolunteers'),
        [actionTypes.SUCCESS_PUT_VOLUNTEER]: responseToReturn('putVolunteer'),
        [actionTypes.ERROR_VOLUNTEER]: responseToReturn('error'),
        [actionTypes.CLEAR_VOLUNTEER]: clearVolunteer(),
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

    function clearVolunteer() {
        let res = { ...state };
        if (action.type === 'CLEAR_VOLUNTEER') {
            res = {
                ...state,
                postVolunteer: null,
                postAssistanceSalida: null,
                getAssistanceToday: null,
                getAssistanceHistoricas: null,
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