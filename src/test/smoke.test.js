import { describe, it, expect } from 'vitest';

describe('infra de tests (smoke)', () => {
  it('ejecuta Vitest', () => {
    expect(1 + 1).toBe(2);
  });

  it('tiene matchers de jest-dom disponibles', () => {
    const el = document.createElement('div');
    el.textContent = 'hola';
    document.body.appendChild(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('hola');
  });
});
