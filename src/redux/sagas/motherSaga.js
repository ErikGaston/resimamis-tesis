import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../consts/actionTypes";
import * as API from "../api";
import { showApiErrorToast } from "./showApiErrorToast";
import { isAspNetModelStateErrors } from "../../utils/apiErrorMessage";

function shouldToastMotherWriteError(error) {
    const data = error?.data;
    return !(error?.status === 400 && isAspNetModelStateErrors(data));
}

function* asyncPostMother({ payload }) {
    try {
        let response = yield call(API.postMother, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_MOTHER,
                response,
            });
    } catch (error) {
        if (shouldToastMotherWriteError(error)) {
            yield* showApiErrorToast(error);
        }
        yield put({
            type: actionTypes.ERROR_MOTHER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetMother() {
    try {
        let response = yield call(API.getMother);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_MOTHER,
                response,
            });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({
            type: actionTypes.ERROR_MOTHER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetMotherId({ payload }) {
    try {
        let response = yield call(API.getMotherId, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_MOTHER_ID,
                response,
            });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({
            type: actionTypes.ERROR_MOTHER,
            response: error,
            message: error.message,
        });
    }
}


function* asyncGetStatisticsLocalities() {
    try {
        let response = yield call(API.getStatisticsLocalities);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_STATISTICS_LOCALITIES,
                response,
            });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({
            type: actionTypes.ERROR_MOTHER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetStatisticsAgeMother() {
    try {
        let response = yield call(API.getStatisticsAgeMother);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_STATISTICS_AGE_MOTHER,
                response,
            });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({
            type: actionTypes.ERROR_MOTHER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncPutMother({ payload }) {
    try {
        let response = yield call(API.putMother, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_PUT_MOTHER,
                response,
            });
    } catch (error) {
        if (shouldToastMotherWriteError(error)) {
            yield* showApiErrorToast(error);
        }
        yield put({
            type: actionTypes.ERROR_MOTHER,
            response: error,
            message: error.message,
        });
    }
}

function* asyncPostMotherDelete({ payload }) {
    try {
        const response = yield call(API.postMotherDelete, payload);
        if (response) {
            yield put({ type: actionTypes.SUCCESS_POST_MOTHER_DELETE, response });
        }
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_MOTHER, response: error });
    }
}


export default function* motherSaga() {
    yield takeLatest(actionTypes.POST_MOTHER, asyncPostMother);
    yield takeLatest(actionTypes.GET_MOTHER, asyncGetMother);
    yield takeLatest(actionTypes.GET_MOTHER_ID, asyncGetMotherId);
    yield takeLatest(actionTypes.GET_STATISTICS_LOCALITIES, asyncGetStatisticsLocalities);
    yield takeLatest(actionTypes.GET_STATISTICS_AGE_MOTHER, asyncGetStatisticsAgeMother);
    yield takeLatest(actionTypes.PUT_MOTHER, asyncPutMother);
    yield takeLatest(actionTypes.POST_MOTHER_DELETE, asyncPostMotherDelete);

}