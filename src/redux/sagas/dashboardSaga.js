import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../consts/actionTypes';
import * as API from '../api';
import { showApiErrorToast } from './showApiErrorToast';

function* asyncGetCoordinacionHoy() {
    try {
        const response = yield call(API.getCoordinacionHoy);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_COORDINACION_HOY, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_DASHBOARD, response: error });
    }
}

function* asyncGetCoberturaHoy() {
    try {
        const response = yield call(API.getCoberturaHoy);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_COBERTURA_HOY, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_DASHBOARD, response: error });
    }
}

function* asyncGetBebesPorSala() {
    try {
        const response = yield call(API.getBebesPorSala);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_BEBES_POR_SALA, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_DASHBOARD, response: error });
    }
}

function* asyncGetBebesPorEstado() {
    try {
        const response = yield call(API.getBebesPorEstado);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_BEBES_POR_ESTADO, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_DASHBOARD, response: error });
    }
}

function* asyncGetBebesRangoEdades() {
    try {
        const response = yield call(API.getBebesRangoEdades);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_BEBES_RANGO_EDADES, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_DASHBOARD, response: error });
    }
}

function* asyncGetRankingVoluntarias({ payload }) {
    try {
        const response = yield call(API.getRankingVoluntarias, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_RANKING_VOLUNTARIAS, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_DASHBOARD, response: error });
    }
}

export default function* dashboardSaga() {
    yield takeLatest(actionTypes.GET_COORDINACION_HOY, asyncGetCoordinacionHoy);
    yield takeLatest(actionTypes.GET_COBERTURA_HOY, asyncGetCoberturaHoy);
    yield takeLatest(actionTypes.GET_BEBES_POR_SALA, asyncGetBebesPorSala);
    yield takeLatest(actionTypes.GET_BEBES_POR_ESTADO, asyncGetBebesPorEstado);
    yield takeLatest(actionTypes.GET_BEBES_RANGO_EDADES, asyncGetBebesRangoEdades);
    yield takeLatest(actionTypes.GET_RANKING_VOLUNTARIAS, asyncGetRankingVoluntarias);
}
