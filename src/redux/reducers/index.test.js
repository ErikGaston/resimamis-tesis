import { describe, it, expect } from 'vitest';
import rootReducer from './index';

const EXPECTED_SLICES = [
  'userReducer',
  'volunteerReducer',
  'motherReducer',
  'genericsReducer',
  'babyReducer',
  'assignmentReducer',
  'supplyReducer',
  'toastReducer',
  'horarioReducer',
  'tareaReducer',
  'visitaReducer',
  'proveedorReducer',
  'salaReducer',
  'dashboardReducer',
  'asistenteReducer',
  'reporteReducer',
  'estadisticaAvanzadaReducer',
];

describe('rootReducer (combineReducers)', () => {
  it('expone todos los slices esperados en el estado inicial', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(Object.keys(state).sort()).toEqual([...EXPECTED_SLICES].sort());
  });

  it('cada slice arranca con un objeto de estado (no undefined)', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    EXPECTED_SLICES.forEach((slice) => {
      expect(state[slice]).toBeDefined();
    });
  });
});
