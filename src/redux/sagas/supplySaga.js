import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../consts/actionTypes";
import * as API from "../api";
import { showApiErrorToast } from "./showApiErrorToast";

function* asyncGetSupplies() {
    try {
        let response = yield call(API.getSupplies);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_SUPPLIES,
                response,
            });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({
            type: actionTypes.ERROR_SUPPLY,
            response: error,
            message: error.message,
        });
    }
}

function* asyncGetStatisticsSupplies() {
    try {
        let response = yield call(API.getStatisticsSupplies);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_STATISTICS_SUPPLIES,
                response,
            });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({
            type: actionTypes.ERROR_SUPPLY,
            response: error,
            message: error.message,
        });
    }
}

export default function* supplySaga() {
    yield takeLatest(actionTypes.GET_SUPPLIES, asyncGetSupplies);
    yield takeLatest(actionTypes.GET_STATISTICS_SUPPLIES, asyncGetStatisticsSupplies);
}