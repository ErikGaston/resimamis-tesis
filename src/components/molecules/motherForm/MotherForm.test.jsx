import { render, screen, fireEvent } from '@testing-library/react';
import MotherForm from './MotherForm';

const baseProps = {
  model: { nombre: 'Rosa', apellido: 'Gómez', dni: 40123456, motivoAbrazo: 'Prematuro' },
  setModel: () => {},
  listLocalities: [{ label: 'Córdoba', value: 1 }],
  listEstadosCiviles: null,
  typeForm: 'CREAR',
};

describe('MotherForm', () => {
  it('renderiza los campos con sus valores', () => {
    const { container } = render(<MotherForm {...baseProps} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Motivo abrazo')).toBeInTheDocument();
    expect(container.querySelector('input[name="nombre"]')).toHaveValue('Rosa');
    expect(container.querySelector('input[name="dni"]')).toHaveValue('40123456');
  });

  it('actualiza el modelo al tipear el nombre', () => {
    const setModel = vi.fn();
    const { container } = render(<MotherForm {...baseProps} setModel={setModel} />);
    fireEvent.change(container.querySelector('input[name="nombre"]'), {
      target: { value: 'Rosana', name: 'nombre' },
    });
    expect(setModel).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Rosana' }));
  });

  it('solo acepta dígitos en el DNI', () => {
    const setModel = vi.fn();
    const { container } = render(<MotherForm {...baseProps} setModel={setModel} />);
    fireEvent.change(container.querySelector('input[name="dni"]'), {
      target: { value: '12ab34', name: 'dni' },
    });
    expect(setModel).toHaveBeenCalledWith(expect.objectContaining({ dni: 1234 }));
  });

  it('muestra el error de campo recibido', () => {
    render(<MotherForm {...baseProps} fieldErrors={{ dni: 'DNI duplicado' }} />);
    expect(screen.getByText('DNI duplicado')).toBeInTheDocument();
  });
});
