import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../consts/actionTypes";
import * as API from "../api";
import { showApiErrorToast } from "./showApiErrorToast";
import { isAspNetModelStateErrors } from "../../utils/apiErrorMessage";

function shouldToastTareaWriteError(error) {
    const data = error?.data;
    return !(error?.status === 400 && isAspNetModelStateErrors(data));
}

function* asyncGetTareas() {
    try {
        const response = yield call(API.getTareas);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_TAREAS, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_TAREA, response: error });
    }
}

function* asyncGetTareasDisponibles() {
    try {
        const response = yield call(API.getTareasDisponibles);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_TAREAS_DISPONIBLES, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_TAREA, response: error });
    }
}

function* asyncGetTareaById({ payload }) {
    try {
        const response = yield call(API.getTareaById, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_TAREA_BY_ID, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_TAREA, response: error });
    }
}

function* asyncPostTarea({ payload }) {
    try {
        const response = yield call(API.postTarea, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_POST_TAREA, response });
    } catch (error) {
        if (shouldToastTareaWriteError(error)) yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_TAREA, response: error });
    }
}

function* asyncPutTarea({ payload }) {
    try {
        const { idTarea, body } = payload || {};
        const response = yield call(API.putTareaById, idTarea, body);
        if (response) yield put({ type: actionTypes.SUCCESS_PUT_TAREA, response });
    } catch (error) {
        if (shouldToastTareaWriteError(error)) yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_TAREA, response: error });
    }
}

function* asyncPostTareaDelete({ payload }) {
    try {
        const response = yield call(API.postTareaDelete, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_POST_TAREA_DELETE, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_TAREA, response: error });
    }
}

export default function* tareaSaga() {
    yield takeLatest(actionTypes.GET_TAREAS, asyncGetTareas);
    yield takeLatest(actionTypes.GET_TAREAS_DISPONIBLES, asyncGetTareasDisponibles);
    yield takeLatest(actionTypes.GET_TAREA_BY_ID, asyncGetTareaById);
    yield takeLatest(actionTypes.POST_TAREA, asyncPostTarea);
    yield takeLatest(actionTypes.PUT_TAREA, asyncPutTarea);
    yield takeLatest(actionTypes.POST_TAREA_DELETE, asyncPostTareaDelete);
}
