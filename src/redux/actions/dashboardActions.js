import * as actionTypes from '../consts/actionTypes';

export function getCoordinacionHoy() {
    return { type: actionTypes.GET_COORDINACION_HOY };
}

export function getCoberturaHoy() {
    return { type: actionTypes.GET_COBERTURA_HOY };
}

export function getBebesPorSala() {
    return { type: actionTypes.GET_BEBES_POR_SALA };
}

export function getBebesPorEstado() {
    return { type: actionTypes.GET_BEBES_POR_ESTADO };
}

export function getBebesRangoEdades() {
    return { type: actionTypes.GET_BEBES_RANGO_EDADES };
}

/** @param {{ fechaDesde: string, fechaHasta: string, top?: number }} params */
export function getRankingVoluntarias(params) {
    return { type: actionTypes.GET_RANKING_VOLUNTARIAS, payload: params };
}

/**
 * Duración de abrazos: totales del histórico + promedio mes a mes.
 * @param {{ meses?: number }} [opciones] cuántos meses hacia atrás graficar
 */
export function getDuracionAbrazos(opciones) {
    return { type: actionTypes.GET_DURACION_ABRAZOS, payload: opciones };
}

export function clearDashboard() {
    return { type: actionTypes.CLEAR_DASHBOARD };
}
