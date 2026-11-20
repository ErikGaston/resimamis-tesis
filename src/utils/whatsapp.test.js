import { describe, it, expect } from 'vitest';
import { linkWhatsApp } from './whatsapp';

describe('linkWhatsApp', () => {
  it('celular vacío o inválido devuelve null', () => {
    expect(linkWhatsApp('')).toBeNull();
    expect(linkWhatsApp(null)).toBeNull();
    expect(linkWhatsApp(undefined)).toBeNull();
    expect(linkWhatsApp('abc')).toBeNull();
  });

  it('agrega 54 9 a un celular argentino sin prefijo', () => {
    expect(linkWhatsApp('3516000002')).toContain('wa.me/5493516000002');
  });

  it('quita el 0 inicial antes de prefijar', () => {
    expect(linkWhatsApp('03516000002')).toContain('wa.me/5493516000002');
  });

  it('respeta un número ya en formato 549', () => {
    expect(linkWhatsApp('5493516000002')).toContain('wa.me/5493516000002');
  });

  it('inserta el 9 cuando viene con 54 pero sin 9', () => {
    expect(linkWhatsApp('543516000002')).toContain('wa.me/5493516000002');
  });

  it('acepta un número (no string) y arma la URL con texto', () => {
    const url = linkWhatsApp(3516000002, 'Hola');
    expect(url).toContain('wa.me/5493516000002');
    expect(url).toContain('text=Hola');
  });
});
