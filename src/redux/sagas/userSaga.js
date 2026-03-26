import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../consts/actionTypes";
import * as API from "../api";
import { resolveApiErrorMessage } from "../../utils/apiErrorMessage";
import { showApiErrorToast } from "./showApiErrorToast";

function* asyncPostLogin({ payload }) {
    try {
        let response = yield call(API.postLogin, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_LOGIN,
                response,
            });
    } catch (error) {
        yield* showApiErrorToast(error);
        const message = resolveApiErrorMessage(error);
        yield put({
            type: actionTypes.ERROR_LOGIN,
            response: { data: { message } },
        });
    }
}

export default function* userSaga() {
    yield takeLatest(actionTypes.POST_LOGIN, asyncPostLogin);
}