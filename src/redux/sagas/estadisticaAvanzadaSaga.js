import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../consts/actionTypes';
import * as API from '../api';
import { showApiErrorToast } from './showApiErrorToast';

function* asyncGetEstadisticaAvanzada({ payload }) {
    try {
        const response = yield call(API.getEstadisticaAvanzada, payload);
        if (response) {
            yield put({ type: actionTypes.SUCCESS_GET_ESTADISTICA_AVANZADA, response, tipo: payload.tipo });
        }
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_ESTADISTICA_AVANZADA, response: error, tipo: payload.tipo });
    }
}

export default function* estadisticaAvanzadaSaga() {
    yield takeLatest(actionTypes.GET_ESTADISTICA_AVANZADA, asyncGetEstadisticaAvanzada);
}
