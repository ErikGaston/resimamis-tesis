import * as actionTypes from '../consts/actionTypes';

export function getSupplies() {
    return {
        type: actionTypes.GET_SUPPLIES,
    };
}

export function getStatisticsSupplies() {
    return {
        type: actionTypes.GET_STATISTICS_SUPPLIES,
    };
}

/**
 * @param {{ fechaDesde?: string, fechaHasta?: string, idVoluntaria?: number }} payload
 * `idVoluntaria` opcional: algunos despliegues del API filtran por voluntaria autenticada.
 */
export function postSupplyConsultMovements(payload) {
    return {
        type: actionTypes.POST_SUPPLY_CONSULT_MOVEMENTS,
        payload: payload ?? {},
    };
}

export function getSupplyProviders() {
    return {
        type: actionTypes.GET_SUPPLY_PROVIDERS,
    };
}

export function postSupplyRegisterMovement(payload) {
    return {
        type: actionTypes.POST_SUPPLY_REGISTER_MOVEMENT,
        payload,
    };
}

/** @param {{ nombre: string, descripcion?: string|null, stockMinimo: number, stockMaximo: number, stockActual: number }} payload */
export function postSupplyCreate(payload) {
    return {
        type: actionTypes.POST_SUPPLY_CREATE,
        payload,
    };
}

export function clearSupply() {
    return {
        type: actionTypes.CLEAR_SUPPLY,
    };
}

export function clearSupplyWrites() {
    return { type: actionTypes.CLEAR_SUPPLY_WRITES };
}

export function getSupplyById(idInsumo) {
    return { type: actionTypes.GET_SUPPLY_BY_ID, payload: idInsumo };
}

export function putSupplyById(idInsumo, body) {
    return { type: actionTypes.PUT_SUPPLY_BY_ID, payload: { idInsumo, body } };
}

export function postSupplyDelete(idInsumo) {
    return { type: actionTypes.POST_SUPPLY_DELETE, payload: idInsumo };
}