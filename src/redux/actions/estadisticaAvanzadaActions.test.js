import { describe, it, expect } from 'vitest';
import * as actions from './estadisticaAvanzadaActions';
import * as actionTypes from '../consts/actionTypes';

describe('estadisticaAvanzadaActions', () => {
  it('getEstadisticaAvanzada arma payload { tipo, params }', () => {
    const params = { fechaDesde: '2026-01-01' };
    expect(actions.getEstadisticaAvanzada('impacto', params)).toEqual({
      type: actionTypes.GET_ESTADISTICA_AVANZADA,
      payload: { tipo: 'impacto', params },
    });
  });

  it('clearEstadisticaAvanzada', () => {
    expect(actions.clearEstadisticaAvanzada()).toEqual({ type: actionTypes.CLEAR_ESTADISTICA_AVANZADA });
  });
});
