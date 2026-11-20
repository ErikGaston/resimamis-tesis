import { describe, it, expect, beforeEach } from 'vitest';
import {
  readMotherAltaDraft,
  saveMotherAltaDraft,
  clearMotherAltaDraft,
} from './motherAltaDraft';

describe('motherAltaDraft', () => {
  beforeEach(() => localStorage.clear());

  it('guarda y recupera el borrador con su modelo', () => {
    saveMotherAltaDraft({ nombre: 'Ana' });
    const draft = readMotherAltaDraft();
    expect(draft.model).toEqual({ nombre: 'Ana' });
    expect(typeof draft.savedAt).toBe('string');
  });

  it('sin borrador → null', () => {
    expect(readMotherAltaDraft()).toBeNull();
  });

  it('JSON inválido o sin model → null', () => {
    localStorage.setItem('altaMadreBorrador', '{roto');
    expect(readMotherAltaDraft()).toBeNull();
    localStorage.setItem('altaMadreBorrador', JSON.stringify({ model: 'no-objeto' }));
    expect(readMotherAltaDraft()).toBeNull();
  });

  it('clear elimina el borrador', () => {
    saveMotherAltaDraft({ nombre: 'Ana' });
    clearMotherAltaDraft();
    expect(readMotherAltaDraft()).toBeNull();
  });
});
