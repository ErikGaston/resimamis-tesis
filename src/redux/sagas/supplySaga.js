import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../consts/actionTypes";
import * as API from "../api";
import { showApiErrorToast } from "./showApiErrorToast";
import { normalizeSupplyRegisterMovementBody } from "../../utils/supplyMovementPayload";

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
        const body = normalizeSupplyRegisterMovementBody(payload);
        let response = yield call(API.postSupplyRegisterMovement, body);
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

function* asyncPostSupplyCreate({ payload }) {
    try {
        let response = yield call(API.postSupplyCreate, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_SUPPLY_CREATE,
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

function* asyncGetSupplyById({ payload }) {
    try {
        const response = yield call(API.getSupplyById, payload);
        if (response) {
            yield put({ type: actionTypes.SUCCESS_GET_SUPPLY_BY_ID, response });
        }
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_SUPPLY, response: error });
    }
}

function* asyncPutSupplyById({ payload }) {
    try {
        const { idInsumo, body } = payload || {};
        const response = yield call(API.putSupplyById, idInsumo, body);
        if (response) {
            yield put({ type: actionTypes.SUCCESS_PUT_SUPPLY_BY_ID, response });
        }
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_SUPPLY, response: error });
    }
}

function* asyncPostSupplyDelete({ payload }) {
    try {
        const response = yield call(API.postSupplyDelete, payload);
        if (response) {
            yield put({ type: actionTypes.SUCCESS_POST_SUPPLY_DELETE, response });
        }
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_SUPPLY, response: error });
    }
}

export default function* supplySaga() {
    yield takeLatest(actionTypes.GET_SUPPLIES, asyncGetSupplies);
    yield takeLatest(actionTypes.GET_STATISTICS_SUPPLIES, asyncGetStatisticsSupplies);
    yield takeLatest(actionTypes.POST_SUPPLY_CONSULT_MOVEMENTS, asyncPostSupplyConsultMovements);
    yield takeLatest(actionTypes.GET_SUPPLY_PROVIDERS, asyncGetSupplyProviders);
    yield takeLatest(actionTypes.POST_SUPPLY_REGISTER_MOVEMENT, asyncPostSupplyRegisterMovement);
    yield takeLatest(actionTypes.POST_SUPPLY_CREATE, asyncPostSupplyCreate);
    yield takeLatest(actionTypes.GET_SUPPLY_BY_ID, asyncGetSupplyById);
    yield takeLatest(actionTypes.PUT_SUPPLY_BY_ID, asyncPutSupplyById);
    yield takeLatest(actionTypes.POST_SUPPLY_DELETE, asyncPostSupplyDelete);
}