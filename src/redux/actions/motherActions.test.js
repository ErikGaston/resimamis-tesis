import { describe, it, expect } from 'vitest';
import * as actions from './motherActions';
import * as actionTypes from '../consts/actionTypes';

describe('motherActions', () => {
  it('postMother / putMother llevan el payload', () => {
    const body = { dni: '1' };
    expect(actions.postMother(body)).toEqual({ type: actionTypes.POST_MOTHER, payload: body });
    expect(actions.putMother(body)).toEqual({ type: actionTypes.PUT_MOTHER, payload: body });
  });

  it('getMotherId lleva el parámetro', () => {
    expect(actions.getMotherId(5)).toEqual({ type: actionTypes.GET_MOTHER_ID, payload: 5 });
  });

  it('postMotherDelete lleva el idMadre', () => {
    expect(actions.postMotherDelete(9)).toEqual({ type: actionTypes.POST_MOTHER_DELETE, payload: 9 });
  });

  it('creadores sin argumento no llevan payload', () => {
    expect(actions.getMother()).toEqual({ type: actionTypes.GET_MOTHER });
    expect(actions.getStatisticsLocalities()).toEqual({ type: actionTypes.GET_STATISTICS_LOCALITIES });
    expect(actions.getStatisticsAgeMother()).toEqual({ type: actionTypes.GET_STATISTICS_AGE_MOTHER });
    expect(actions.clearMother()).toEqual({ type: actionTypes.CLEAR_MOTHER });
    expect(actions.clearMotherWrites()).toEqual({ type: actionTypes.CLEAR_MOTHER_WRITES });
    expect(actions.clearMotherApiError()).toEqual({ type: actionTypes.CLEAR_MOTHER_API_ERROR });
  });
});
