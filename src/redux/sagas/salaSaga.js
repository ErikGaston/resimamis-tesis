import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../consts/actionTypes';
import * as API from '../api';
import { showApiErrorToast } from './showApiErrorToast';

function* asyncGetSalasAll() {
    try {
        const response = yield call(API.getSalasAll);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_SALAS_ALL, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_SALA, response: error });
    }
}

function* asyncPostSala({ payload }) {
    try {
        const response = yield call(API.postSala, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_POST_SALA, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_SALA, response: error });
    }
}

function* asyncPutSala({ payload }) {
    try {
        const response = yield call(API.putSala, payload.idSala, payload.body);
        if (response) yield put({ type: actionTypes.SUCCESS_PUT_SALA, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_SALA, response: error });
    }
}

function* asyncPostSalaDelete({ payload }) {
    try {
        const response = yield call(API.postSalaDelete, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_POST_SALA_DELETE, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_SALA, response: error });
    }
}

export default function* salaSaga() {
    yield takeLatest(actionTypes.GET_SALAS_ALL, asyncGetSalasAll);
    yield takeLatest(actionTypes.POST_SALA, asyncPostSala);
    yield takeLatest(actionTypes.PUT_SALA, asyncPutSala);
    yield takeLatest(actionTypes.POST_SALA_DELETE, asyncPostSalaDelete);
}
