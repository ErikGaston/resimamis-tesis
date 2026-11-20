import { describe, it, expect } from 'vitest';
import reducer from './estadisticaAvanzadaReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  porTipo: {},
  cargando: null,
  error: null,
};

describe('estadisticaAvanzadaReducer', () => {
  it('estado inicial ante acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('GET_ESTADISTICA_AVANZADA marca cargando con el tipo pedido', () => {
    const next = reducer(initialState, { type: actionTypes.GET_ESTADISTICA_AVANZADA, payload: { tipo: 'impacto' } });
    expect(next.cargando).toBe('impacto');
    expect(next.error).toBeNull();
  });

  it('SUCCESS_GET_ESTADISTICA_AVANZADA guarda por tipo (desanida data.data) y apaga cargando', () => {
    const data = [{ x: 1 }];
    const next = reducer(
      { ...initialState, cargando: 'impacto' },
      { type: actionTypes.SUCCESS_GET_ESTADISTICA_AVANZADA, tipo: 'impacto', response: { data: { data } } },
    );
    expect(next.porTipo).toEqual({ impacto: data });
    expect(next.cargando).toBeNull();
  });

  it('SUCCESS conserva los tipos ya cargados (merge)', () => {
    const prev = { ...initialState, porTipo: { equidad: [{ y: 2 }] }, cargando: 'impacto' };
    const next = reducer(prev, {
      type: actionTypes.SUCCESS_GET_ESTADISTICA_AVANZADA,
      tipo: 'impacto',
      response: { data: { data: [{ x: 1 }] } },
    });
    expect(next.porTipo).toEqual({ equidad: [{ y: 2 }], impacto: [{ x: 1 }] });
  });

  it('ERROR_ESTADISTICA_AVANZADA apaga cargando y guarda response', () => {
    const next = reducer({ ...initialState, cargando: 'impacto' }, { type: actionTypes.ERROR_ESTADISTICA_AVANZADA, response: { status: 500 } });
    expect(next.cargando).toBeNull();
    expect(next.error).toEqual({ status: 500 });
  });

  it('CLEAR_ESTADISTICA_AVANZADA vuelve al estado inicial', () => {
    const next = reducer({ porTipo: { a: 1 }, cargando: 'x', error: 'e' }, { type: actionTypes.CLEAR_ESTADISTICA_AVANZADA });
    expect(next).toEqual(initialState);
  });
});
