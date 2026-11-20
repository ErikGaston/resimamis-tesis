import { describe, it, expect } from 'vitest';
import * as actions from './dashboardActions';
import * as actionTypes from '../consts/actionTypes';

describe('dashboardActions', () => {
  it('acciones sin payload', () => {
    expect(actions.getCoordinacionHoy()).toEqual({ type: actionTypes.GET_COORDINACION_HOY });
    expect(actions.getCoberturaHoy()).toEqual({ type: actionTypes.GET_COBERTURA_HOY });
    expect(actions.getBebesPorSala()).toEqual({ type: actionTypes.GET_BEBES_POR_SALA });
    expect(actions.getBebesPorEstado()).toEqual({ type: actionTypes.GET_BEBES_POR_ESTADO });
    expect(actions.getBebesRangoEdades()).toEqual({ type: actionTypes.GET_BEBES_RANGO_EDADES });
    expect(actions.clearDashboard()).toEqual({ type: actionTypes.CLEAR_DASHBOARD });
  });

  it('getRankingVoluntarias con params', () => {
    const params = { fechaDesde: '2026-01-01', fechaHasta: '2026-02-01', top: 5 };
    expect(actions.getRankingVoluntarias(params)).toEqual({ type: actionTypes.GET_RANKING_VOLUNTARIAS, payload: params });
  });

  it('getDuracionAbrazos con opciones', () => {
    expect(actions.getDuracionAbrazos({ meses: 6 })).toEqual({ type: actionTypes.GET_DURACION_ABRAZOS, payload: { meses: 6 } });
  });
});
