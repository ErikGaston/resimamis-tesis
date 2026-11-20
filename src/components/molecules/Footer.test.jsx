import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

describe('Footer', () => {
  it('renderiza las cuatro pestañas de navegación', () => {
    renderFooter();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Tareas')).toBeInTheDocument();
    expect(screen.getByText('Estadísticas')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });

  it('renderiza un botón por pestaña', () => {
    renderFooter();
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });
});
