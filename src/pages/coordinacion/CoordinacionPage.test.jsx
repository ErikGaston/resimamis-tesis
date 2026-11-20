import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import CoordinacionPage from './CoordinacionPage';

window.HTMLElement.prototype.scrollIntoView = vi.fn();

const S = Object.fromEntries(
  ['asistente', 'assignment', 'volunteer', 'user', 'mother', 'baby', 'proveedor', 'sala', 'reporte',
    'generics', 'supply', 'dashboard', 'estadisticaAvanzada', 'toast', 'visita', 'horario', 'tarea']
    .map((k) => [`${k}Reducer`, {}]),
);

describe('CoordinacionPage (smoke)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 't');
    localStorage.setItem('voluntaria', JSON.stringify({ id: 1, nombre: 'Test', apellido: 'User', rol: 'coordinadora', idRol: 3 }));
  });

  it('como coordinadora renderiza el panel de Administración', () => {
    renderWithProviders(<CoordinacionPage />, { preloadedState: S });
    expect(screen.getByText(/administración/i)).toBeInTheDocument();
  });

  it('sin rol coordinadora muestra el aviso en vez del panel', () => {
    localStorage.setItem('voluntaria', JSON.stringify({ id: 2, nombre: 'V', apellido: 'X', rol: 'voluntaria', idRol: 2 }));
    renderWithProviders(<CoordinacionPage />, { preloadedState: S });
    expect(screen.queryByText(/^administración$/i)).not.toBeInTheDocument();
  });
});
