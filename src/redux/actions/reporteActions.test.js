import { describe, it, expect } from 'vitest';
import * as actions from './reporteActions';
import * as actionTypes from '../consts/actionTypes';

describe('reporteActions', () => {
  it('getHistorialBajas con el tipo', () => {
    expect(actions.getHistorialBajas('Madre')).toEqual({ type: actionTypes.GET_HISTORIAL_BAJAS, payload: 'Madre' });
  });

  it('getDiasTurnos con params', () => {
    const params = { fechaDesde: '2026-01-01' };
    expect(actions.getDiasTurnos(params)).toEqual({ type: actionTypes.GET_DIAS_TURNOS, payload: params });
  });

  it('getReporteDiario con la fecha', () => {
    expect(actions.getReporteDiario('2026-11-19')).toEqual({ type: actionTypes.GET_REPORTE_DIARIO, payload: '2026-11-19' });
  });

  it('getVisitasEstadisticas con params', () => {
    const params = { fechaInicio: '2026-01-01' };
    expect(actions.getVisitasEstadisticas(params)).toEqual({ type: actionTypes.GET_VISITAS_ESTADISTICAS, payload: params });
  });

  it('getCierresAutomaticos con params', () => {
    const params = { fechaDesde: '2026-01-01' };
    expect(actions.getCierresAutomaticos(params)).toEqual({ type: actionTypes.GET_CIERRES_AUTOMATICOS, payload: params });
  });

  it('getCierreDiarioEstado sin payload', () => {
    expect(actions.getCierreDiarioEstado()).toEqual({ type: actionTypes.GET_CIERRE_DIARIO_ESTADO });
  });

  it('clearReporte', () => {
    expect(actions.clearReporte()).toEqual({ type: actionTypes.CLEAR_REPORTE });
  });
});
