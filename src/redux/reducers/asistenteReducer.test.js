import { describe, it, expect } from 'vitest';
import reducer from './asistenteReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  estado: null,
  ultimaRespuesta: null,
  consultando: false,
  error: null,
};

describe('asistenteReducer', () => {
  it('estado inicial ante acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('GET_ASISTENTE_ESTADO limpia el error y conserva el resto', () => {
    const next = reducer({ ...initialState, estado: { ok: 1 }, error: 'x' }, { type: actionTypes.GET_ASISTENTE_ESTADO });
    expect(next.error).toBeNull();
    expect(next.estado).toEqual({ ok: 1 });
  });

  it('SUCCESS_GET_ASISTENTE_ESTADO guarda estado y limpia error', () => {
    const data = { habilitado: true };
    const next = reducer({ ...initialState, error: 'x' }, { type: actionTypes.SUCCESS_GET_ASISTENTE_ESTADO, response: { data } });
    expect(next.estado).toEqual(data);
    expect(next.error).toBeNull();
  });

  it('POST_ASISTENTE_PREGUNTA marca consultando=true', () => {
    const next = reducer(initialState, { type: actionTypes.POST_ASISTENTE_PREGUNTA });
    expect(next.consultando).toBe(true);
    expect(next.error).toBeNull();
  });

  it('SUCCESS_POST_ASISTENTE_PREGUNTA guarda la respuesta y apaga consultando', () => {
    const data = { respuesta: 'hola' };
    const next = reducer(
      { ...initialState, consultando: true },
      { type: actionTypes.SUCCESS_POST_ASISTENTE_PREGUNTA, response: { data } },
    );
    expect(next.ultimaRespuesta).toEqual(data);
    expect(next.consultando).toBe(false);
    expect(next.error).toBeNull();
  });

  it('ERROR_ASISTENTE guarda response (completo, no .data) y apaga consultando', () => {
    const errorResponse = { status: 400, data: { message: 'sin api key' } };
    const next = reducer(
      { ...initialState, consultando: true },
      { type: actionTypes.ERROR_ASISTENTE, response: errorResponse },
    );
    expect(next.error).toEqual(errorResponse);
    expect(next.consultando).toBe(false);
  });

  it('CLEAR_ASISTENTE vuelve al estado inicial', () => {
    const next = reducer(
      { estado: { ok: 1 }, ultimaRespuesta: { r: 1 }, consultando: true, error: 'e' },
      { type: actionTypes.CLEAR_ASISTENTE },
    );
    expect(next).toEqual(initialState);
  });
});
