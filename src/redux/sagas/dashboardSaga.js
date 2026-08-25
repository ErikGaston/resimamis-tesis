import { all, call, put, takeLatest } from 'redux-saga/effects';
import dayjs from 'dayjs';
import * as actionTypes from '../consts/actionTypes';
import * as API from '../api';
import { showApiErrorToast } from './showApiErrorToast';

const MESES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MESES_GRAFICO = 6;

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

/**
 * El endpoint devuelve los totales de un período, no una serie por mes, así que
 * la serie se arma con una llamada por mes. Van en paralelo con `all` para no
 * encadenar seis idas y vueltas.
 */
function* asyncGetDuracionAbrazos({ payload }) {
    try {
        const meses = payload?.meses ?? MESES_GRAFICO;
        const periodos = Array.from({ length: meses }, (_, i) => {
            const mes = dayjs().subtract(meses - 1 - i, 'month');
            return {
                label: MESES_CORTO[mes.month()],
                fechaDesde: mes.startOf('month').format('YYYY-MM-DD'),
                fechaHasta: mes.endOf('month').format('YYYY-MM-DD'),
            };
        });

        const [general, ...porMesRes] = yield all([
            call(API.getDuracionAbrazosPeriodo),
            ...periodos.map((p) => call(API.getDuracionAbrazosPeriodo, {
                fechaDesde: p.fechaDesde,
                fechaHasta: p.fechaHasta,
            })),
        ]);

        const porMes = periodos.map((p, i) => ({
            label: p.label,
            promedio: Math.round((porMesRes[i]?.data?.data?.promedioMinutos ?? 0) * 10) / 10,
            cantidad: porMesRes[i]?.data?.data?.cantidadAbrazosFinalizados ?? 0,
        }));

        yield put({
            type: actionTypes.SUCCESS_GET_DURACION_ABRAZOS,
            response: { data: { general: general?.data?.data ?? null, porMes } },
        });
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
    yield takeLatest(actionTypes.GET_DURACION_ABRAZOS, asyncGetDuracionAbrazos);
}
