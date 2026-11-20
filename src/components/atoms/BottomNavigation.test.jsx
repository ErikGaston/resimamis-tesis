import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BottomNavigationCustom from './BottomNavigation';

const tabs = [
  { label: 'Inicio', value: 'home' },
  { label: 'Tareas', value: 'tareas' },
  { label: 'Mi perfil', value: 'mi-perfil' },
];

const renderNav = () =>
  render(
    <MemoryRouter initialEntries={['/home']}>
      <BottomNavigationCustom tabs={tabs} />
    </MemoryRouter>,
  );

describe('BottomNavigationCustom', () => {
  it('renderiza un tab por cada entrada', () => {
    renderNav();
    expect(screen.getByRole('button', { name: /Inicio/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tareas/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mi perfil/ })).toBeInTheDocument();
  });

  it('marca como actual el tab clickeado', async () => {
    renderNav();
    await userEvent.click(screen.getByRole('button', { name: /Tareas/ }));
    expect(screen.getByRole('button', { name: /Tareas/ })).toHaveAttribute('aria-current', 'page');
  });
});
