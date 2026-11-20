import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CardBaby from './CardBaby';

const baby = { idBebe: 7, nombre: 'Juan', apellido: 'López', dni: '55123456', salaInternacion: 'NEO 2' };

const renderBaby = (props) =>
  render(
    <MemoryRouter>
      <CardBaby {...props} />
    </MemoryRouter>,
  );

describe('CardBaby', () => {
  it('muestra nombre, DNI y sala', () => {
    renderBaby({ baby });
    expect(screen.getByText('Juan López')).toBeInTheDocument();
    expect(screen.getByText('DNI: 55123456')).toBeInTheDocument();
    expect(screen.getByText('Sala: NEO 2')).toBeInTheDocument();
  });

  it('enlaza al perfil del bebé', () => {
    renderBaby({ baby });
    expect(screen.getByRole('link')).toHaveAttribute('href', '/bebe/perfil/7');
  });

  it('cae a textos por defecto cuando faltan datos', () => {
    renderBaby({ baby: { idBebe: 1 } });
    expect(screen.getByText('Sin nombre')).toBeInTheDocument();
    expect(screen.getByText('DNI: Sin DNI indicado')).toBeInTheDocument();
    expect(screen.getByText('Sala: Sin sala indicada')).toBeInTheDocument();
  });

  it('muestra el botón de baja y dispara onAdminDelete con el id', async () => {
    const onAdminDelete = vi.fn();
    renderBaby({ baby, onAdminDelete });
    await userEvent.click(screen.getByRole('button', { name: /dar de baja/i }));
    expect(onAdminDelete).toHaveBeenCalledWith(7);
  });
});
