import * as actionTypes from '../consts/actionTypes';

const initialState = {
    postAssignmentGenerate: null,
    postAssignmentGenerateTarea: null,
    postDetailAssignment: null,
    loading: false,
    error: null,
    postStartHug: null,
    postEndHug: null,
    getDurationHug: null,
    getAssignmentToday: null,
    getAssignmentTodayById: null,
    getAssignmentById: null,
    getStatisticsAssignmentMonth: null,
    putAssignmentById: null,
    deleteAssignmentById: null,
    postResetAbrazosColgados: null,
};

export default function assignmentReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_POST_ASSIGNMENT_GENERATE]: responseToReturn('postAssignmentGenerate'),
        [actionTypes.SUCCESS_POST_ASSIGNMENT_GENERATE_TAREA]: responseToReturn('postAssignmentGenerateTarea'),
        [actionTypes.SUCCESS_POST_DETAIL_ASSIGNMENT]: responseToReturn('postDetailAssignment'),
        [actionTypes.SUCCESS_GET_ASSIGNMENT_BY_ID]: responseToReturn('getAssignmentById'),
        [actionTypes.SUCCESS_POST_START_HUG]: responseToReturn('postStartHug'),
        [actionTypes.SUCCESS_POST_END_HUG]: responseToReturn('postEndHug'),
        [actionTypes.SUCCESS_GET_DURATION_HUG]: responseToReturn('getDurationHug'),
        [actionTypes.SUCCESS_GET_ASSIGNMENT_TODAY]: responseToReturn('getAssignmentToday'),
        [actionTypes.SUCCESS_GET_ASSIGNMENT_TODAY_BY_ID]: responseToReturn('getAssignmentTodayById'),
        [actionTypes.SUCCESS_GET_STATISTICS_ASSIGNMENT_MONTH]: responseToReturn('getStatisticsAssignmentMonth'),
        [actionTypes.SUCCESS_PUT_ASSIGNMENT_BY_ID]: responseToReturn('putAssignmentById'),
        [actionTypes.SUCCESS_DELETE_ASSIGNMENT_BY_ID]: responseToReturn('deleteAssignmentById'),
        [actionTypes.SUCCESS_POST_RESET_ABRAZOS_COLGADOS]: responseToReturn('postResetAbrazosColgados'),
        [actionTypes.ERROR_ASSIGNMENT]: responseToReturn('error'),
        [actionTypes.CLEAR_ASSIGNMENT]: clearAssignment(),
        [actionTypes.CLEAR_ASSIGNMENT_WRITES]: clearAssignmentWrites(),
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

    function clearAssignment() {
        let res = { ...state };
        if (action.type === 'CLEAR_ASSIGNMENT') {
            res = {
                ...state, postAssignmentGenerate: null, postAssignmentGenerateTarea: null, error: null, postDetailAssignment: null,
                postStartHug: null, postEndHug: null, getDurationHug: null, getAssignmentToday: null, getAssignmentTodayById: null,
                getAssignmentById: null,
                getStatisticsAssignmentMonth: null,
                putAssignmentById: null,
                deleteAssignmentById: null,
                postResetAbrazosColgados: null,
            };
        }
        return res;
    }

    function clearAssignmentWrites() {
        if (action.type === 'CLEAR_ASSIGNMENT_WRITES') {
            return {
                ...state,
                putAssignmentById: null,
                deleteAssignmentById: null,
                postResetAbrazosColgados: null,
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