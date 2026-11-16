import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../consts/actionTypes';
import * as API from '../api';
import { showApiErrorToast } from './showApiErrorToast';

function crearWorker(apiFn, successType) {
    return function* worker({ payload }) {
        try {
            const response = yield call(apiFn, payload);
            if (response) yield put({ type: successType, response });
        } catch (error) {
            yield* showApiErrorToast(error);
            yield put({ type: actionTypes.ERROR_REPORTE, response: error });
        }
    };
}

export default function* reporteSaga() {
    yield takeLatest(actionTypes.GET_HISTORIAL_BAJAS, crearWorker(API.getHistorialBajas, actionTypes.SUCCESS_GET_HISTORIAL_BAJAS));
    yield takeLatest(actionTypes.GET_DIAS_TURNOS, crearWorker(API.getDiasTurnos, actionTypes.SUCCESS_GET_DIAS_TURNOS));
    yield takeLatest(actionTypes.GET_REPORTE_DIARIO, crearWorker(API.getReporteDiario, actionTypes.SUCCESS_GET_REPORTE_DIARIO));
    yield takeLatest(actionTypes.GET_VISITAS_ESTADISTICAS, crearWorker(API.getVisitasEstadisticas, actionTypes.SUCCESS_GET_VISITAS_ESTADISTICAS));
}
