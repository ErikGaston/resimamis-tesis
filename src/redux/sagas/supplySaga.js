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

function* asyncPostSupplyConsultMovements({ payload }) {
    try {
        let response = yield call(API.postSupplyConsultMovements, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_SUPPLY_CONSULT_MOVEMENTS,
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

function* asyncGetSupplyProviders() {
    try {
        let response = yield call(API.getSupplyProviders);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_GET_SUPPLY_PROVIDERS,
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

function* asyncPostSupplyRegisterMovement({ payload }) {
    try {
        let response = yield call(API.postSupplyRegisterMovement, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_SUPPLY_REGISTER_MOVEMENT,
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
    yield takeLatest(actionTypes.POST_SUPPLY_CONSULT_MOVEMENTS, asyncPostSupplyConsultMovements);
    yield takeLatest(actionTypes.GET_SUPPLY_PROVIDERS, asyncGetSupplyProviders);
    yield takeLatest(actionTypes.POST_SUPPLY_REGISTER_MOVEMENT, asyncPostSupplyRegisterMovement);
}