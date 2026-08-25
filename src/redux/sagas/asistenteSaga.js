import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../consts/actionTypes';
import * as API from '../api';
import { showApiErrorToast } from './showApiErrorToast';

function* asyncGetAsistenteEstado() {
    try {
        const response = yield call(API.getAsistenteEstado);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_ASISTENTE_ESTADO, response });
    } catch (error) {
        // El estado se consulta al abrir la pantalla: si falla, alcanza con
        // dejar el aviso en pantalla, sin toast.
        yield put({ type: actionTypes.ERROR_ASISTENTE, response: error });
    }
}

function* asyncPostAsistentePregunta({ payload }) {
    try {
        const response = yield call(API.postAsistentePregunta, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_POST_ASISTENTE_PREGUNTA, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_ASISTENTE, response: error });
    }
}

export default function* asistenteSaga() {
    yield takeLatest(actionTypes.GET_ASISTENTE_ESTADO, asyncGetAsistenteEstado);
    yield takeLatest(actionTypes.POST_ASISTENTE_PREGUNTA, asyncPostAsistentePregunta);
}
