import { describe, it, expect } from 'vitest';
import {
  PASSWORD_MIN,
  PASSWORD_MAX,
  passwordError,
  isPasswordValid,
} from './passwordValidation';

describe('passwordError', () => {
  it('acepta una contraseña válida (letra + número, sin espacios)', () => {
    expect(passwordError('abcd1234')).toBeNull();
    expect(isPasswordValid('abcd1234')).toBe(true);
  });
  it('rechaza por longitud fuera de rango', () => {
    expect(passwordError('ab1')).toMatch(new RegExp(`${PASSWORD_MIN}`));
    expect(passwordError('a1'.repeat(PASSWORD_MAX))).toMatch(new RegExp(`${PASSWORD_MAX}`));
  });
  it('rechaza espacios', () => {
    expect(passwordError('abc 1234')).toMatch(/espacios/i);
  });
  it('exige al menos una letra', () => {
    expect(passwordError('12345678')).toMatch(/letra/i);
  });
  it('exige al menos un número', () => {
    expect(passwordError('abcdefgh')).toMatch(/número/i);
  });
  it('es null-safe', () => {
    expect(passwordError(null)).toMatch(new RegExp(`${PASSWORD_MIN}`));
    expect(isPasswordValid(null)).toBe(false);
  });
  it('acepta letras con tilde/ñ', () => {
    expect(passwordError('contraseña1')).toBeNull();
  });
});
