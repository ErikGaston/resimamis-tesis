import { render, screen, fireEvent } from '@testing-library/react';
import VolunteerForm from './VolunteerForm';

const baseProps = {
  model: { nombre: 'Lucía', apellido: 'Ramos', dni: '40111222', celular: '3511234567', mail: 'lu@mail.com' },
  setModel: () => {},
  submitVolunteer: () => {},
  listTurnos: [{ value: 1, label: 'Mañana' }],
};

describe('VolunteerForm', () => {
  it('renderiza los campos con sus valores', () => {
    const { container } = render(<VolunteerForm {...baseProps} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Turno')).toBeInTheDocument();
    expect(container.querySelector('input[name="nombre"]')).toHaveValue('Lucía');
  });

  it('actualiza el modelo al tipear el apellido', () => {
    const setModel = vi.fn();
    const { container } = render(<VolunteerForm {...baseProps} setModel={setModel} />);
    fireEvent.change(container.querySelector('input[name="apellido"]'), {
      target: { value: 'Ramírez', name: 'apellido' },
    });
    expect(setModel).toHaveBeenCalledWith(expect.objectContaining({ apellido: 'Ramírez' }));
  });

  it('el botón Guardar dispara submitVolunteer', () => {
    const submitVolunteer = vi.fn();
    render(<VolunteerForm {...baseProps} submitVolunteer={submitVolunteer} />);
    fireEvent.click(screen.getByRole('button', { name: /guardar voluntaria/i }));
    expect(submitVolunteer).toHaveBeenCalled();
  });

  it('el botón queda deshabilitado con submitDisabled', () => {
    render(<VolunteerForm {...baseProps} submitDisabled />);
    expect(screen.getByRole('button', { name: /guardar voluntaria/i })).toBeDisabled();
  });
});
