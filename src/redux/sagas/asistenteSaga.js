import { call, delay, put, takeLatest } from 'redux-saga/effects';
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

/** Sin respuesta, timeout o 5xx: pasajero (servidor despertando o reiniciándose). 4xx no se reintenta. */
const esPasajero = (error) => {
    const status = error?.status ?? error?.response?.status;
    return !status || status === 408 || status >= 500;
};

function* asyncPostAsistentePregunta({ payload }) {
    try {
        let response;
        try {
            response = yield call(API.postAsistentePregunta, payload);
        } catch (primerError) {
            if (!esPasajero(primerError)) throw primerError;
            // Un reintento: la primera llamada del día suele toparse con el servidor dormido.
            yield delay(3000);
            response = yield call(API.postAsistentePregunta, payload);
        }
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
