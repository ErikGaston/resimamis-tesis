import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../consts/actionTypes";
import * as API from "../api";

function* asyncPostAssignmentGenerate() {
    try {
        let response = yield call(API.postAssignmentGenerate);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_ASSIGNMENT_GENERATE,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_ASSIGNMENT,
            response: error,
            message: error.mensaje,
        });
    }
}

function* asyncPostDetailAssignment({ payload }) {
    try {
        let response = yield call(API.postDetailAssignment, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_DETAIL_ASSIGNMENT,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_ASSIGNMENT,
            response: error,
            message: error.message,
        });
    }
}

function* asyncPostStartHug({ payload }) {
    try {
        let response = yield call(API.postStartHug, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_START_HUG,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_ASSIGNMENT,
            response: error,
            message: error.message,
        });
    }
}

function* asyncPostEndHug({ payload }) {
    try {
        let response = yield call(API.postEndHug, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_END_HUG,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_ASSIGNMENT,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetDurationHug() {
    try {
        let response = yield call(API.getDurationHug);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_DURATION_HUG,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_ASSIGNMENT,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetAssignmentToday() {
    try {
        let response = yield call(API.getAssignmentToday);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_ASSIGNMENT_TODAY,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_ASSIGNMENT,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetAssignmentTodayById({ payload }) {
    try {
        let response = yield call(API.getAssignmentTodayById, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_ASSIGNMENT_TODAY_BY_ID,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_ASSIGNMENT,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetStatisticsAssignmentMonth() {
    try {
        let response = yield call(API.getStatisticsAssignmentMonth);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_STATISTICS_ASSIGNMENT_MONTH,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_ASSIGNMENT,
            response: error,
            message: error.message,
        });
    }
}

export default function* assignmentSaga() {
    yield takeLatest(actionTypes.POST_ASSIGNMENT_GENERATE, asyncPostAssignmentGenerate);
    yield takeLatest(actionTypes.POST_DETAIL_ASSIGNMENT, asyncPostDetailAssignment);
    yield takeLatest(actionTypes.POST_START_HUG, asyncPostStartHug);
    yield takeLatest(actionTypes.POST_END_HUG, asyncPostEndHug);
    yield takeLatest(actionTypes.GET_ASSIGNMENT_TODAY, asyncGetAssignmentToday);
    yield takeLatest(actionTypes.GET_ASSIGNMENT_TODAY_BY_ID, asyncGetAssignmentTodayById);
    yield takeLatest(actionTypes.GET_STATISTICS_ASSIGNMENT_MONTH, asyncGetStatisticsAssignmentMonth);
}