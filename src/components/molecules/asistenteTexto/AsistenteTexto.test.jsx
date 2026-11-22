import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AsistenteTexto from './AsistenteTexto';

const renderTexto = (texto) =>
  render(
    <MemoryRouter>
      <AsistenteTexto texto={texto} />
    </MemoryRouter>,
  );

describe('AsistenteTexto', () => {
  it('renderiza un párrafo de texto plano', () => {
    renderTexto('Hola, soy el asistente.');
    expect(screen.getByText('Hola, soy el asistente.')).toBeInTheDocument();
  });

  it('convierte **negrita** en un <strong>', () => {
    const { container } = renderTexto('Esto es **importante** acá.');
    const strong = container.querySelector('strong');
    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent('importante');
  });

  it('arma un link interno a la ruta del bebé', () => {
    renderTexto('Ver a [Juana Pérez](bebe:12).');
    const link = screen.getByRole('link', { name: 'Juana Pérez' });
    expect(link).toHaveAttribute('href', '/bebe/perfil/12');
  });

  it('renderiza listas no ordenadas como items', () => {
    renderTexto('- Primero\n- Segundo');
    expect(screen.getByText('Primero')).toBeInTheDocument();
    expect(screen.getByText('Segundo')).toBeInTheDocument();
  });

  it('un link mal armado queda como texto sin <a>', () => {
    renderTexto('Mirá [esto](http://ejemplo.com) acá.');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText(/esto/)).toBeInTheDocument();
  });

  it('un link en negrita igual se arma como link (no queda el texto crudo)', () => {
    renderTexto('1. **[Coordinadora Demo](voluntaria:42)** - 1 abrazo');
    const link = screen.getByRole('link', { name: 'Coordinadora Demo' });
    expect(link).toHaveAttribute('href', '/voluntaria/perfil/42');
    expect(link.closest('strong')).toBeInTheDocument();
    expect(screen.queryByText(/\(voluntaria:42\)/)).not.toBeInTheDocument();
  });
});
