import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardBabyHug from './CardBabyHug';

describe('CardBabyHug', () => {
  it('muestra el sujeto y la sala', () => {
    render(<CardBabyHug item={{ nombreBebe: 'Bebé Ruiz', nombreSala: '4', estadoAsignacion: 'Creada' }} />);
    expect(screen.getByText('Bebé Ruiz')).toBeInTheDocument();
    expect(screen.getByText('Sala 4')).toBeInTheDocument();
  });

  it('en estado Creada ofrece "Iniciar abrazo" y lo dispara con el id', async () => {
    const submitStartHug = vi.fn();
    render(
      <CardBabyHug
        item={{ idAsignacion: 9, nombreBebe: 'B', estadoAsignacion: 'Creada' }}
        submitStartHug={submitStartHug}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /iniciar abrazo/i }));
    expect(submitStartHug).toHaveBeenCalledWith(9);
  });

  it('bloquea el inicio si hay un abrazo en curso', () => {
    render(
      <CardBabyHug
        item={{ idAsignacion: 9, nombreBebe: 'B', estadoAsignacion: 'Creada' }}
        submitStartHug={vi.fn()}
        hayAbrazoEnCurso
      />,
    );
    expect(screen.getByRole('button', { name: /iniciar abrazo/i })).toBeDisabled();
    expect(screen.getByText(/Finalizá el abrazo en curso/)).toBeInTheDocument();
  });

  it('en estado Iniciado ofrece finalizar y dispara editHug con el item', async () => {
    const editHug = vi.fn();
    const item = { idAsignacion: 3, nombreBebe: 'B', estadoAsignacion: 'Iniciado' };
    render(<CardBabyHug item={item} editHug={editHug} />);
    await userEvent.click(screen.getByRole('button', { name: /finalizar/i }));
    expect(editHug).toHaveBeenCalledWith(item);
  });

  it('en estado Finalizado muestra "Abrazo completado"', () => {
    render(<CardBabyHug item={{ nombreBebe: 'B', estadoAsignacion: 'Finalizado' }} />);
    expect(screen.getByText('Abrazo completado')).toBeInTheDocument();
  });
});
