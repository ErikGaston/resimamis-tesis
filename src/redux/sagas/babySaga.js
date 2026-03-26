import { call, put, takeLatest } from "redux-saga/effects";
import * as API from "../api";
import * as actionTypes from "../consts/actionTypes";

function* asyncPostBaby({ payload }) {
    try {
        let response = yield call(API.postBaby, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_BABY,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_BABY,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetBabys() {
    try {
        let response = yield call(API.getBabys);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_BABYS,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_BABY,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetBabysFree() {
    try {
        let response = yield call(API.getBabysFree);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_BABYS_FREE,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_BABY,
            response: error,
            message: error.message,
        });
    }
}

export default function* babySaga() {
    yield takeLatest(actionTypes.GET_BABYS, asyncGetBabys);
    yield takeLatest(actionTypes.POST_BABY, asyncPostBaby);
    yield takeLatest(actionTypes.GET_BABYS_FREE, asyncGetBabysFree);
}