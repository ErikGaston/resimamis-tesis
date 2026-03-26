import * as actionTypes from '../consts/actionTypes';

const initialState = {
    postAssignmentGenerate: null,
    postDetailAssignment: null,
    loading: false,
    error: null,
    postStartHug: null,
    postEndHug: null,
    getDurationHug: null,
    getAssignmentToday: null,
    getAssignmentTodayById: null,
    getStatisticsAssignmentMonth: null,
};

export default function assignmentReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_POST_ASSIGNMENT_GENERATE]: responseToReturn('postAssignmentGenerate'),
        [actionTypes.SUCCESS_POST_DETAIL_ASSIGNMENT]: responseToReturn('postDetailAssignment'),
        [actionTypes.SUCCESS_POST_START_HUG]: responseToReturn('postStartHug'),
        [actionTypes.SUCCESS_POST_END_HUG]: responseToReturn('postEndHug'),
        [actionTypes.SUCCESS_GET_DURATION_HUG]: responseToReturn('getDurationHug'),
        [actionTypes.SUCCESS_GET_ASSIGNMENT_TODAY]: responseToReturn('getAssignmentToday'),
        [actionTypes.SUCCESS_GET_ASSIGNMENT_TODAY_BY_ID]: responseToReturn('getAssignmentTodayById'),
        [actionTypes.SUCCESS_GET_STATISTICS_ASSIGNMENT_MONTH]: responseToReturn('getStatisticsAssignmentMonth'),
        [actionTypes.ERROR_ASSIGNMENT]: responseToReturn('error'),
        [actionTypes.CLEAR_ASSIGNMENT]: clearAssignment(),
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

    function clearAssignment() {
        let res = { ...state };
        if (action.type === 'CLEAR_ASSIGNMENT') {
            res = {
                ...state, postAssignmentGenerate: null, error: null, postDetailAssignment: null,
                postStartHug: null, postEndHug: null, getDurationHug: null, getAssignmentToday: null, getAssignmentTodayById: null,
                getStatisticsAssignmentMonth: null
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