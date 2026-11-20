import { describe, it, expect } from 'vitest';
import reducer from './toastReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = { open: false, message: '', severity: 'error', seq: 0 };

describe('toastReducer', () => {
  it('devuelve el estado inicial', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_TOAST abre, setea message/severity e incrementa seq', () => {
    const next = reducer(initialState, {
      type: actionTypes.SHOW_TOAST,
      payload: { message: 'listo', severity: 'success' },
    });
    expect(next.open).toBe(true);
    expect(next.message).toBe('listo');
    expect(next.severity).toBe('success');
    expect(next.seq).toBe(1);
  });

  it('SHOW_TOAST sin message conserva el message anterior y usa severity "error"', () => {
    const next = reducer({ ...initialState, message: 'previo' }, { type: actionTypes.SHOW_TOAST, payload: {} });
    expect(next.message).toBe('previo');
    expect(next.severity).toBe('error');
    expect(next.seq).toBe(1);
  });

  it('cada SHOW_TOAST incrementa seq (remonta el snackbar)', () => {
    const s1 = reducer(initialState, { type: actionTypes.SHOW_TOAST, payload: { message: 'a' } });
    const s2 = reducer(s1, { type: actionTypes.SHOW_TOAST, payload: { message: 'b' } });
    expect(s2.seq).toBe(2);
  });

  it('HIDE_TOAST cierra pero conserva message/seq', () => {
    const next = reducer({ open: true, message: 'x', severity: 'info', seq: 3 }, { type: actionTypes.HIDE_TOAST });
    expect(next.open).toBe(false);
    expect(next.message).toBe('x');
    expect(next.seq).toBe(3);
  });

  it('acción desconocida no cambia el estado', () => {
    expect(reducer(initialState, { type: 'NADA' })).toBe(initialState);
  });
});
