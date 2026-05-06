import * as actionTypes from '../consts/actionTypes';

export function getHorarioDias() {
  return { type: actionTypes.GET_HORARIO_DIAS };
}

/** @param {Array<Record<string, unknown>>} payload */
export function postHorario(payload) {
  return { type: actionTypes.POST_HORARIO, payload };
}

export function clearHorario() {
  return { type: actionTypes.CLEAR_HORARIO };
}
