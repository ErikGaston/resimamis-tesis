import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import dashboardSaga from './dashboardSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(dashboardSaga);

describe('dashboardSaga', () => {
  it('registra un takeLatest por cada métrica', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.GET_COORDINACION_HOY,
        actionTypes.GET_COBERTURA_HOY,
        actionTypes.GET_BEBES_POR_SALA,
        actionTypes.GET_BEBES_POR_ESTADO,
        actionTypes.GET_BEBES_RANGO_EDADES,
        actionTypes.GET_RANKING_VOLUNTARIAS,
        actionTypes.GET_DURACION_ABRAZOS,
      ]),
    );
  });

  it('asyncGetCoordinacionHoy: éxito -> SUCCESS', () => {
    const gen = workers[actionTypes.GET_COORDINACION_HOY]();
    expect(gen.next().value).toEqual(call(API.getCoordinacionHoy));
    const response = { data: { asignados: 3 } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_COORDINACION_HOY, response }));
    expect(gen.next().done).toBe(true);
  });

  it('asyncGetCoordinacionHoy: error -> toast + ERROR_DASHBOARD', () => {
    const gen = workers[actionTypes.GET_COORDINACION_HOY]();
    gen.next();
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted).toHaveLength(3);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_DASHBOARD, response: error }));
  });

  it('asyncGetRankingVoluntarias: pasa el payload a la API', () => {
    const payload = { fechaDesde: '2026-01-01', fechaHasta: '2026-02-01' };
    const gen = workers[actionTypes.GET_RANKING_VOLUNTARIAS]({ payload });
    expect(gen.next().value).toEqual(call(API.getRankingVoluntarias, payload));
  });

  describe('asyncGetDuracionAbrazos (all en paralelo + composición)', () => {
    it('pide en paralelo 1 total + N meses, todos a getDuracionAbrazosPeriodo', () => {
      const gen = workers[actionTypes.GET_DURACION_ABRAZOS]({ payload: { meses: 2 } });
      const effect = gen.next().value;
      expect(effect.type).toBe('ALL');
      expect(effect.payload).toHaveLength(3); // general + 2 meses
      expect(effect.payload[0]).toEqual(call(API.getDuracionAbrazosPeriodo)); // total sin args
      effect.payload.forEach((e) => {
        expect(e.type).toBe('CALL');
        expect(e.payload.fn).toBe(API.getDuracionAbrazosPeriodo);
      });
      // los meses sí llevan rango de fechas
      expect(effect.payload[1].payload.args[0]).toHaveProperty('fechaDesde');
      expect(effect.payload[1].payload.args[0]).toHaveProperty('fechaHasta');
    });

    it('compone general + serie por mes y redondea el promedio a 1 decimal', () => {
      const gen = workers[actionTypes.GET_DURACION_ABRAZOS]({ payload: { meses: 2 } });
      gen.next(); // all([...])
      const general = { data: { data: { promedioMinutos: 11, cantidadAbrazosFinalizados: 20 } } };
      const mes1 = { data: { data: { promedioMinutos: 8.33, cantidadAbrazosFinalizados: 3 } } };
      const mes2 = { data: { data: { promedioMinutos: 12, cantidadAbrazosFinalizados: 7 } } };
      const putEffect = gen.next([general, mes1, mes2]).value;

      expect(putEffect.type).toBe('PUT');
      const action = putEffect.payload.action;
      expect(action.type).toBe(actionTypes.SUCCESS_GET_DURACION_ABRAZOS);
      expect(action.response.data.general).toEqual({ promedioMinutos: 11, cantidadAbrazosFinalizados: 20 });
      expect(action.response.data.porMes).toHaveLength(2);
      expect(action.response.data.porMes[0].promedio).toBe(8.3); // 8.33 -> 8.3
      expect(action.response.data.porMes[0].cantidad).toBe(3);
      expect(action.response.data.porMes[1].promedio).toBe(12);
      expect(action.response.data.porMes[1].cantidad).toBe(7);
      expect(typeof action.response.data.porMes[0].label).toBe('string');
    });

    it('si un mes no trae datos, promedio 0 y cantidad 0', () => {
      const gen = workers[actionTypes.GET_DURACION_ABRAZOS]({ payload: { meses: 1 } });
      gen.next();
      const putEffect = gen.next([{ data: { data: null } }, {}]).value;
      const porMes = putEffect.payload.action.response.data.porMes;
      expect(porMes[0].promedio).toBe(0);
      expect(porMes[0].cantidad).toBe(0);
    });
  });
});
