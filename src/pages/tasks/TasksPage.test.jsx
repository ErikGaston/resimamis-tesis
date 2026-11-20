import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import { TasksPage } from './TasksPage';

window.HTMLElement.prototype.scrollIntoView = vi.fn();

const S = Object.fromEntries(
  ['asistente', 'assignment', 'volunteer', 'user', 'mother', 'baby', 'proveedor', 'sala', 'reporte',
    'generics', 'supply', 'dashboard', 'estadisticaAvanzada', 'toast', 'visita', 'horario', 'tarea']
    .map((k) => [`${k}Reducer`, {}]),
);

describe('TasksPage (smoke)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 't');
    localStorage.setItem('voluntaria', JSON.stringify({ id: 1, nombre: 'Test', apellido: 'User', rol: 'coordinadora', idRol: 3 }));
  });

  it('renderiza las secciones de tareas sin crashear', () => {
    renderWithProviders(<TasksPage />, { preloadedState: S });
    expect(screen.getByText(/actividades/i)).toBeInTheDocument();
  });
});
