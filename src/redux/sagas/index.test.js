import { describe, it, expect } from 'vitest';
import rootSaga from './index';

describe('rootSaga', () => {
  it('arranca todas las sagas de dominio con un único all([...])', () => {
    const gen = rootSaga();
    const effect = gen.next().value;
    expect(effect).toHaveProperty('type', 'ALL');
    expect(Array.isArray(effect.payload)).toBe(true);
    expect(effect.payload).toHaveLength(16);
    expect(gen.next().done).toBe(true);
  });
});
