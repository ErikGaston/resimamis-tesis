import { describe, it, expect } from 'vitest';
import * as actions from './genericsActions';
import * as actionTypes from '../consts/actionTypes';

describe('genericsActions', () => {
  it('getLocalities', () => {
    expect(actions.getLocalities()).toEqual({ type: actionTypes.GET_LOCALITIES });
  });

  it('getEstadosCiviles', () => {
    expect(actions.getEstadosCiviles()).toEqual({ type: actionTypes.GET_ESTADOS_CIVILES });
  });
});
