import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../consts/actionTypes";
import * as API from "../api";
import { showApiErrorToast } from "./showApiErrorToast";
import { isAspNetModelStateErrors } from "../../utils/apiErrorMessage";

function shouldToastVisitaWriteError(error) {
    const data = error?.data;
    return !(error?.status === 400 && isAspNetModelStateErrors(data));
}

function* asyncGetVisitas() {
    try {
        const response = yield call(API.getVisitas);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_VISITAS, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_VISITA, response: error });
    }
}

function* asyncGetVisitasByBebe({ payload }) {
    try {
        const response = yield call(API.getVisitasByBebe, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_VISITAS_BY_BEBE, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_VISITA, response: error });
    }
}

function* asyncGetVisitaById({ payload }) {
    try {
        const response = yield call(API.getVisitaById, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_VISITA_BY_ID, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_VISITA, response: error });
    }
}

function* asyncPostVisita({ payload }) {
    try {
        const response = yield call(API.postVisita, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_POST_VISITA, response });
    } catch (error) {
        if (shouldToastVisitaWriteError(error)) yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_VISITA, response: error });
    }
}

function* asyncPutVisita({ payload }) {
    try {
        const { idVisita, body } = payload || {};
        const response = yield call(API.putVisitaById, idVisita, body);
        if (response) yield put({ type: actionTypes.SUCCESS_PUT_VISITA, response });
    } catch (error) {
        if (shouldToastVisitaWriteError(error)) yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_VISITA, response: error });
    }
}

function* asyncPostVisitaDelete({ payload }) {
    try {
        const response = yield call(API.postVisitaDelete, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_POST_VISITA_DELETE, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_VISITA, response: error });
    }
}

export default function* visitaSaga() {
    yield takeLatest(actionTypes.GET_VISITAS, asyncGetVisitas);
    yield takeLatest(actionTypes.GET_VISITAS_BY_BEBE, asyncGetVisitasByBebe);
    yield takeLatest(actionTypes.GET_VISITA_BY_ID, asyncGetVisitaById);
    yield takeLatest(actionTypes.POST_VISITA, asyncPostVisita);
    yield takeLatest(actionTypes.PUT_VISITA, asyncPutVisita);
    yield takeLatest(actionTypes.POST_VISITA_DELETE, asyncPostVisitaDelete);
}
