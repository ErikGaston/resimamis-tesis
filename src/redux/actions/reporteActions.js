import * as actionTypes from '../consts/actionTypes';

export function getHistorialBajas(tipo) {
    return { type: actionTypes.GET_HISTORIAL_BAJAS, payload: tipo };
}

export function getDiasTurnos(params) {
    return { type: actionTypes.GET_DIAS_TURNOS, payload: params };
}

export function getReporteDiario(fecha) {
    return { type: actionTypes.GET_REPORTE_DIARIO, payload: fecha };
}

export function getVisitasEstadisticas(params) {
    return { type: actionTypes.GET_VISITAS_ESTADISTICAS, payload: params };
}

export function clearReporte() {
    return { type: actionTypes.CLEAR_REPORTE };
}

export function getCierresAutomaticos(params) {
    return { type: actionTypes.GET_CIERRES_AUTOMATICOS, payload: params };
}

export function getCierreDiarioEstado() {
    return { type: actionTypes.GET_CIERRE_DIARIO_ESTADO };
}
