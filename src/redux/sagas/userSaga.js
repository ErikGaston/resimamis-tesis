import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../consts/actionTypes";
import * as API from "../api";

function* asyncPostLogin({ payload }) {
    try {
        let response = yield call(API.postLogin, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_LOGIN,
                response,
            });
    } catch (error) {
        yield put({
            type: actionTypes.ERROR_LOGIN,
            response: error,
            message: error.message,
        });
    }
}

export default function* userSaga() {
    yield takeLatest(actionTypes.POST_LOGIN, asyncPostLogin);
}