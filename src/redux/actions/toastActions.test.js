import { describe, it, expect } from 'vitest';
import { showToast, hideToast } from './toastActions';
import * as actionTypes from '../consts/actionTypes';

describe('toastActions', () => {
  it('showToast lleva message y severity', () => {
    expect(showToast({ message: 'hola', severity: 'success' })).toEqual({
      type: actionTypes.SHOW_TOAST,
      payload: { message: 'hola', severity: 'success' },
    });
  });

  it('showToast usa severity "error" por defecto', () => {
    expect(showToast({ message: 'uf' })).toEqual({
      type: actionTypes.SHOW_TOAST,
      payload: { message: 'uf', severity: 'error' },
    });
  });

  it('hideToast', () => {
    expect(hideToast()).toEqual({ type: actionTypes.HIDE_TOAST });
  });
});
