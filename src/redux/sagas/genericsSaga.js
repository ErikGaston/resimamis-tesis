import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../consts/actionTypes";
import * as API from "../api";

function* asyncGetLocalities() {
    try {
        let response = yield call(API.getLocalities);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_LOCALITIES,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_LOCALITIES,
            response: error,
            message: error.message,
        });
    }
}

export default function* genericsSaga() {
    yield takeLatest(actionTypes.GET_LOCALITIES, asyncGetLocalities);
}