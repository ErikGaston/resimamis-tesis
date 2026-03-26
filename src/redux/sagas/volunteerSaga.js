import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../consts/actionTypes";
import * as API from "../api";

function* asyncPostVolunteer({ payload }) {
    try {
        let response = yield call(API.postVolunteer, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_VOLUNTEER,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_VOLUNTEER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncPostAssistance({ payload }) {
    try {
        let response = yield call(API.postAssistance, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_ASSISTANCE,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_VOLUNTEER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetVolunteersFree() {
    try {
        let response = yield call(API.getVolunteersFree);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_VOLUNTEERS_FREE,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_VOLUNTEER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetAssistance({ payload }) {
    try {
        let response = yield call(API.getAssistance, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_ASSISTANCE,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_VOLUNTEER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetVolunteersStates() {
    try {
        let response = yield call(API.getVolunteersStates);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_VOLUNTEERS_STATES,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_VOLUNTEER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetVolunteerById({ payload }) {
    try {
        let response = yield call(API.getVolunteerById, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_VOLUNTEER_BY_ID,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_VOLUNTEER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncPutVolunteer({ payload }) {
    try {
        let response = yield call(API.putVolunteer, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_PUT_VOLUNTEER,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_VOLUNTEER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetVolunteers() {
    try {
        let response = yield call(API.getVolunteers);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_VOLUNTEERS,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_VOLUNTEER,
            response: error,
            message: error.message,
        });
    }
}

export default function* volunteerSaga() {
    yield takeLatest(actionTypes.POST_VOLUNTEER, asyncPostVolunteer);
    yield takeLatest(actionTypes.POST_ASSISTANCE, asyncPostAssistance);
    yield takeLatest(actionTypes.GET_VOLUNTEERS_FREE, asyncGetVolunteersFree);
    yield takeLatest(actionTypes.GET_ASSISTANCE, asyncGetAssistance);
    yield takeLatest(actionTypes.GET_VOLUNTEERS_STATES, asyncGetVolunteersStates);
    yield takeLatest(actionTypes.GET_VOLUNTEER_BY_ID, asyncGetVolunteerById);
    yield takeLatest(actionTypes.PUT_VOLUNTEER, asyncPutVolunteer);
    yield takeLatest(actionTypes.GET_VOLUNTEERS, asyncGetVolunteers);
}