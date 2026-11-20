import { describe, it, expect } from 'vitest';
import { showLoading } from './loadingActions';
import * as actionTypes from '../consts/actionTypes';

describe('loadingActions', () => {
  it('showLoading(true) / showLoading(false) llevan el flag en payload', () => {
    expect(showLoading(true)).toEqual({ type: actionTypes.SHOW_LOADING, payload: true });
    expect(showLoading(false)).toEqual({ type: actionTypes.SHOW_LOADING, payload: false });
  });
});
