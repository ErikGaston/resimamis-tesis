import { describe, it, expect } from 'vitest';
import { call, delay, put } from 'redux-saga/effects';
import asistenteSaga from './asistenteSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(asistenteSaga);

describe('asistenteSaga', () => {
  it('registra un takeLatest por acción', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([actionTypes.GET_ASISTENTE_ESTADO, actionTypes.POST_ASISTENTE_PREGUNTA]),
    );
  });

  it('asyncGetAsistenteEstado: éxito -> SUCCESS', () => {
    const gen = workers[actionTypes.GET_ASISTENTE_ESTADO]();
    expect(gen.next().value).toEqual(call(API.getAsistenteEstado));
    const response = { data: { habilitado: true } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_ASISTENTE_ESTADO, response }));
    expect(gen.next().done).toBe(true);
  });

  it('asyncGetAsistenteEstado: error NO dispara toast, solo ERROR_ASISTENTE', () => {
    const gen = workers[actionTypes.GET_ASISTENTE_ESTADO]();
    gen.next();
    const error = new Error('down');
    const emitted = drainFromThrow(gen, error);
    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual(put({ type: actionTypes.ERROR_ASISTENTE, response: error }));
  });

  it('asyncPostAsistentePregunta: pasa el payload y despacha SUCCESS', () => {
    const payload = { pregunta: '¿stock bajo?' };
    const gen = workers[actionTypes.POST_ASISTENTE_PREGUNTA]({ payload });
    expect(gen.next().value).toEqual(call(API.postAsistentePregunta, payload));
    const response = { data: { respuesta: 'ok' } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_POST_ASISTENTE_PREGUNTA, response }));
  });

  it('asyncPostAsistentePregunta: error de cliente (4xx) NO reintenta: toast + ERROR_ASISTENTE', () => {
    const gen = workers[actionTypes.POST_ASISTENTE_PREGUNTA]({ payload: { pregunta: 'x' } });
    gen.next();
    const error = { status: 400, data: { message: 'Debe enviar una pregunta.' } };
    const emitted = drainFromThrow(gen, error);
    expect(emitted).toHaveLength(3);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_ASISTENTE, response: error }));
  });

  it('asyncPostAsistentePregunta: timeout / servidor dormido reintenta una vez y usa esa respuesta', () => {
    const payload = { pregunta: 'cuantos chupetes hay' };
    const gen = workers[actionTypes.POST_ASISTENTE_PREGUNTA]({ payload });
    gen.next();
    const espera = gen.throw(new Error('timeout')).value;
    expect(espera).toEqual(delay(3000));
    expect(gen.next().value).toEqual(call(API.postAsistentePregunta, payload));
    const response = { data: { respuesta: 'Hay 79 chupetes.' } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_POST_ASISTENTE_PREGUNTA, response }));
  });

  it('asyncPostAsistentePregunta: si el reintento también falla, toast + ERROR_ASISTENTE', () => {
    const gen = workers[actionTypes.POST_ASISTENTE_PREGUNTA]({ payload: { pregunta: 'x' } });
    gen.next();
    gen.throw({ status: 503 });
    gen.next();
    const error = { status: 503 };
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_ASISTENTE, response: error }));
  });
});
