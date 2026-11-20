import { describe, it, expect, afterEach } from 'vitest';
import axios from 'axios';
import { setAuthToken } from './setAuthToken';

describe('setAuthToken', () => {
  afterEach(() => {
    delete axios.defaults.headers.common.Authorization;
  });

  it('setea el header Authorization con Bearer', () => {
    setAuthToken('abc123');
    expect(axios.defaults.headers.common.Authorization).toBe('Bearer abc123');
  });

  it('sin token elimina el header', () => {
    axios.defaults.headers.common.Authorization = 'Bearer viejo';
    setAuthToken(null);
    expect(axios.defaults.headers.common.Authorization).toBeUndefined();
  });
});
