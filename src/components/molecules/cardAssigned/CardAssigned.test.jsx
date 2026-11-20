import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardAssigned from './CardAssigned';

const baseItem = {
  nombreBebe: 'Bebé Gómez',
  nombreVoluntaria: 'Ana Pérez',
  nombreSala: 'Sala 3',
  estadoAsignacion: 'Iniciado',
};

describe('CardAssigned', () => {
  it('muestra el sujeto, la voluntaria y la sala', () => {
    render(<CardAssigned item={baseItem} onClick={() => {}} />);
    expect(screen.getByText('Bebé Gómez')).toBeInTheDocument();
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('Sala 3')).toBeInTheDocument();
  });

  it('traduce el estado Iniciado a "En curso"', () => {
    render(<CardAssigned item={baseItem} onClick={() => {}} />);
    expect(screen.getByText('En curso')).toBeInTheDocument();
  });

  it('cae a "—" en la voluntaria cuando falta', () => {
    render(<CardAssigned item={{ nombreBebe: 'X', estadoAsignacion: 'Creada' }} onClick={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.queryByText('Sala')).not.toBeInTheDocument();
  });

  it('dispara onClick al tocar la tarjeta', async () => {
    const onClick = vi.fn();
    render(<CardAssigned item={baseItem} onClick={onClick} />);
    await userEvent.click(screen.getByText('Bebé Gómez'));
    expect(onClick).toHaveBeenCalled();
  });
});
