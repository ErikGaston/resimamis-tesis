import * as actionTypes from '../consts/actionTypes';

export function getHorarioDias() {
  return { type: actionTypes.GET_HORARIO_DIAS };
}

/** @param {Array<Record<string, unknown>>} payload */
export function postHorario(payload) {
  return { type: actionTypes.POST_HORARIO, payload };
}

/**
 * Reemplaza el schedule completo de la voluntaria.
 * @param {number} idVoluntaria
 * @param {Array<{idDia: number, idVoluntaria: number, turno: string}>} body
 */
export function putHorario(idVoluntaria, body) {
  return { type: actionTypes.PUT_HORARIO, payload: { idVoluntaria, body } };
}

export function clearHorario() {
  return { type: actionTypes.CLEAR_HORARIO };
}
