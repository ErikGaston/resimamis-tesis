import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../test/renderWithProviders';
import { ProfileVolunteerPage } from './ProfileVolunteerPage';

window.HTMLElement.prototype.scrollIntoView = vi.fn();

const S = Object.fromEntries(
  ['asistente', 'assignment', 'volunteer', 'user', 'mother', 'baby', 'proveedor', 'sala', 'reporte',
    'generics', 'supply', 'dashboard', 'estadisticaAvanzada', 'toast', 'visita', 'horario', 'tarea']
    .map((k) => [`${k}Reducer`, {}]),
);

describe('ProfileVolunteerPage (smoke)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 't');
    localStorage.setItem('voluntaria', JSON.stringify({ id: 1, nombre: 'Test', apellido: 'User', rol: 'coordinadora', idRol: 3 }));
  });

  it('renderiza sin crashear (estado de carga inicial)', () => {
    renderWithProviders(
      <Routes>
        <Route path="/voluntaria/perfil/:id" element={<ProfileVolunteerPage />} />
      </Routes>,
      { route: '/voluntaria/perfil/1', preloadedState: S },
    );
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
});
