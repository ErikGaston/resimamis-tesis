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
    getAssistanceReporte: null,
    getAssistanceAll: null,
    postAssistanceDelete: null,
    postVolunteerDelete: null,
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
        [actionTypes.SUCCESS_GET_ASSISTANCE_REPORTE]: responseToReturn('getAssistanceReporte'),
        [actionTypes.SUCCESS_GET_ASSISTANCE_ALL]: responseToReturn('getAssistanceAll'),
        [actionTypes.SUCCESS_POST_ASSISTANCE_DELETE]: responseToReturn('postAssistanceDelete'),
        [actionTypes.SUCCESS_POST_VOLUNTEER_DELETE]: responseToReturn('postVolunteerDelete'),
        [actionTypes.SUCCESS_GET_VOLUNTEERS_FREE]: responseToReturn('getVolunteersFree'),
        [actionTypes.SUCCESS_GET_ASSISTANCE]: responseToReturn('getAssistance'),
        [actionTypes.SUCCESS_GET_VOLUNTEERS_STATES]: responseToReturn('getVolunteerStates'),
        [actionTypes.SUCCESS_GET_VOLUNTEER_BY_ID]: responseToReturn('getVolunteer'),
        [actionTypes.SUCCESS_GET_VOLUNTEERS]: responseToReturn('getVolunteers'),
        [actionTypes.SUCCESS_PUT_VOLUNTEER]: responseToReturn('putVolunteer'),
        [actionTypes.ERROR_VOLUNTEER]: responseToReturn('error'),
        [actionTypes.CLEAR_VOLUNTEER]: clearVolunteer(),
        [actionTypes.CLEAR_VOLUNTEER_WRITES]: clearVolunteerWrites(),
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

    function clearVolunteer() {
        if (action.type === 'CLEAR_VOLUNTEER') {
            return { ...initialState };
        }
        return { ...state };
    }

    function clearVolunteerWrites() {
        if (action.type === 'CLEAR_VOLUNTEER_WRITES') {
            return {
                ...state,
                postAssistanceDelete: null,
                postVolunteerDelete: null,
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