import { describe, it, expect } from 'vitest';
import * as actions from './asistenteActions';
import * as actionTypes from '../consts/actionTypes';

describe('asistenteActions', () => {
  it('getAsistenteEstado sin payload', () => {
    expect(actions.getAsistenteEstado()).toEqual({ type: actionTypes.GET_ASISTENTE_ESTADO });
  });

  it('postAsistentePregunta con el payload', () => {
    const payload = { pregunta: '¿Cuántos abrazos hoy?' };
    expect(actions.postAsistentePregunta(payload)).toEqual({
      type: actionTypes.POST_ASISTENTE_PREGUNTA,
      payload,
    });
  });

  it('clearAsistente', () => {
    expect(actions.clearAsistente()).toEqual({ type: actionTypes.CLEAR_ASISTENTE });
  });
});
