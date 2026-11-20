import { render, screen, fireEvent } from '@testing-library/react';
import BabyForm from './BabyForm';

const baseProps = {
  model: { nombre: 'Lucas', apellido: 'Díaz', dni: '50123456' },
  setModel: () => {},
  listLocalities: null,
  listMothers: null,
};

describe('BabyForm', () => {
  it('renderiza los campos principales con sus valores', () => {
    const { container } = render(<BabyForm {...baseProps} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Apellido')).toBeInTheDocument();
    expect(container.querySelector('input[name="nombre"]')).toHaveValue('Lucas');
    expect(container.querySelector('input[name="dni"]')).toHaveValue('50123456');
  });

  it('actualiza el modelo al tipear el nombre', () => {
    const setModel = vi.fn();
    const { container } = render(<BabyForm {...baseProps} setModel={setModel} />);
    fireEvent.change(container.querySelector('input[name="nombre"]'), {
      target: { value: 'Mia', name: 'nombre' },
    });
    expect(setModel).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Mia' }));
  });

  it('en readOnly no actualiza el modelo al tipear', () => {
    const setModel = vi.fn();
    const { container } = render(<BabyForm {...baseProps} setModel={setModel} readOnly />);
    const input = container.querySelector('input[name="nombre"]');
    expect(input).toBeDisabled();
    fireEvent.change(input, { target: { value: 'Mia', name: 'nombre' } });
    expect(setModel).not.toHaveBeenCalled();
  });

  it('muestra el error de campo recibido', () => {
    render(<BabyForm {...baseProps} fieldErrors={{ dni: 'DNI inválido' }} />);
    expect(screen.getByText('DNI inválido')).toBeInTheDocument();
  });
});
